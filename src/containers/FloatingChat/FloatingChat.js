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
    this.updateOpenChannels = debounce(this.updateOpenChannels, 250);
    this.handleInitChat = debounce(this.handleInitChat, 1000);
    window.addEventListener('resize', this.updateOpenChannels);
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

    // const { enqueueSnackbar, classes } = this.props;
    // enqueueSnackbar(`MESSAGE RECEIVED`, {
    //   variant: 'info',
    //   anchorOrigin: {
    //     vertical: 'bottom',
    //     horizontal: 'left'
    //   },
    //   autoHideDuration: 2000,
    //   classes: {
    //     root: classes.info
    //   }
    // });
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
    if (prevUserId !== '' && userId === '') {
      this.handleShutdownChat();
    } else if (
      (prevUserId === '' && userId !== '' && online) ||
      (userId !== '' && online && !prevState.online)
    ) {
      this.handleInitChat();
    }
    if (uuid !== prevUuid && uuid !== '') this.handleCreateChannelOpen('group');

    if (profileImage !== prevProfileImage && prevProfileImage !== '') {
      const { client } = this.state;
      if (client) {
        try {
          client.user.updateAttributes({
            ...client.user.attributes,
            profileImageUrl: profileImage
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  componentWillUnmount = () => {
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
      console.log(err);
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
      console.log(err);
    }
  };

  handleUpdateUnreadCount = unread => {
    try {
      this.setState(prevState => ({
        unread: prevState.unread + Number(unread)
      }));
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  };

  getAvailableSlots = width => {
    try {
      const chatSize = 320;
      return Math.trunc((width - chatSize) / chatSize);
    } catch (err) {
      console.log(err);
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

    if (userId === '' || this.initiated) return;

    this.initiated = true;

    try {
      const accessToken = await renewTwilioToken({
        userId
      });

      if (accessToken === '') {
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
        } else {
          console.log('update reasons: ', updateReasons);
        }
      });

      client.on('messageAdded', async message => {
        const { state, channel } = message;
        const { author, attributes, body } = state;
        const { firstName, lastName } = attributes;
        const { enqueueSnackbar } = this.props;
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
        await client.updateToken(newToken);
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleShutdownChat = () => {
    const { client } = this.state;
    if (client) {
      try {
        client.shutdown();
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({ client: null, channels: [], openChannels: [], unread: 0 });
  };

  handleRemoveChannel = async ({ sid }) => {
    // try {
    //   channel.updateAttributes({ ...channel.state.attributes, users });
    // } catch (err) {
    //   console.log('err');
    // }

    try {
      // channel.leave();
      await leaveChat({ sid });
    } catch (err) {
      console.log(err);
    }
  };

  // handleKickUser = ({
  //   channel,
  //   users,
  //   blockedUserId
  // }: {
  //   channel: Object,
  //   users: Array<Object>,
  //   blockedUserId: string
  // }) => {
  //   try {
  //     channel.updateAttributes({
  //       ...channel.state.attributes,
  //       users
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   try {
  //     channel.removeMember(String(blockedUserId));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  handleBlock = async blockedUserId => {
    try {
      await blockChatUser({ blockedUserId });
    } catch (err) {
      console.log(err);
    }
  };

  // handleRemoveChannels = async blockedUserId => {
  //   const {
  //     user: {
  //       data: { userId }
  //     }
  //   } = this.props;

  //   const { channels } = this.state;
  //   try {
  //     // eslint-disable-next-line no-restricted-syntax
  //     for (const channel of channels) {
  //       const { state = {} } = channel;
  //       const { createdBy = '', attributes = {} } = state;
  //       const { groupType = '', users = [] } = attributes;
  //       if (users.some(o => Number(o.userId) === Number(blockedUserId))) {
  //         const newUsers = users.filter(
  //           o => o.userId.toString() !== blockedUserId.toString()
  //         );
  //         if (groupType === '' || users.length <= 2) {
  //           // eslint-disable-next-line no-await-in-loop
  //           await this.handleRemoveChannel({ channel, users: newUsers });
  //         } else if (Number(createdBy) === Number(userId)) {
  //           // eslint-disable-next-line no-await-in-loop
  //           await this.handleKickUser({
  //             channel,
  //             users: newUsers,
  //             blockedUserId
  //           });
  //           if (newUsers.length <= 1) {
  //             // eslint-disable-next-line no-await-in-loop
  //             await this.handleRemoveChannel({ channel, users: newUsers });
  //           }
  //         } else {
  //           // eslint-disable-next-line no-await-in-loop
  //           await this.handleRemoveChannel({ channel, users: newUsers });
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
