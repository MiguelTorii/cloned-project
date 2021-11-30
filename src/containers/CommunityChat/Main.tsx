/* eslint-disable no-nested-ternary */
import React, { memo, useMemo, useCallback, useRef, useState, useEffect } from 'react';
import Lightbox from 'react-images';
import InfiniteScroll from 'react-infinite-scroller';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import findIndex from 'lodash/findIndex';
import { sendMessage } from '../../api/chat';
import { logEvent } from '../../api/analytics';
import MessageQuill from './MessageQuill';
import ChatHeader from './ChatHeader';
import EmptyMain from './EmptyMain';
import InitialAlert from './InitialAlert';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatMessage from '../../components/FloatingChat/CommunityChatMessage';
import LoadImg from '../../components/LoadImg/LoadImg';
import { processMessages, fetchAvatars, getAvatar, getFileAttributes } from '../../utils/chat';
import LoadingMessageGif from '../../assets/gif/loading-chat.gif';
import LoadingErrorMessageSvg from '../../assets/svg/loading-error-message.svg';
import { MessageItemType, PERMISSIONS } from '../../constants/common';
import useStyles from './_styles/main';
import { Member } from '../../types/models';

type Props = {
  isLoading?: boolean;
  isCommunityChat?: boolean;
  selectedChannelId?: string;
  selectedChannel?: any;
  currentCommunity?: Record<string, any>;
  channel?: any;
  channelList?: Array<any>;
  startMessageLoading?: (...args: Array<any>) => any;
  newMessage?: Record<string, any>;
  rightSpace?: number;
  local?: Record<string, any>;
  newChannel?: boolean;
  permission?: Array<any>;
  user?: Record<string, any>;
  messageLoading?: boolean;
  onSend?: (...args: Array<any>) => any;
  setRightPanel?: (...args: Array<any>) => any;
  handleBlock?: (...args: Array<any>) => any;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  showNotification?: (...args: Array<any>) => any;
  setMainMessage?: any;
  mainMessage?: any;
  onCollapseLeft?: any;
  onCollapseRight?: any;
  leftSpace?: any;
  enqueueSnackbar?: any;
  lastReadMessageIndex?: number;
};

const Main = ({
  isLoading,
  isCommunityChat = false,
  currentCommunity,
  channel,
  channelList,
  messageLoading,
  startMessageLoading,
  selectedChannel,
  newMessage,
  rightSpace,
  selectedChannelId = '',
  local,
  newChannel,
  permission,
  user,
  onSend,
  setRightPanel,
  handleBlock,
  handleUpdateGroupName,
  showNotification,
  setMainMessage,
  mainMessage,
  onCollapseLeft,
  onCollapseRight,
  leftSpace,
  enqueueSnackbar,
  lastReadMessageIndex
}: Props) => {
  const classes: any = useStyles();
  const end = useRef(null);
  const [errorLoadingMessage, setErrorLoadingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [paginator, setPaginator] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [value, setValue] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [typing, setTyping] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ [index: number]: Member }>({});
  const [showError, setShowError] = useState(false);
  const [focusMessageBox, setFocusMessageBox] = useState(0);
  const [files, setFiles] = useState([]);
  const memberKeys = useMemo(() => Object.keys(members), [members]);
  const otherUser = useMemo(() => {
    if (memberKeys.length !== 2) {
      return null;
    }

    return members[memberKeys.find((key) => key !== user.data.userId)];
  }, [memberKeys, members, user.data.userId]);
  const {
    expertMode,
    data: { userId, firstName, lastName }
  } = user;
  const channelMembers = useMemo(() => channel && local[channel.sid].members, [channel, local]);
  const handleScrollToBottom = useCallback(() => {
    try {
      if (scroll && end.current) {
        end.current.scrollIntoView({
          behavior: 'auto'
        });
      }
    } catch (err) {
      setErrorLoadingMessage(true);
    } // eslint-disable-next-line
  }, [scroll]);
  useEffect(() => {
    if (channel && local && local[channel.sid]) {
      const { members } = local[channel.sid];
      const newMembers = {};
      members.forEach((m) => {
        newMembers[m.userId] = m;
      });
      setMembers(newMembers);
    }
  }, [local, channel]);
  useEffect(() => {
    if (channel && newMessage && channel.sid === newMessage.channel.sid) {
      try {
        channel.setAllMessagesConsumed();
      } catch (e) {
        setErrorLoadingMessage(true);
      }

      const index = findIndex(messages, (m) => m.sid === newMessage.sid);

      if (index === -1) {
        setMessages([...messages, newMessage]);
        setTimeout(handleScrollToBottom, 100);
      }
    } // eslint-disable-next-line
  }, [newMessage]);

  const getTypingMemberName = useCallback(
    (id) => {
      const { members } = local[channel.sid];
      const currentMember: Member = members.find((member: Member) => member.userId === id);

      if (currentMember) {
        return `${currentMember.firstname} ${currentMember.lastname}`;
      }
      return '';
    },
    [local, channel]
  );

  useEffect(() => {
    if (channelList.length && !channel) {
      startMessageLoading(true);
    } else if (!channelList.length && !isLoading) {
      startMessageLoading(false);
    }
  }, [channelList, channel, isLoading]);
  useEffect(() => {
    const init = async () => {
      startMessageLoading(true);

      try {
        channel.setAllMessagesConsumed();
        const [avatars, chatData] = await Promise.all([
          fetchAvatars(channel),
          channel.getMessages(10)
        ]);
        setAvatars(avatars);

        if (!chatData?.items?.length || selectedChannelId === chatData?.items?.[0]?.channel?.sid) {
          if (!chatData.hasNextPage) {
            startMessageLoading(false);
          }

          setMessages(chatData.items);
          setPaginator(chatData);
          setHasMore(!(chatData.items.length < 10));
        }

        if (end.current) {
          end.current.scrollIntoView({
            behavior: 'auto'
          });
        }

        if (!channel._events.typingStarted || channel._events.typingStarted.length === 0) {
          channel.on('typingStarted', (member) => {
            const memberId = member?.state?.identity;

            if (memberId) {
              const typingUserName = getTypingMemberName(memberId);
              setTyping({
                channel: channel.sid,
                friendlyName: typingUserName
              });
            }
          });
          channel.on('typingEnded', () => {
            setTyping('');
          });
        }
      } catch (e) {
        setErrorLoadingMessage(true);
      }
    };

    if (channel) {
      init();
    } // eslint-disable-next-line
  }, [channel, selectedChannelId]);
  const messageItems = useMemo(
    () =>
      processMessages({
        items: messages,
        userId
      }),
    [messages, userId]
  );

  // Calculate last message index.
  const lastReadIndex = useMemo(() => {
    let resultIndex = lastReadMessageIndex;
    for (const messageItem of messageItems) {
      if (
        messageItem.type === MessageItemType.OWN ||
        messageItem.type === MessageItemType.MESSAGE
      ) {
        for (const message of messageItem.messageList) {
          if (message.index > lastReadMessageIndex) {
            if (messageItem.type === MessageItemType.MESSAGE) {
              return resultIndex;
            }
            resultIndex = message.index;
          }
        }
      }
    }
    return resultIndex;
  }, [messageItems, lastReadMessageIndex]);

  const hasPermission = useMemo(
    () => permission && permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS),
    [permission]
  );
  const handleLoadMore = useCallback(() => {
    setScroll(false);

    try {
      if (paginator.hasPrevPage) {
        paginator.prevPage().then((result) => {
          setMessages([...result.items, ...messages]);
          setPaginator(result);
          setHasMore(!(!result.hasPrevPage || result.items.length < 10));
        });
      }
    } catch (err) {
      setErrorLoadingMessage(true);
    }
  }, [messages, paginator]);
  const handleImageClick = useCallback((src) => {
    setImages([
      {
        src
      }
    ]);
  }, []);
  const handleStartVideoCall = useCallback(() => {
    logEvent({
      event: 'Video- Start Video',
      props: {
        'Initiated From': 'Chat'
      }
    });
    const win = window.open(`/video-call/${channel.sid}`, '_blank');
    win.focus();
  }, [channel]);
  const handleRemoveMessage = useCallback((messageId) => {
    setMessages((oldMessages) => oldMessages.filter((item) => item.state.sid !== messageId));
  }, []);
  const getRole = useCallback(
    (userId) => {
      if (!members[userId]) {
        return null;
      }

      const { role } = members[userId];
      return role;
    },
    [members]
  );
  const getIsOnline = useCallback(
    (userId) => {
      if (!members[userId]) {
        return null;
      }

      const { isOnline } = members[userId];
      return isOnline;
    },
    [members]
  );

  const renderMessage = useCallback(
    (item, profileURLs, isLastMessage) => {
      const { id, type } = item;
      const role = getRole(item.author);
      const isOnline = getIsOnline(item.author);

      try {
        switch (type) {
          case 'date':
            return <ChatMessageDate key={id} body={item.body} />;

          case 'message':
          case 'own':
            // TODO `members` is an object which doesn't have a length property.
            // I'm confused as to how this code has ever ever worked correctly,
            // so just using any type for now
            return (
              <ChatMessage
                key={id}
                role={role}
                isCommunityChat={isCommunityChat}
                date={item.date}
                channelId={channel.sid}
                showNotification={showNotification}
                isOnline={isOnline}
                isLastMessage={isLastMessage}
                lastReadMessageIndex={lastReadIndex}
                isOwn={type === 'own'}
                currentUserId={userId}
                userId={item.author}
                members={channelMembers}
                isGroupChannel={(members as any).length === 2}
                name={item.name}
                messageList={item.messageList}
                avatar={getAvatar({
                  id: item.author,
                  profileURLs
                })}
                onImageLoaded={handleScrollToBottom}
                onStartVideoCall={handleStartVideoCall}
                onImageClick={handleImageClick}
                onRemoveMessage={handleRemoveMessage}
                handleBlock={handleBlock}
              />
            );

          case 'end':
            return (
              <div
                key={id}
                style={{
                  float: 'left',
                  clear: 'both'
                }}
                ref={end}
              />
            );

          default:
            return null;
        }
      } catch (err) {
        setErrorLoadingMessage(true);
        return null;
      }
    },
    [
      isCommunityChat,
      getIsOnline,
      getRole,
      handleImageClick,
      handleScrollToBottom,
      handleStartVideoCall,
      handleBlock,
      members,
      channelMembers,
      userId,
      lastReadMessageIndex
    ]
  );
  const onSendMessage = useCallback(
    async (message) => {
      setScroll(true);

      if (!channel) {
        return;
      }

      logEvent({
        event: 'Chat- Send Message',
        props: {
          Content: 'Text',
          'Channel SID': channel.sid
        }
      });
      const fileAttributes = getFileAttributes(files);
      const messageAttributes = {
        firstName,
        lastName,
        imageKey: '',
        isVideoNotification: false,
        files: fileAttributes
      };
      setLoading(true);

      try {
        await sendMessage({
          message,
          ...messageAttributes,
          chatId: channel.sid
        });
        logEvent({
          event: 'Chat- Send Message',
          props: {
            Content: 'Text'
          }
        });

        if (onSend) {
          onSend();
        }
      } catch (err) {
        setErrorLoadingMessage(true);
      } finally {
        setLoading(false);
        setFiles([]);
      }
    },
    [channel, firstName, lastName, onSend, files]
  );
  const onTyping = useCallback(() => {
    if (!channel) {
      return;
    }

    try {
      channel.typing();
    } catch (err) {
      setErrorLoadingMessage(true);
    }
  }, [channel]);
  const handleRTEChange = useCallback((updatedValue) => {
    if (updatedValue.trim() === '<p><br></p>' || updatedValue.trim() === '<p>\n</p>') {
      setValue('');
    } else {
      const currentValue = updatedValue.replaceAll('<p><br></p>', '').replaceAll('<p>\n</p>', '');
      setValue(currentValue);
    }
  }, []);
  const handleImageClose = useCallback(() => setImages([]), []);
  const startVideo = useCallback(() => {
    window.open(`/video-call/${channel.sid}`, '_blank');
  }, [channel]);

  const loadingConversation = useCallback(
    () => (
      <div className={classes.messageLoadingRoot}>
        <div className={classes.messageLoadingContainer}>
          <LoadImg url={LoadingMessageGif} className={classes.emptyChatImg} />
          <Typography className={classes.expertTitle}>Loading your conversation...</Typography>
        </div>
      </div>
    ),
    [classes]
  );
  const loadingErrorMessage = useCallback(
    () => (
      <div className={classes.messageLoadingRoot}>
        <div className={classes.messageLoadingContainer}>
          <LoadImg url={LoadingErrorMessageSvg} className={classes.emptyChatImg} />
          <Typography className={classes.expertTitle}>
            Uh oh! There was an error trying to load your
            <br />
            conversation. Try refreshing your browser or <br />
            submit a support ticket.
          </Typography>
        </div>
      </div>
    ),
    [classes]
  );
  return messageLoading || isLoading ? (
    loadingConversation()
  ) : errorLoadingMessage ? (
    loadingErrorMessage()
  ) : (
    <div className={classes.root}>
      {channel && (
        <ChatHeader
          isCommunityChat={isCommunityChat}
          channel={channel}
          currentUserName={`${firstName} ${lastName}`}
          title={isCommunityChat ? selectedChannel?.chat_name : local[channel.sid].title}
          rightSpace={rightSpace}
          otherUser={otherUser}
          memberKeys={memberKeys}
          startVideo={startVideo}
          local={local}
          onOpenRightPanel={setRightPanel}
          handleUpdateGroupName={handleUpdateGroupName}
        />
      )}
      <div className={classes.messageRoot}>
        <div className={classes.messageContainer}>
          {!channelList.length && !isLoading && (
            <EmptyMain
              otherUser={otherUser}
              noChannel={!channel}
              newChannel={newChannel}
              expertMode={expertMode}
            />
          )}
          {channel && (
            <InfiniteScroll
              className={classes.messageScroll}
              threshold={50}
              pageStart={0}
              loadMore={handleLoadMore}
              hasMore={hasMore}
              useWindow={false}
              initialLoad={false}
              isReverse
            >
              {!hasMore && (
                <InitialAlert
                  hasPermission={hasPermission}
                  focusMessageBox={focusMessageBox}
                  setFocusMessageBox={setFocusMessageBox}
                  handleUpdateGroupName={handleUpdateGroupName}
                  isCommunityChat={isCommunityChat}
                  currentCommunity={currentCommunity}
                  selectedChannel={selectedChannel}
                  local={local}
                  userId={userId}
                  channel={channel}
                />
              )}
              {/* check if it's last message using length - 2, because we have `end` message at the end. */}
              {messageItems.map((item, index) =>
                renderMessage(item, avatars, index === messageItems.length - 2)
              )}
              {loading && (
                <div className={classes.progress}>
                  <CircularProgress size={20} />
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
        <Lightbox
          images={images}
          currentImage={0}
          isOpen={images.length > 0}
          onClose={handleImageClose}
        />

        {channel && (
          <MessageQuill
            isNamedChannel={isCommunityChat}
            value={value}
            userId={userId}
            setFiles={setFiles}
            files={files}
            focusMessageBox={focusMessageBox}
            onSendMessage={onSendMessage}
            onChange={handleRTEChange}
            showNotification={showNotification}
            setValue={setValue}
            onTyping={onTyping}
            showError={showError}
          />
        )}

        {channel && (
          <div className={classes.typing}>
            <Typography className={classes.typingText} variant="subtitle1">
              {typing && typing.channel === channel.sid
                ? `${typing.friendlyName} is typing ...`
                : ''}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Main);
