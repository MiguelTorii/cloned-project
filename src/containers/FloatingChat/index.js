// @flow

import React from 'react';
import update from 'immutability-helper';
import Chat from 'twilio-chat';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import MainChat from '../../components/FloatingChat/MainChat';
import ChatChannel from './ChatChannel';
import ChatListItem from './ChatListItem';
import { renewTwilioToken } from '../../api/chat';

const styles = () => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 2000,
    display: 'flex',
    alignItems: 'flex-end'
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  openChannels: Array<string>,
  client: ?Object,
  channels: Array<Object>,
  unread: number
};

class FloatingChat extends React.PureComponent<Props, State> {
  state = {
    openChannels: [],
    client: null,
    channels: [],
    unread: 0
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.updateOpenChannels);
  };

  componentDidUpdate = prevProps => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId }
      }
    } = prevProps;
    if (prevUserId !== '' && userId === '') {
      this.handleShutdownChat();
    } else if (prevUserId === '' && userId !== '') {
      this.handleInitChat();
    }
  };

  componentWillUnmount = () => {
    this.handleShutdownChat();
  };

  handleRoomClick = roomId => {
    const availableSlots = this.getAvailableSlots(window.innerWidth);
    if (availableSlots === 0) {
      return;
    }

    const { channels } = this.state;

    const channel = channels.find(item => item.sid === roomId);

    if (!channel) return;

    const newState = update(this.state, {
      openChannels: {
        $apply: b => {
          if (availableSlots === 0) return [];
          const index = b.findIndex(item => item.sid === roomId);
          if (index > -1) {
            let newB = update(b, { $splice: [[index, 1]] });
            newB = update(newB, { $splice: [[availableSlots - 1]] });
            return [channel, ...newB];
          }
          const newB = update(b, { $splice: [[availableSlots - 1]] });
          return [channel, ...newB];
        }
      }
    });
    this.setState(newState);
  };

  handleChannelClose = channelId => {
    const newState = update(this.state, {
      openChannels: {
        $apply: b => {
          const index = b.findIndex(item => item.sid === channelId);
          if (index > -1) {
            return update(b, { $splice: [[index, 1]] });
          }
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleUpdateUnreadCount = unread => {
    this.setState(prevState => ({ unread: prevState.unread + Number(unread) }));
  };

  updateOpenChannels = () => {
    const availableSlots = this.getAvailableSlots(window.innerWidth);
    if (availableSlots === 0) {
      this.setState({ openChannels: [] });
      return;
    }

    const newState = update(this.state, {
      openChannels: {
        $apply: b => {
          const newB = update(b, { $splice: [[availableSlots]] });
          return [...newB];
        }
      }
    });
    this.setState(newState);
  };

  getAvailableSlots = width => {
    const chatSize = 320;
    return Math.trunc((width - chatSize) / chatSize);
  };

  handleMessageReceived = id => () => (
    <Button
      onClick={() => {
        this.handleRoomClick(id);
      }}
    >
      Open
    </Button>
  );

  handleInitChat = async () => {
    const {
      user: {
        data: { twilioToken }
      }
    } = this.props;

    try {
      const client = await Chat.create(twilioToken);

      let paginator = await client.getSubscribedChannels();
      while (paginator.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        paginator = await paginator.nextPage();
      }
      const channels = await client.getLocalChannels({
        criteria: 'lastMessage',
        order: 'descending'
      });
      this.setState({ client, channels });

      client.on('channelJoined', async channel => {
        this.setState(prevState => ({
          channels: [...prevState.channels, channel]
        }));
      });

      client.on('channelLeft', async channel => {
        this.setState(prevState => ({
          channels: prevState.channels.filter(c => c.sid !== channel.sid)
        }));
        this.handleChannelClose(channel.sid);
      });

      client.on('channelUpdated', async ({ channel, updateReasons }) => {
        if (
          updateReasons.length > 0 &&
          updateReasons.indexOf('lastMessage') > -1
        ) {
          const first = channel.sid;
          this.setState(prevState => ({
            channels: prevState.channels.sort((x, y) => {
              // eslint-disable-next-line no-nested-ternary
              return x.sid === first ? -1 : y.sid === first ? 1 : 0;
            })
          }));
        }
      });

      client.on('messageAdded', async message => {
        const { state, channel } = message;
        const { author, attributes, body } = state;
        const { firstName, lastName } = attributes;
        const {
          user: {
            data: { userId }
          },
          enqueueSnackbar
        } = this.props;
        if (Number(author) !== Number(userId)) {
          const msg = `${firstName} ${lastName} sent you a message:`;
          enqueueSnackbar(`${msg} ${body}`, {
            variant: 'info',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            action: this.handleMessageReceived(channel.sid),
            autoHideDuration: 3000
          });
        }
      });

      client.on('tokenAboutToExpire', async () => {
        const {
          user: {
            data: { userId }
          }
        } = this.props;
        const accessToken = await renewTwilioToken({
          userId
        });
        await client.updateToken(accessToken);
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleShutdownChat = () => {
    const { client } = this.state;
    if (client) {
      client.shutdown();
    }
    this.setState({ client: null, channels: [], openChannels: [], unread: 0 });
  };

  render() {
    const { classes, user } = this.props;
    const { openChannels, channels, unread } = this.state;
    const {
      data: { userId }
    } = user;

    if (userId === '') return null;

    return (
      <div className={classes.root}>
        {openChannels.map(item => (
          <ChatChannel
            key={item.sid}
            user={user}
            channel={item}
            onClose={this.handleChannelClose}
          />
        ))}
        <MainChat unread={unread}>
          {channels.map(item => (
            <ChatListItem
              key={item.sid}
              channel={item}
              userId={userId}
              onOpenChannel={this.handleRoomClick}
              onUpdateUnreadCount={this.handleUpdateUnreadCount}
            />
          ))}
        </MainChat>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withRoot(withSnackbar(withStyles(styles)(FloatingChat))));
