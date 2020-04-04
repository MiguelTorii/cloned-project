/* eslint-disable no-empty */
// @flow

import React, { Fragment, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import usePrevious from 'hooks/usePrevious'
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import type { State as StoreState } from '../../types/state';
import { logEvent } from '../../api/analytics';
import MainChat from '../../components/FloatingChat/MainChat';
import Tooltip from '../Tooltip';
import ChatChannel from './ChatChannel';
import ChatListItem from './ChatListItem';
import CreateChatChannel from '../CreateChatChannel';
import ErrorBoundary from '../ErrorBoundary';
import * as chatActions from '../../actions/chat';

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
    margin: theme.spacing(2)
  },
  info: {
    backgroundColor: 'red'
  },
  snackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  chat: ChatState,
  handleInitChat: Function,
  handleShutdownChat: Function,
  handleBlockUser: Function,
  handleRemoveChannel: Function,
  handleUpdateUnreadCount: Function,
  push: Function
};

const FloatingChat = ({
  classes,
  user,
  chat,
  push,
  handleInitChat,
  handleShutdownChat,
  handleBlockUser,
  handleRemoveChannel,
  handleUpdateUnreadCount
}: Props) => {
  const [createChannel, setCreateChat] = useState(null)
  const [openChannels, setOpenChannels] = useState([])

  const {
    data: {
      uuid,
      client,
      channels,
      unread,
      online,
    }
  } = chat

  const {
    data: { userId, profileImage }
  } = user

  const getAvailableSlots = width => {
    try {
      const chatSize = 320;
      return Math.trunc((width - chatSize) / chatSize);
    } catch (err) {
      return 0;
    }
  };

  const handleRoomClick = channel => {
    try {
      const availableSlots = getAvailableSlots(window.innerWidth);
      if (availableSlots === 0) {
        return;
      }

      const newState = update(openChannels, {
        $apply: b => {
          if (availableSlots === 0) return [];
          const index = b.findIndex(item => item.sid === channel.sid);
          if (index > -1) {
            let newB = update(b, { $splice: [[index, 1]] });
            newB = update(newB, { $splice: [[availableSlots - 1]] });
            return [channel, ...newB];
          }
          const newB = update(b, { $splice: [[availableSlots - 1]] });
          return [channel, ...newB];
        }
      });
      setOpenChannels(newState)
    } catch (err) {}
  };

  const handleMessageReceived = channel => () => (
    <Button
      onClick={() => {
        handleRoomClick(channel);
      }}
    >
      Open
    </Button>
  );

  const updateOpenChannels = () => {
    try {
      const availableSlots = getAvailableSlots(window.innerWidth);
      if (availableSlots === 0) {
        setOpenChannels([]);
        return;
      }

      const newState = update(openChannels, {
        $apply: b => {
          const newB = update(b, { $splice: [[availableSlots]] });
          return [...newB];
        }
      });
      setOpenChannels(newState);
    } catch (err) {}
  };

  useEffect(() => {
    const updateOpenChannelsDebounce = debounce(updateOpenChannels, 250);
    const handleInitChatDebounce = debounce(handleInitChat, 1000);
    window.addEventListener('resize', updateOpenChannelsDebounce);
    window.addEventListener('offline', () => {
      console.log('**** offline ****');
      handleShutdownChat();
    });
    window.addEventListener('online', () => {
      console.log('**** online ****');
      if (!online) window.location.reload();
    });
    handleInitChatDebounce({ snackbarStyle: classes.snackbar, handleMessageReceived });

    return () => {
      if (
        updateOpenChannelsDebounce.cancel &&
      typeof updateOpenChannelsDebounce.cancel === 'function'
      )
        updateOpenChannelsDebounce.cancel();

      if (
        handleInitChatDebounce.cancel &&
      typeof handleInitChatDebounce.cancel === 'function'
      )
        handleInitChatDebounce.cancel();
      handleShutdownChat();
    };

  }, [])

  const prevChat = usePrevious(chat)
  const prevUser = usePrevious(user)

  const handleCreateChannelOpen = type => {
    setCreateChat(type)
  };

  useEffect(() => {
    if (prevUser && prevChat) {
      const {
        data: { userId: prevUserId }
      } = prevUser

      const {
        data: { uuid: prevUuid }
      } = prevChat

      if (prevUserId !== '' && userId === '') {
        handleShutdownChat();
      } else if (
        prevUserId === '' && userId !== '' && !online
      ) {
        handleInitChat({ snackbarStyle: classes.snackbar, handleMessageReceived });
      }
      if (uuid !== prevUuid && uuid !== '')
        handleCreateChannelOpen('group');

      if (client && profileImage !== '') {
        try {
          if (client.user.attributes.profileImageUrl !== profileImage)
            client.user.updateAttributes({
              ...client.user.attributes,
              profileImageUrl: profileImage
            });
        } catch (err) {}
      }
    }
  }, [user, chat, online])

  const handleCreateChannelClose = () => {
    setCreateChat(null)
  };

  const handleChannelClose = sid => {
    setOpenChannels(openChannels.filter(oc => oc.sid !== sid))
  }

  const handleChannelCreated = ({
    channel,
    startVideo = false
  }: {
    channel: Object,
    startVideo: boolean
  }) => {
    handleRoomClick(channel.sid);
    if (startVideo) {
      logEvent({
        event: 'Video- Start Video',
        props: { 'Initiated From': 'Profile' }
      });
      const win = window.open(`/video-call/${channel.sid}`, '_blank');
      if (win && win.focus) win.focus();
      if (!win || win.closed || typeof win.closed === 'undefined') {
        push(`/video-call/${channel.sid}`);
      }
    }
  };

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
              onClose={handleChannelClose}
              onRemove={handleRemoveChannel}
              onBlock={handleBlockUser}
            />
          ))}
          <Tooltip
            id={3292}
            placement="top"
            text="Setup a group chat with your class to connect on topics and discuss problems"
          >
            <MainChat
              unread={unread}
              onCreateChannel={handleCreateChannelOpen}
            >
              {channels.length === 0 ? (
                <div className={classes.noMessages}>
                  <Typography variant="subtitle1" align="center">
                     Begin an individual or group chat with any of your classmates by tapping on the icons above
                  </Typography>
                </div>
              ) : (
                channels.map(item => (
                  <ChatListItem
                    key={item.sid}
                    channel={item}
                    userId={userId}
                    onOpenChannel={handleRoomClick}
                    onUpdateUnreadCount={handleUpdateUnreadCount}
                  />
                ))
              )}
            </MainChat>
          </Tooltip>
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <CreateChatChannel
          type={createChannel}
          client={client}
          channels={channels}
          onClose={handleCreateChannelClose}
          onChannelCreated={handleChannelCreated}
        />
      </ErrorBoundary>
    </Fragment>
  );
}

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      handleInitChat: chatActions.handleInitChat,
      handleShutdownChat: chatActions.handleShutdownChat,
      handleBlockUser: chatActions.handleBlockUser,
      handleRemoveChannel: chatActions.handleRemoveChannel,
      handleUpdateUnreadCount: chatActions.handleUpdateUnreadCount,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(FloatingChat)));
