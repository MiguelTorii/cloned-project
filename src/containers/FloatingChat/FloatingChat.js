/* eslint-disable no-empty */
// @flow

import React, { Fragment, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import usePrevious from 'hooks/usePrevious'
import ChatListItem from 'components/ChatListItem';
import { updateTitle } from 'actions/web-notifications';
import { enqueueSnackbar } from 'actions/notifications';
import moment from 'moment'
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import type { State as StoreState } from '../../types/state';
import { logEvent } from '../../api/analytics';
import MainChat from '../../components/FloatingChat/MainChat';
import Tooltip from '../Tooltip';
import ChatChannel from './ChatChannel';
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
  handleRoomClick: Function,
  updateOpenChannels: Function,
  handleChannelClose: Function,
  enqueueSnackbarAction: Function,
  updateTitleAction: Function,
  push: Function
};

const FloatingChat = ({
  classes,
  user,
  chat,
  push,
  router,
  handleInitChat,
  handleShutdownChat,
  handleBlockUser,
  handleRemoveChannel,
  handleRoomClick,
  updateOpenChannels,
  handleChannelClose,
  enqueueSnackbarAction,
  updateTitleAction,
}: Props) => {
  const [createChannel, setCreateChat] = useState(null)
  const [unread, setUnread] = useState(0)
  const [channelList, setChannelList] = useState([])

  const {
    data: {
      uuid,
      client,
      channels,
      newMessage,
      online,
      local,
      openChannels
    }
  } = chat

  const {
    data: { userId, profileImage }
  } = user

  const handleMessageReceived = channel => () => (
    <Button
      onClick={() => {
        handleRoomClick(channel);
      }}
    >
      Open
    </Button>
  );

  useEffect(() => {
    if(local) {
      let unread = 0
      const channelList = Object.keys(local).filter(l => local[l].sid).sort((a, b) => {
        if (!local[a].lastMessage.message) return 0
        return moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
      })
      setChannelList(channelList)
      Object.keys(local).forEach(l => {
        unread += local[l].unread
      })
      setUnread(unread)
    }
  }, [local])

  useEffect(() => {
    const handleMessage =() =>{
      const { state, channel } = newMessage;
      const { author, attributes, body } = state;
      const { firstName, lastName } = attributes;
      const sids = openChannels.map(oc => oc.sid)
      if (Number(author) !== Number(userId) && window.location.pathname !== '/chat' && !sids.includes(channel.sid)) {
        const msg = `${firstName} ${lastName} sent you a message:`;
        enqueueSnackbarAction({
          notification: {
            message: `${msg} ${body}`,
            options: {
              variant: 'info',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              action: handleMessageReceived(channel),
              autoHideDuration: 3000,
              ContentProps: {
                classes: {
                  root: classes.snackbarStyle
                }
              }
            }}});
        updateTitleAction({
          title: `${firstName} ${lastName} sent you a message:`,
          body
        });
      }
    }
    if(newMessage) handleMessage()

  }, [newMessage])

  const { location: { pathname}} = router
  useEffect(() => {
    const init = () => {
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
      handleInitChatDebounce();

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
    }

    if(pathname !== '/chat') return init()

    // eslint-disable-next-line
  }, [pathname])

  const prevChat = usePrevious(chat)
  const prevUser = usePrevious(user)

  const handleCreateChannelOpen = type => {
    setCreateChat(type)
  };

  useEffect(() => {
    if (prevUser && prevChat && pathname !== '/chat') {
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
        handleInitChat();
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
    // eslint-disable-next-line
  }, [user, chat, online])


  const handleChannelCreated = ({
    channel,
    startVideo = false
  }: {
    channel: Object,
    startVideo: boolean
  }) => {
    handleRoomClick(channel);
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

  const handleCreateChannelClose = () => {
    setCreateChat(null)
  };

  if (pathname === '/chat' ||  userId === '' || !client) return null;

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
              {channelList.length === 0 ? (
                <div className={classes.noMessages}>
                  <Typography variant="subtitle1" align="center">Setup a group chat for the class to hold conversations and share important info</Typography>
                </div>
              ) : (
                channelList.map(c => (
                  <ChatListItem
                    key={local[c].sid}
                    channel={local[c]}
                    userId={userId}
                    onOpenChannel={handleRoomClick}
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

const mapStateToProps = ({ router, user, chat }: StoreState): {} => ({
  user,
  router,
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
      handleRoomClick: chatActions.handleRoomClick,
      updateOpenChannels: chatActions.updateOpenChannels,
      handleChannelClose: chatActions.handleChannelClose,
      updateTitleAction: updateTitle,
      enqueueSnackbarAction: enqueueSnackbar,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(FloatingChat)));
