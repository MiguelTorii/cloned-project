/* eslint-disable no-empty */
// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import Chat from 'twilio-chat';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import ErrorBoundary from '../ErrorBoundary';
import ChatListItem from '../FloatingChat/ChatListItem';
import ChatChannel from './DialogChannel';
import CreateChatChannel from '../CreateChatChannel';
import { renewTwilioToken } from '../../api/chat';
import { logEvent } from '../../api/analytics';

const styles = theme => ({
  root: {
    position: 'relative'
  },
  fab: {
    position: 'fixed',
    bottom: 70,
    right: 15,
    zIndex: 9999
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  enqueueSnackbar: Function
};

type State = {
  online: boolean,
  channels: Array<Object>,
  unread: number,
  client: ?Object,
  createChannel: ?string,
  openChannel: ?Object
};

class ChatContainer extends React.PureComponent<Props, State> {
  state = {
    online: true,
    channels: [],
    unread: 0,
    client: null,
    createChannel: null,
    openChannel: null
  };

  componentDidMount = () => {
    this.initiated = false;
    // this.updateOpenChannels = debounce(this.updateOpenChannels, 250);
    this.handleInitChat = debounce(this.handleInitChat, 1000);
    window.addEventListener('offline', () => {
      console.log('**** offline ****');
      this.setState({ online: false });
      this.handleShutdownChat();
    });
    window.addEventListener('online', () => {
      console.log('**** online ****');
      this.setState({ online: true });
    });
    this.handleInitChat();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      user: {
        data: { userId, profileImage }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId, profileImage: prevProfileImage }
      }
    } = prevProps;
    const { online } = this.state;
    if (prevUserId !== '' && userId === '') {
      this.handleShutdownChat();
    } else if (
      (prevUserId === '' && userId !== '' && online) ||
      (userId !== '' && online && !prevState.online)
    ) {
      this.handleInitChat();
    }

    if (profileImage !== prevProfileImage && prevProfileImage !== '') {
      const { client } = this.state;
      if (client) {
        try {
          client.user.updateAttributes({
            ...client.user.attributes,
            profileImageUrl: profileImage
          });
        } catch (err) {}
      }
    }
  };

  handleInitChat = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    if (userId === '' || this.initiated) return;

    this.initiated = true;

    try {
      const accessToken = await renewTwilioToken({
        userId
      });

      if (!accessToken || (accessToken && accessToken === '')) {
        this.handleInitChat();
        return;
      }

      const client = await Chat.create(accessToken);

      const channels = [];
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
        // this.handleChannelClose(channel.sid);
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
        const { enqueueSnackbar, classes } = this.props;
        if (Number(author) !== Number(userId)) {
          const msg = `${firstName} ${lastName} sent you a message:`;
          enqueueSnackbar(`${msg} ${body}`, {
            variant: 'info',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
            action: this.handleMessageReceived(channel.sid),
            autoHideDuration: 3000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          });
        }
      });

      client.on('tokenAboutToExpire', async () => {
        const newToken = await renewTwilioToken({
          userId
        });
        await client.updateToken(newToken);
      });
    } catch (err) {}
  };

  handleShutdownChat = () => {
    const { client } = this.state;
    if (client) {
      try {
        client.shutdown();
      } catch (err) {}
    }
    this.setState({ client: null, channels: [], unread: 0 });
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

  handleRoomClick = roomId => {
    const { channels } = this.state;

    const channel = channels.find(item => item.sid === roomId);

    if (!channel) return;

    this.setState({ openChannel: channel });
  };

  handleUpdateUnreadCount = unread => {
    try {
      this.setState(prevState => ({
        unread: prevState.unread + Number(unread)
      }));
    } catch (err) {}
  };

  handleCreateChannelOpen = () => {
    this.setState({ createChannel: 'single' });
  };

  handleCreateChannelClose = () => {
    this.setState({ createChannel: null });
  };

  handleChannelCreated = ({
    channel,
    startVideo = false
  }: {
    channel: Object,
    startVideo: boolean
  }) => {
    this.handleRoomClick(channel.sid);
    if (startVideo) {
      logEvent({
        event: 'Video- Start Video',
        props: { 'Initiated From': 'Profile' }
      });
      const win = window.open(`/video-call/${channel.sid}`, '_blank');
      win.focus();
    }
  };

  handleChannelClose = () => {
    this.setState({ openChannel: null });
  };

  handleKickUser = ({
    channel,
    users,
    blockedUserId
  }: {
    channel: Object,
    users: Array<Object>,
    blockedUserId: string
  }) => {
    try {
      channel.updateAttributes({
        ...channel.state.attributes,
        users
      });
    } catch (err) {}
    try {
      channel.removeMember(String(blockedUserId));
    } catch (err) {}
  };

  handleRemoveChannel = ({ channel, users }) => {
    try {
      channel.updateAttributes({ ...channel.state.attributes, users });
    } catch (err) {}

    try {
      channel.leave();
    } catch (err) {}
  };

  handleRemoveChannels = async blockedUserId => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    const { channels } = this.state;
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const channel of channels) {
        const { state = {} } = channel;
        const { createdBy = '', attributes = {} } = state;
        const { groupType = '', users = [] } = attributes;
        if (users.some(o => Number(o.userId) === Number(blockedUserId))) {
          const newUsers = users.filter(
            o => o.userId.toString() !== blockedUserId.toString()
          );
          if (groupType === '' || users.length <= 2) {
            // eslint-disable-next-line no-await-in-loop
            await this.handleRemoveChannel({ channel, users: newUsers });
          } else if (Number(createdBy) === Number(userId)) {
            // eslint-disable-next-line no-await-in-loop
            await this.handleKickUser({
              channel,
              users: newUsers,
              blockedUserId
            });
            if (newUsers.length <= 1) {
              // eslint-disable-next-line no-await-in-loop
              await this.handleRemoveChannel({ channel, users: newUsers });
            }
          } else {
            // eslint-disable-next-line no-await-in-loop
            await this.handleRemoveChannel({ channel, users: newUsers });
          }
        }
      }
    } catch (err) {}
  };

  initiated: boolean;

  render() {
    const { classes, user } = this.props;
    const { channels, client, createChannel, openChannel } = this.state;
    const {
      data: { userId }
    } = user;

    if (userId === '' || !client) return null;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            {channels.length === 0 ? (
              <div className={classes.noMessages}>
                <Typography variant="subtitle1" align="center">
                  Start a study session by tapping on the button
                </Typography>
              </div>
            ) : (
              channels.map(item => (
                <ChatListItem
                  key={item.sid}
                  channel={item}
                  userId={userId}
                  onOpenChannel={this.handleRoomClick}
                  onUpdateUnreadCount={this.handleUpdateUnreadCount}
                />
              ))
            )}
            {!createChannel && !openChannel && (
              <Fab
                color="primary"
                aria-label="Add"
                className={classes.fab}
                onClick={this.handleCreateChannelOpen}
              >
                <AddIcon />
              </Fab>
            )}
          </div>
          <ErrorBoundary>
            {openChannel && (
              <ChatChannel
                user={user}
                channel={openChannel}
                onClose={this.handleChannelClose}
                onRemove={this.handleRemoveChannel}
                onBlock={this.handleRemoveChannels}
              />
            )}
          </ErrorBoundary>
        </ErrorBoundary>
        <ErrorBoundary>
          <CreateChatChannel
            type={createChannel}
            client={client}
            channels={channels}
            onClose={this.handleCreateChannelClose}
            onChannelCreated={this.handleChannelCreated}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withSnackbar(withStyles(styles)(ChatContainer)));
