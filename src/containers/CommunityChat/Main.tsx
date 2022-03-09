/* eslint-disable no-nested-ternary */
import React, { memo, useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import Lightbox from 'react-images';
import { useAppSelector } from 'redux/store';
import InfiniteScroll from 'react-infinite-scroller';
import { Channel } from 'twilio-chat';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import findIndex from 'lodash/findIndex';
import { sendMessage } from '../../api/chat';
import { logEvent } from '../../api/analytics';
import MessageQuill from './MessageQuill';
import ChatHeader from './ChatHeader';
import EmptyMain from './EmptyMain';
import { CommunityInitialAlert, DefaultInitialAlert } from './InitialAlert';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatMessage from '../../components/FloatingChat/CommunityChatMessage';
import LoadImg from '../../components/LoadImg/LoadImg';
import {
  processMessages,
  fetchAvatars,
  getAvatar,
  getFileAttributes,
  AvatarData
} from 'utils/chat';
import LoadingMessageGif from '../../assets/gif/loading-chat.gif';
import LoadingErrorMessageSvg from '../../assets/svg/loading-error-message.svg';
import { MessageItemType, PERMISSIONS } from '../../constants/common';
import useStyles from './_styles/main';
import { Member } from '../../types/models';
import { messageLoadingAction } from '../../actions/chat';
import { useChannelMetadataById, setChannelRead, useTyping, ChannelMetadata } from 'features/chat';
import { usePrevious } from 'hooks';
import { selectLocalById } from 'redux/chat/selectors';

type Props = {
  channel?: Channel;
  handleBlock?: (...args: Array<any>) => any;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  isCommunityChat?: boolean;
  lastReadMessageIndex: Channel['lastConsumedMessageIndex'];
  onSend?: (...args: Array<any>) => any;
  rightSpace?: number;
  selectedChannel?: any;
  setRightPanel?: (...args: Array<any>) => any;
  channelLength: number;
};

const Main = ({
  isCommunityChat = false,
  channel,
  selectedChannel,
  rightSpace,
  onSend,
  setRightPanel,
  handleBlock,
  handleUpdateGroupName,
  lastReadMessageIndex,
  channelLength
}: Props) => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const {
    expertMode,
    data: { userId, firstName, lastName }
  } = useAppSelector((state) => state.user);
  const permission = useAppSelector((state) => state.user.data.permission);
  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const { newChannel, newMessage, messageLoading, selectedChannelId } = useAppSelector(
    (state) => state.chat.data
  );

  const { data: channelMetadata } = useChannelMetadataById(channel?.sid);

  const end = useRef(null);
  const [errorLoadingMessage, setErrorLoadingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [paginator, setPaginator] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [value, setValue] = useState('');
  const [avatars, setAvatars] = useState<AvatarData[]>([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ [index: number]: Member }>({});
  const [showError, setShowError] = useState(false);
  const [focusMessageBox, setFocusMessageBox] = useState(0);
  const [files, setFiles] = useState([]);
  const queryClient = useQueryClient();

  const memberKeys = useMemo(() => Object.keys(members), [members]);
  const otherUser = useMemo(() => {
    if (memberKeys.length !== 2) {
      return null;
    }

    return members[memberKeys.find((key) => key !== userId)];
  }, [memberKeys, members, userId]);

  const { typing, onTyping } = useTyping(channel);

  const handleOnTyping = useCallback(() => {
    try {
      onTyping();
    } catch (err) {
      setErrorLoadingMessage(true);
    }
  }, [onTyping]);

  const channelMembers = channelMetadata?.users;

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

  const local = useAppSelector((state) => selectLocalById(state, channel?.sid));

  useEffect(() => {
    if (channel && (channelMetadata?.users || local?.users)) {
      // TODO Replace
      let users: ChannelMetadata['users'] = [];
      if (channelMetadata?.users) {
        users = channelMetadata.users;
      } else if (local?.users) {
        users = local.users;
      }
      const newMembers = {};
      users.forEach((m) => {
        newMembers[m.userId] = m;
      });
      setMembers(newMembers);
    }
  }, [channel, channelMetadata?.users, local?.users]);

  const previousNewMessage = usePrevious(newMessage);

  useEffect(() => {
    if (
      channel &&
      newMessage &&
      channel.sid === newMessage.channel.sid &&
      previousNewMessage !== newMessage
    ) {
      try {
        setChannelRead(queryClient, channel);
      } catch (e) {
        setErrorLoadingMessage(true);
      }

      const index = findIndex(messages, (m) => m.sid === newMessage.sid);

      if (index === -1) {
        setMessages([...messages, newMessage]);
        setTimeout(handleScrollToBottom, 100);
      }
    }
  }, [channel, handleScrollToBottom, messages, newMessage, previousNewMessage, queryClient]);

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  useEffect(() => {
    if (channelLength && !channel) {
      dispatch(messageLoadingAction(true));
    } else if (!channelLength && !isLoading) {
      dispatch(messageLoadingAction(false));
    }
  }, [channelLength, channel, isLoading, dispatch]);

  const usePreviousChannelSid = usePrevious(channel?.sid);
  // TODO CHAT_REFACTOR: Move logic into a chat hook
  useEffect(() => {
    const init = async () => {
      if (!selectedChannelId || !channel) {
        return;
      }
      dispatch(messageLoadingAction(true));

      try {
        setChannelRead(queryClient, channel);

        const [avatars, chatData] = await Promise.all([
          fetchAvatars(channel),
          channel.getMessages(10)
        ]);

        setAvatars(avatars);

        if (!chatData?.items?.length || selectedChannelId === chatData?.items?.[0]?.channel?.sid) {
          if (!chatData.hasNextPage) {
            dispatch(messageLoadingAction(false));
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
        dispatch(messageLoadingAction(false));
      } catch (e) {
        setErrorLoadingMessage(true);
      }
    };

    // Only init if the SID itself is different, not when selectedChannelId changes
    if (channel && channel.sid !== usePreviousChannelSid) {
      init();
    }
  }, [channel, dispatch, queryClient, selectedChannelId, usePreviousChannelSid]);

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

  // TODO CHAT_REFACTOR: Move logic into a chat hook
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

  // TODO Refactor to separate component
  const renderMessage = useCallback(
    (item, profileURLs, isLastMessage) => {
      const { id, type } = item;
      try {
        switch (type) {
          case 'date':
            return <ChatMessageDate key={id} body={item.body} />;

          case 'message':
          case 'own': {
            const role = getRole(item.author);
            const isOnline = getIsOnline(item.author);
            // TODO `members` is an object which doesn't have a length property.
            // I'm confused as to how this code has ever ever worked correctly,
            // so just using any type for now
            return (
              <ChatMessage
                key={id}
                isCommunityChat={isCommunityChat}
                date={item.date}
                channelId={channel.sid}
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
          }
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
      channel?.sid,
      channelMembers,
      getIsOnline,
      getRole,
      handleBlock,
      handleImageClick,
      handleRemoveMessage,
      handleScrollToBottom,
      handleStartVideoCall,
      isCommunityChat,
      lastReadIndex,
      members,
      userId
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
            Content: 'Text',
            'Channel SID': channel.sid
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
      {channel && channelMetadata && (
        <ChatHeader
          channel={channel}
          currentUserName={`${firstName} ${lastName}`}
          handleUpdateGroupName={handleUpdateGroupName}
          isCommunityChat={isCommunityChat}
          memberKeys={memberKeys}
          members={channelMetadata?.users}
          onOpenRightPanel={setRightPanel}
          otherUser={otherUser}
          rightSpace={rightSpace}
          startVideo={startVideo}
          title={isCommunityChat ? selectedChannel?.chat_name : channelMetadata?.groupName}
        />
      )}
      <div className={classes.messageRoot}>
        <div className={classes.messageContainer}>
          {!channelLength && !isLoading && (
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
              {!hasMore &&
                (isCommunityChat ? (
                  <CommunityInitialAlert channel={channel} selectedChannel={selectedChannel} />
                ) : channelMetadata ? (
                  <DefaultInitialAlert metadata={channelMetadata} userId={userId} />
                ) : null)}
              {/* check if it's last message using length - 2, because we have `end` message at the end. */}
              {messageItems.map((item, index) =>
                renderMessage(item, avatars, index === messageItems.length - 2)
              )}
              {/* {!!Object.keys(members).length &&
                messageItems.map((item, index) =>
                  renderMessage(item, avatars, index === messageItems.length - 2)
                )} */}
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
            setValue={setValue}
            onTyping={handleOnTyping}
            showError={showError}
          />
        )}

        {channel && (
          <div className={classes.typing}>
            <Typography className={classes.typingText} variant="subtitle1">
              {typing && typing.channelId === channel.sid
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
