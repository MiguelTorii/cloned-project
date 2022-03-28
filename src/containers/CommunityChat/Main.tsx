/* eslint-disable no-nested-ternary */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import findIndex from 'lodash/findIndex';
import Lightbox from 'react-images';
import InfiniteScroll from 'react-infinite-scroller';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { PERMISSIONS } from 'constants/common';
import { CHANNEL_SID_NAME } from 'constants/enums';
import type { AvatarData } from 'utils/chat';
import { fetchAvatars, getFileAttributes } from 'utils/chat';

import { messageLoadingAction } from 'actions/chat';
import { logEvent } from 'api/analytics';
import { sendMessage } from 'api/chat';
import LoadingMessageGif from 'assets/gif/loading-chat.gif';
import LoadingErrorMessageSvg from 'assets/svg/loading-error-message.svg';
import LoadImg from 'components/LoadImg/LoadImg';
import { setChannelRead, useChannelMetadataById, useChatParams, useTyping } from 'features/chat';
import { usePrevious } from 'hooks';
import { selectLocalById } from 'redux/chat/selectors';
import { useAppSelector } from 'redux/store';

import useStyles from './_styles/main';
import ChannelMessageQuill from './ChannelMessageQuill';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import EmptyMain from './EmptyMain';
import { CommunityInitialAlert, DefaultInitialAlert } from './InitialAlert';

import type { ChannelMetadata } from 'features/chat';
import type { Channel } from 'twilio-chat';

type Props = {
  channel?: Channel;
  handleBlock?: (...args: Array<any>) => any;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  isCommunityChat?: boolean;
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
  const { newChannel, newMessage, messageLoading, currentCommunityChannelId } = useAppSelector(
    (state) => state.chat.data
  );

  const { chatId } = useChatParams();
  const usePreviousChannelSid = usePrevious(channel?.sid);

  const { data: channelMetadata } = useChannelMetadataById(channel?.sid);
  const local = useAppSelector((state) => selectLocalById(state, channel?.sid));
  const { current: emptyArr } = useRef([]);

  const end = useRef(null);
  const [errorLoadingMessage, setErrorLoadingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [paginator, setPaginator] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [avatars, setAvatars] = useState<AvatarData[]>([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ [index: number]: ChannelMetadata['users'][0] }>({});
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

  const channelMembers = channelMetadata?.users || local?.users || emptyArr;

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
    if (channel && channelMembers?.length) {
      const newMembers = {};
      channelMembers.forEach((m) => {
        newMembers[m.userId] = m;
      });
      setMembers(newMembers);
    }
  }, [channel, channelMembers]);

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
  // TODO Set loading logic by react-query
  useEffect(() => {
    if (channelLength && !channel) {
      dispatch(messageLoadingAction(true));
    } else if (!channelLength && !isLoading) {
      dispatch(messageLoadingAction(false));
    }
  }, [channelLength, channel, isLoading, dispatch]);

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  useEffect(() => {
    const init = async () => {
      if (!channel) return;

      dispatch(messageLoadingAction(true));

      try {
        await setChannelRead(queryClient, channel);
        const [avatars, chatData] = await Promise.all([
          fetchAvatars(channel),
          // TODO move channel messages to react-query cache
          channel.getMessages(10)
        ]);

        // TODO move channel avatars to react-query cache
        setAvatars(avatars);

        if (
          // If there are no messages
          !chatData?.items?.length ||
          // Or if there are messages when chat id changes
          (chatData?.items?.[0]?.channel?.sid &&
            [chatId, currentCommunityChannelId].includes(chatData.items[0].channel.sid))
        ) {
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
    if (channel && channel.sid !== usePreviousChannelSid && chatId === channel.sid) {
      init();
    }
  }, [channel, currentCommunityChannelId, dispatch, queryClient, chatId, usePreviousChannelSid]);

  const hasPermission = useMemo(
    () => permission && permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS),
    [permission]
  );

  const currentTitle = useMemo(() => {
    const title = isCommunityChat ? selectedChannel?.chat_name : channelMetadata?.groupName;
    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    if (!channel?.friendlyName) {
      let customTitle = '';
      let currentIndex = 0;

      if (channelMembers.length > 3) {
        channelMembers.forEach((member, index) => {
          if (index < 3) {
            customTitle += `${member.firstName} ${member.lastName}, `;
            currentIndex = index;
          }
        });
        customTitle += `${channelMembers.length - currentIndex - 1} others`;
        return customTitle;
      }

      return title;
    }

    return title;
  }, [
    channel?.friendlyName,
    channelMembers,
    channelMetadata?.groupName,
    isCommunityChat,
    selectedChannel?.chat_name
  ]);

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
  const handleRemoveMessage = useCallback((messageId: string) => {
    setMessages((oldMessages) => oldMessages.filter((item) => item.state.sid !== messageId));
  }, []);

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
          [CHANNEL_SID_NAME]: channel.sid
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
            [CHANNEL_SID_NAME]: channel.sid
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
      {channel && (channelMetadata || local) && (
        <ChatHeader
          channel={channel}
          currentUserName={`${firstName} ${lastName}`}
          handleUpdateGroupName={handleUpdateGroupName}
          isCommunityChat={isCommunityChat}
          memberKeys={memberKeys}
          members={channelMembers}
          onOpenRightPanel={setRightPanel}
          otherUser={otherUser}
          rightSpace={rightSpace}
          startVideo={startVideo}
          title={currentTitle}
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
          {channel && channelLength && (
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
                  <DefaultInitialAlert
                    metadata={channelMetadata}
                    title={currentTitle}
                    userId={userId}
                  />
                ) : null)}
              {/* check if it's last message using length - 2, because we have `end` message at the end. */}
              <ChatMessages
                ref={end}
                avatars={avatars}
                channel={channel}
                channelMembers={channelMembers}
                handleBlock={handleBlock}
                handleImageClick={handleImageClick}
                handleRemoveMessage={handleRemoveMessage}
                handleScrollToBottom={handleScrollToBottom}
                handleStartVideoCall={handleStartVideoCall}
                isCommunityChat={isCommunityChat}
                members={members}
                messages={messages}
              />
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
          <ChannelMessageQuill
            channel={channel}
            isNamedChannel={isCommunityChat}
            userId={userId}
            setFiles={setFiles}
            files={files}
            focusMessageBox={focusMessageBox}
            onSendMessage={onSendMessage}
            setError={setShowError}
            showError={showError}
          />
        )}
      </div>
    </div>
  );
};

export default memo(Main);
