/* eslint-disable no-empty */
import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { connect, useSelector, useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import { bindActionCreators } from 'redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withRoot from '../../withRoot';
import ChatListItem from '../../components/ChatListItem/ChatListItem';
import LoadImg from '../../components/LoadImg/LoadImg';
import FloatingMainChat from '../../components/FloatingChat/FloatingMainChat';
import * as OnboardingActions from '../../actions/onboarding';
import * as chatActions from '../../actions/chat';
import { updateTitle } from '../../actions/web-notifications';
import { enqueueSnackbar } from '../../actions/notifications';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import FloatEmptyChat from '../../assets/svg/float_empty_chat.svg';
import FloatLoadingChat from '../../assets/svg/float_chat_loading.svg';
import usePrevious from '../../hooks/usePrevious';
import type { State as StoreState } from '../../types/state';
import { logEvent } from '../../api/analytics';
import { truncate } from '../../utils/helpers';
import ChatChannel from './ChatChannel';
import CreateChatChannel from '../CreateChatChannel/CreateChatChannel';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { CampaignState } from '../../reducers/campaign';
import { setCurrentCommunityIdAction, setCurrentChannelSidAction } from '../../actions/chat';
import { blockChatUser } from '../../api/chat';

const MESSAGE_CONTENT_CHARACTER_LIMIT = 50;

const styles = (theme) => ({
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
  classes?: Record<string, any>;
  user?: UserState;
  chat?: ChatState;
  router?: any;
  handleRemoveChannel?: (...args: Array<any>) => any;
  handleRoomClick?: (...args: Array<any>) => any;
  updateOpenChannels?: (...args: Array<any>) => any;
  handleChannelClose?: (...args: Array<any>) => any;
  enqueueSnackbarAction?: (...args: Array<any>) => any;
  setCurrentCommunityId?: (...args: Array<any>) => any;
  updateTitleAction?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  handleNewChannel?: (...args: Array<any>) => any;
  push?: (...args: Array<any>) => any;
  onboardingListVisible?: boolean;
  getOnboardingList?: (...args: Array<any>) => any;
  setCurrentChannel?: (...args: Array<any>) => any;
  setCurrentCommunityChannel?: (...args: Array<any>) => any;
};

const FloatingChat = ({
  classes,
  user,
  chat,
  push,
  router,
  handleRemoveChannel,
  handleRoomClick,
  handleMuteChannel,
  updateOpenChannels,
  handleChannelClose,
  setCurrentCommunityId,
  handleNewChannel,
  enqueueSnackbarAction,
  updateTitleAction,
  onboardingListVisible,
  setCurrentChannel,
  getOnboardingList,
  setCurrentCommunityChannel
}: Props) => {
  const dispatch = useDispatch();

  const [createChannel, setCreateChat] = useState(null);
  const [unread, setUnread] = useState(0);
  const [channelList, setChannelList] = useState([]);
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
      openChannels,
      currentChannel,
      currentCommunityChannel,
      currentCommunityId
    }
  } = chat;
  const {
    location: { pathname }
  } = router;
  const showNotification = useCallback(
    (channel) => {
      if (!pathname.includes('chat')) {
        return false;
      }

      if (currentCommunityId === 'chat' || !currentCommunityId) {
        return currentChannel?.sid === channel.sid;
      }

      return currentCommunityChannel?.sid === channel.sid;
    },
    [currentCommunityId, currentChannel, currentCommunityChannel, pathname]
  );
  const getMembers = useCallback(
    (channel) => {
      if (channel && local && local[channel.sid]) {
        const { members } = local[channel.sid];
        const newMembers = {};
        members.forEach((m) => {
          newMembers[m.userId] = m;
        });
        return newMembers;
      }

      return [];
    },
    [local]
  );
  const {
    data: { userId, profileImage }
  } = user;
  const handleNewChannelOpen = useCallback(() => {
    handleNewChannel(true);
  }, [handleNewChannel]);
  const handleNewChannelClose = useCallback(() => {
    handleNewChannel(false);
  }, [handleNewChannel]);

  const handleOpenChannel = (channel) => {
    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    const {
      channel: {
        channelState: { attributes }
      }
    } = newMessage as any;

    if (attributes?.community_id) {
      dispatch(setCurrentCommunityIdAction(attributes?.community_id));
      setCurrentCommunityChannel(channel);
    } else {
      dispatch(setCurrentCommunityIdAction(null));
      setCurrentChannel(channel);
    }

    dispatch(setCurrentChannelSidAction(channel.sid));
    push('/chat');
  };

  const handleMessageReceived = (channel) => () =>
    (
      <Button
        onClick={() => {
          handleOpenChannel(channel);
        }}
      >
        Open
      </Button>
    );

  const notificationMessageWithoutBody = (files, fullName) => {
    let content = '';

    if (files?.length === 1) {
      content = `${fullName} shared ${files[0].fileName}`;
    }

    if (files?.length > 1) {
      content = `${fullName} shared multiple files`;
    }

    return content;
  };

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  useEffect(() => {
    if (local) {
      let unread = 0;
      const cl = Object.keys(local)
        .filter(
          (l) =>
            // Use `any` type here because `Property 'channelState' is private and only accessible within class 'Channel'.`
            local[l].sid &&
            !(local[l]?.twilioChannel as any)?.channelState?.attributes?.community_id
        )
        .sort((a, b) => {
          if (!local[a].lastMessage.message) {
            return 0;
          }

          return (
            moment(local[b].lastMessage.date).valueOf() -
            moment(local[a].lastMessage.date).valueOf()
          );
        });
      setChannelList(cl);
      cl.forEach((l) => {
        if (local[l]?.unread) {
          unread += local[l].unread;
        }
      });
      setUnread(unread);
    }
  }, [local]);
  const [prevMessageId, setPrevMessageId] = useState('');
  useEffect(() => {
    const handleMessage = () => {
      // Use `any` type because `Property 'state' is private and only accessible within class 'Message'.`
      const { state, channel } = newMessage as any;
      const { author, attributes, body } = state;
      const { firstName, lastName, files } = attributes;
      const sids = openChannels.map((oc) => oc.sid);
      setPrevMessageId(newMessage.sid);

      if (
        Number(author) !== Number(userId) &&
        !showNotification(channel) &&
        !sids.includes(channel.sid) &&
        !local[channel.sid].muted
      ) {
        const msg = `${firstName} ${lastName} sent you a message:`;
        let fullMessageContent = '';

        if (typeof parse(body) === 'string') {
          if (!body) {
            fullMessageContent = notificationMessageWithoutBody(files, `${firstName} ${lastName}`);
          } else {
            fullMessageContent = body;
          }
        } else if (!body.length) {
          fullMessageContent = notificationMessageWithoutBody(files, `${firstName} ${lastName}`);
        } else {
          // TODO add unit tests for regex.
          fullMessageContent = body.replace(/(<([^>]+)>)/gi, '');
        }

        const messageContent = truncate(fullMessageContent, MESSAGE_CONTENT_CHARACTER_LIMIT);
        enqueueSnackbarAction({
          notification: {
            message: `${msg} ${messageContent}`,
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
          body: messageContent
        });
      }
    };

    if (newMessage && prevMessageId !== newMessage.sid) {
      handleMessage();
    } // eslint-disable-next-line
  }, [newMessage, local, prevMessageId]);
  useEffect(() => {
    handleNewChannelClose();
    const updateOpenChannelsDebounce = debounce(updateOpenChannels, 250);
    window.addEventListener('resize', updateOpenChannelsDebounce);
    return () => {
      window.removeEventListener('resize', updateOpenChannelsDebounce);

      if (
        updateOpenChannelsDebounce.cancel &&
        typeof updateOpenChannelsDebounce.cancel === 'function'
      ) {
        updateOpenChannelsDebounce.cancel();
      }
    };
  }, [handleNewChannelClose, updateOpenChannels]);
  const prevChat = usePrevious(chat);

  const handleCreateChannelOpen = (type) => {
    setCreateChat(type);
  };

  useEffect(() => {
    if (prevChat && pathname !== '/chat') {
      const {
        data: { uuid: prevUuid }
      } = prevChat;

      if (uuid !== prevUuid && uuid !== '') {
        handleCreateChannelOpen('group');
      }

      if (client && profileImage !== '') {
        try {
          if ((client.user.attributes as Record<string, any>).profileImageUrl !== profileImage) {
            client.user.updateAttributes({
              ...client.user.attributes,
              profileImageUrl: profileImage
            });
          }
        } catch (err) {}
      }
    } // eslint-disable-next-line
  }, [user, chat, online]);

  const onChannelOpen = ({ channel }) => {
    handleRoomClick(channel);
    dispatch(setCurrentChannelSidAction(channel.sid));
    setCurrentChannel(channel);
  };

  const handleChannelCreated = ({
    channel,
    startVideo = false
  }: {
    channel: Record<string, any>;
    startVideo: boolean;
  }) => {
    handleNewChannelClose();
    handleRoomClick(channel);

    if (startVideo) {
      logEvent({
        event: 'Video- Start Video',
        props: {
          'Initiated From': 'Profile'
        }
      });
      const win = window.open(`/video-call/${channel.sid}`, '_blank');

      if (win && win.focus) {
        win.focus();
      }

      if (!win || win.closed || typeof win.closed === 'undefined') {
        push(`/video-call/${channel.sid}`);
      }
    }
  };

  const handleCreateChannelClose = () => {
    setCreateChat(null);
  };

  if (pathname === '/chat' || isHud === null || isHud === true || userId === '' || !client) {
    return null;
  }

  return (
    <>
      <ErrorBoundary>
        <div className={classes.root}>
          {openChannels.map((item) => (
            <ChatChannel
              key={`op${item.sid}`}
              push={push}
              setCurrentCommunityId={setCurrentCommunityId}
              getMembers={getMembers}
              user={user}
              channel={item}
              channels={channelList}
              localChannel={local[item.sid]}
              local={local}
              onClose={handleChannelClose}
              onRemove={handleRemoveChannel}
              onBlock={(blockedUserId) => blockChatUser(blockedUserId)}
              onSend={() => {
                if (onboardingListVisible) {
                  setTimeout(() => getOnboardingList(), 1000);
                }
              }}
            />
          ))}
          <ErrorBoundary>
            {newChannel && (
              <ChatChannel
                push={push}
                user={user}
                setCurrentCommunityId={setCurrentCommunityId}
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
                  channelState: {
                    attributes: {
                      friendlyName: 'New Chat'
                    }
                  }
                }}
              />
            )}
          </ErrorBoundary>
          <FloatingMainChat unread={unread} onCreateChannel={handleNewChannelOpen}>
            {channelList.length === 0 ? (
              <div className={classes.noMessages}>
                {!isLoading ? (
                  <>
                    <LoadImg url={FloatEmptyChat} />
                    <Typography variant="subtitle1" align="center">
                      You have no chats yet. Start a conversation with a classmate!
                    </Typography>
                  </>
                ) : (
                  <div className={classes.loading}>
                    <LoadImg url={FloatLoadingChat} />
                    <Typography variant="subtitle1" align="center">
                      Loading chats...
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              channelList.map(
                (c) =>
                  local[c] && (
                    <ChatListItem
                      key={local[c].sid}
                      channel={local[c]}
                      userId={userId}
                      handleMuteChannel={handleMuteChannel}
                      handleRemoveChannel={handleRemoveChannel}
                      onOpenChannel={onChannelOpen}
                    />
                  )
              )
            )}
          </FloatingMainChat>
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
    </>
  );
};

const mapStateToProps = ({ router, user, chat, onboarding }: StoreState): {} => ({
  user,
  router,
  chat,
  onboardingListVisible: onboarding.onboardingList.visible
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      push: routePush,
      handleMuteChannel: chatActions.handleMuteChannel,
      handleRemoveChannel: chatActions.handleRemoveChannel,
      handleRoomClick: chatActions.handleRoomClick,
      updateOpenChannels: chatActions.updateOpenChannels,
      handleChannelClose: chatActions.handleChannelClose,
      handleNewChannel: chatActions.handleNewChannel,
      setCurrentChannel: chatActions.setCurrentChannel,
      updateTitleAction: updateTitle,
      enqueueSnackbarAction: enqueueSnackbar,
      setCurrentCommunityId: chatActions.setCurrentCommunityId,
      getOnboardingList: OnboardingActions.getOnboardingList,
      setCurrentCommunityChannel: chatActions.setCurrentCommunityChannel
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles as any)(FloatingChat)));
