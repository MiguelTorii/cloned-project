/* eslint-disable no-empty */
// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import update from 'immutability-helper';
import Chat from 'twilio-chat';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import type { State as StoreState } from '../../types/state';
import type { ChatChannels } from '../../types/models';
import { renewTwilioToken, leaveChat, blockChatUser } from '../../api/chat';
import { logEvent } from '../../api/analytics';
import MainChat from '../../components/FloatingChat/MainChat';
import ChatChannel from './ChatChannel';
import ChatListItem from './ChatListItem';
import CreateChatChannel from '../CreateChatChannel';
import ErrorBoundary from '../ErrorBoundary';
import * as webNotificationsActions from '../../actions/web-notifications';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end'
  },
  noMessages: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  },
  info: {
    backgroundColor: 'red'
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  chat: ChatState,
  enqueueSnackbar: Function,
  updateTitle: Function
};

type State = {
  openChannels: ChatChannels,
  client: ?Object,
  channels: Array<Object>,
  unread: number,
  online: boolean,
  createChannel: ?string
};

class FloatingChat extends React.PureComponent<Props, State> {
  state = {
    openChannels: [],
    client: null,
    channels: [],
    unread: 0,
    online: true,
    createChannel: null
  };

  componentDidMount = () => {
    this.initiated = false;
    this.mounted = true;
    this.updateOpenChannels = debounce(this.updateOpenChannels, 250);
    this.handleInitChat = debounce(this.handleInitChat, 1000);
    window.addEventListener('resize', this.updateOpenChannels);
    window.addEventListener('offline', () => {
      console.log('**** offline ****');
      this.setState({ online: false });
      if(this.mounted) this.handleShutdownChat();
    });
    window.addEventListener('online', () => {
      console.log('**** online ****');
      const {online} = this.state;
      if(!online && this.mounted) window.location.reload()
      // this.setState({ online: true });
    });
    this.handleInitChat();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      user: {
        data: { userId, profileImage }
      },
      chat: {
        data: { uuid }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId, profileImage: prevProfileImage }
      },
      chat: {
        data: { uuid: prevUuid }
      }
    } = prevProps;
    const { online } = this.state;
    if (prevUserId !== '' && userId === '' && this.mounted) {
      this.handleShutdownChat();
    } else if (
      ((prevUserId === '' && userId !== '' && online) ||
      (userId !== '' && online && !prevState.online)) && this.mounted
    ) {
      this.handleInitChat();
    }
    if (uuid !== prevUuid && uuid !== '' && this.mounted) this.handleCreateChannelOpen('group');

    if (profileImage !== prevProfileImage && prevProfileImage !== '') {
      const { client } = this.state;
      if (client && this.mounted) {
        try {
          client.user.updateAttributes({
            ...client.user.attributes,
            profileImageUrl: profileImage
          });
        } catch (err) {
        }
      }
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
    if (
      this.updateOpenChannels.cancel &&
      typeof this.updateOpenChannels.cancel === 'function'
    )
      this.updateOpenChannels.cancel();

    if (
      this.handleInitChat.cancel &&
      typeof this.handleInitChat.cancel === 'function'
    )
      this.handleInitChat.cancel();
    this.handleShutdownChat();
  };

  handleRoomClick = roomId => {
    try {
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
    } catch (err) {
    }
  };

  handleChannelClose = channelId => {
    try {
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
    } catch (err) {
    }
  };

  handleUpdateUnreadCount = unread => {
    try {
      this.setState(prevState => ({
        unread: prevState.unread + Number(unread)
      }));
    } catch (err) {
    }
  };

  updateOpenChannels = () => {
    try {
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
    } catch (err) {
    }
  };

  getAvailableSlots = width => {
    try {
      const chatSize = 320;
      return Math.trunc((width - chatSize) / chatSize);
    } catch (err) {
      return 0;
    }
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
        data: { userId }
      }
    } = this.props;

    if (userId === '' || this.initiated || !this.mounted) return;

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

      // let paginator = await client.getSubscribedChannels();
      // while (paginator.hasNextPage) {
      //   // eslint-disable-next-line no-await-in-loop
      //   paginator = await paginator.nextPage();
      // }
      // const channels = await client.getLocalChannels({
      //   criteria: 'lastMessage',
      //   order: 'descending'
      // });
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
          const { updateTitle } = this.props;
          updateTitle({
            title: `${firstName} ${lastName} sent you a message:`,
            body
          });
        }
      });

      client.on('tokenAboutToExpire', async () => {
        const newToken = await renewTwilioToken({
          userId
        });
        if (!newToken || (newToken && newToken === '')) {
          return;
        }
        await client.updateToken(newToken);
      });
    } catch (err) {
    }
  };

  handleShutdownChat = () => {
    const { client } = this.state;
    if (client) {
      try {
        client.shutdown();
      } catch (err) {
      }
    }
    this.setState({ client: null, channels: [], openChannels: [], unread: 0 });
  };

  handleRemoveChannel = async ({ sid }) => {
    try {
      await leaveChat({ sid });
    } catch (err) {
    }
  };

  handleBlock = async blockedUserId => {
    try {
      await blockChatUser({ blockedUserId });
    } catch (err) {
    }
  };

  handleCreateChannelOpen = type => {
    this.setState({ createChannel: type });
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
      if (win && win.focus) win.focus();
    }
  };

  mounted: boolean;
  
  initiated: boolean;

  render() {
    const { classes, user } = this.props;
    const {
      client,
      openChannels,
      channels,
      unread,
      createChannel
    } = this.state;
    const {
      data: { userId }
    } = user;

    if (userId === '' || !client) return null;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            {openChannels.map(item => (
              <ChatChannel
                key={item.sid}
                user={user}
                channel={item}
                onClose={this.handleChannelClose}
                onRemove={this.handleRemoveChannel}
                onBlock={this.handleBlock}
              />
            ))}
            <MainChat
              unread={unread}
              onCreateChannel={this.handleCreateChannelOpen}
            >
              {channels.length === 0 ? (
                <div className={classes.noMessages}>
                  <Typography variant="subtitle1" align="center">
                    Start a study session by tapping on the icons above
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
            </MainChat>
          </div>
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

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateTitle: webNotificationsActions.updateTitle
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withSnackbar(withStyles(styles)(FloatingChat))));
