/* eslint-disable no-empty */
// @flow

import React, { useCallback, Fragment, useState, useEffect } from 'react';
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
import CircularProgress from '@material-ui/core/CircularProgress'
import * as OnboardingActions from 'actions/onboarding';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import type { State as StoreState } from '../../types/state';
import { logEvent } from '../../api/analytics';
import MainChat from '../../components/FloatingChat/MainChat';
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
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  info: {
    backgroundColor: 'red'
  },
  snackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  loading: {
    width: '100%',
    marginTop: theme.spacing(2),
    textAlign: 'center'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  chat: ChatState,
  handleBlockUser: Function,
  handleRemoveChannel: Function,
  handleRoomClick: Function,
  updateOpenChannels: Function,
  handleChannelClose: Function,
  enqueueSnackbarAction: Function,
  updateTitleAction: Function,
  handleMuteChannel: Function,
  handleNewChannel: Function,
  push: Function,
  onboardingListVisible: boolean,
  getOnboardingList: Function
  // markAsCompleted: Function
};

const FloatingChat = ({
  classes,
  user,
  chat,
  push,
  router,
  handleBlockUser,
  handleRemoveChannel,
  handleRoomClick,
  handleMuteChannel,
  updateOpenChannels,
  handleChannelClose,
  handleNewChannel,
  enqueueSnackbarAction,
  updateTitleAction,
  onboardingListVisible,
  // markAsCompleted,
  getOnboardingList
}: Props) => {
  const [createChannel, setCreateChat] = useState(null)
  const [unread, setUnread] = useState(0)
  const [channelList, setChannelList] = useState([])

  const {
    isLoading,
    data: {
      uuid,
      client,
      channels,
      newMessage,
      online,
      local,
      newChannel,
      openChannels
    }
  } = chat

  const getMembers = useCallback(channel => {
    if (channel && local && local[channel.sid]) {
      const { members } = local[channel.sid]
      const newMembers = {}
      members.forEach(m => {
        newMembers[m.userId] = m
      })
      return newMembers
    }
    return []
  }, [local])

  const {
    data: { userId, profileImage }
  } = user


  const handleNewChannelOpen = useCallback(() => {
    handleNewChannel(true)
  }, [handleNewChannel])

  const handleNewChannelClose = useCallback(() => {
    handleNewChannel(false)
  }, [handleNewChannel])

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
    if (local) {
      let unread = 0
      const cl = Object.keys(local).filter(l => local[l].sid).sort((a, b) => {
        if (!local[a].lastMessage.message) return 0
        return moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
      })
      setChannelList(cl)
      Object.keys(local).forEach(l => {
        if (local[l]?.unread) unread += local[l].unread
      })
      setUnread(unread)
    }
  }, [local])

  const [prevMessageId, setPrevMessageId] = useState('')

  useEffect(() => {
    const handleMessage = () => {
      const { state, channel } = newMessage;
      const { author, attributes, body } = state;
      const { firstName, lastName } = attributes;
      const sids = openChannels.map(oc => oc.sid)
      setPrevMessageId(newMessage.sid)
      if (
        Number(author) !== Number(userId) &&
        window.location.pathname !== '/chat' &&
        !sids.includes(channel.sid) &&
        !local[channel.sid].muted
      ) {
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
            }
          }
        });
        updateTitleAction({
          title: `${firstName} ${lastName} sent you a message:`,
          body
        });
      }
    }
    if (newMessage && prevMessageId !== newMessage.sid) handleMessage()

    // eslint-disable-next-line
  }, [newMessage, local, prevMessageId])

  const { location: { pathname } } = router
  useEffect(() => {
    handleNewChannelClose()
    const updateOpenChannelsDebounce = debounce(updateOpenChannels, 250);
    window.addEventListener('resize', updateOpenChannelsDebounce);

    return () => {
      window.removeEventListener('resize', updateOpenChannelsDebounce)
      if (
        updateOpenChannelsDebounce.cancel &&
          typeof updateOpenChannelsDebounce.cancel === 'function'
      )
        updateOpenChannelsDebounce.cancel();
    };
  }, [handleNewChannelClose, updateOpenChannels])

  const prevChat = usePrevious(chat)

  const handleCreateChannelOpen = type => {
    setCreateChat(type)
  };

  useEffect(() => {
    if (prevChat && pathname !== '/chat') {
      const {
        data: { uuid: prevUuid }
      } = prevChat

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

  const onChannelOpen = ({ channel }) => {
    handleRoomClick(channel)
  }

  const handleChannelCreated = ({
    channel,
    startVideo = false
  }: {
    channel: Object,
    startVideo: boolean
  }) => {
    handleNewChannelClose()
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

  if (pathname === '/chat' || userId === '' || !client) return null;

  return (
    <Fragment>
      <ErrorBoundary>
        <div className={classes.root}>
          {openChannels.map(item => (
            <ChatChannel
              key={`op${item.sid}`}
              getMembers={getMembers}
              user={user}
              channel={item}
              localChannel={local[item.sid]}
              onClose={handleChannelClose}
              onRemove={handleRemoveChannel}
              onBlock={handleBlockUser}
              onSend={() => {
                if (onboardingListVisible) setTimeout(() => getOnboardingList(), 1000)
              }}
            />
          ))}
          <ErrorBoundary>
            {newChannel && <ChatChannel
              user={user}
              onClose={handleNewChannelClose}
              newChannel
              handleChannelCreated={handleChannelCreated}
              channel={{
                sid: '',
                setAllMessagesConsumed: () => {},
                getMessages: () => {},
                on: () => {},
                typing: () => {},
                sendMessage: () => {},
                channelState: { attributes: { friendlyName: 'New Chat' } }
              }}
            />}
          </ErrorBoundary>
          <MainChat
            unread={unread}
            onCreateChannel={handleNewChannelOpen}
          >
            {channelList.length === 0 ? (
              <div className={classes.noMessages}>
                <Typography variant="subtitle1" align="center">Setup a group chat for the class to hold conversations and share important info</Typography>
                {isLoading && <div className={classes.loading}>
                  <CircularProgress />
                </div>}
              </div>
            ) : (
              channelList.map(c => (
                local[c] && <ChatListItem
                  key={local[c].sid}
                  channel={local[c]}
                  userId={userId}
                  handleMuteChannel={handleMuteChannel}
                  handleRemoveChannel={handleRemoveChannel}
                  onOpenChannel={onChannelOpen}
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
          onClose={handleCreateChannelClose}
          onChannelCreated={handleChannelCreated}
        />
      </ErrorBoundary>
    </Fragment>
  );
}

const mapStateToProps = ({ router, user, chat, onboarding }: StoreState): {} => ({
  user,
  router,
  chat,
  onboardingListVisible: onboarding.onboardingList.visible
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      handleMuteChannel: chatActions.handleMuteChannel,
      handleBlockUser: chatActions.handleBlockUser,
      handleRemoveChannel: chatActions.handleRemoveChannel,
      handleRoomClick: chatActions.handleRoomClick,
      updateOpenChannels: chatActions.updateOpenChannels,
      handleChannelClose: chatActions.handleChannelClose,
      handleNewChannel: chatActions.handleNewChannel,
      updateTitleAction: updateTitle,
      enqueueSnackbarAction: enqueueSnackbar,
      // markAsCompleted: OnboardingActions.markAsCompleted,
      getOnboardingList: OnboardingActions.getOnboardingList
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(FloatingChat)));
