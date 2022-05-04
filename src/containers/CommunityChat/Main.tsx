import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import Lightbox from 'react-images';
import InfiniteScroll from 'react-infinite-scroller';
import { useQueryClient } from 'react-query';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { PERMISSIONS } from 'constants/common';
import { CHANNEL_SID_NAME } from 'constants/enums';
import type { ChatUpload } from 'utils/chat';
import { getFileAttributes, removeCurrentUserFromGroupName } from 'utils/chat';

import { logEvent } from 'api/analytics';
import { sendMessage } from 'api/chat';
import LoadingMessageGif from 'assets/gif/loading-chat.gif';
import LoadingErrorMessageSvg from 'assets/svg/loading-error-message.svg';
import LoadImg from 'components/LoadImg/LoadImg';
import {
  setChannelRead,
  useChannelAvatars,
  useChannelMessages,
  useChannelMetadataById,
  useChannelMessagesPaginatorFetch
} from 'features/chat';
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
import type { Channel } from 'types/models';

const ConversationLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.messageLoadingRoot}>
      <div className={classes.messageLoadingContainer}>
        <LoadImg url={LoadingMessageGif} className={classes.emptyChatImg} />
        <Typography className={classes.expertTitle}>Loading your conversation...</Typography>
      </div>
    </div>
  );
};

const ErrorLoading = () => {
  const classes = useStyles();

  return (
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
  );
};

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
  reduced?: boolean;
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
  channelLength,
  reduced = false
}: Props) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const {
    expertMode,
    data: { userId, firstName, lastName }
  } = useAppSelector((state) => state.user);
  const permission = useAppSelector((state) => state.user.data.permission);
  const { newChannel } = useAppSelector((state) => state.chat.data);
  const local = useAppSelector((state) => selectLocalById(state, channel?.sid));

  const [sendingMessage, setSendingMessage] = useState(false);
  const [errorLoadingMessage, setErrorLoadingMessage] = useState(false);

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState<ChatUpload[]>([]);
  const [members, setMembers] = useState<{ [index: number]: ChannelMetadata['users'][0] }>({});

  // Data fetching hooks
  const { data: channelMetadata } = useChannelMetadataById(channel?.sid);
  const {
    data: messages,
    isLoading: areMessagesLoading,
    error: messagesError
  } = useChannelMessages(channel);
  const { data: avatars } = useChannelAvatars(channel);

  const hasMore = Boolean(messages?.hasPrevPage);
  const { loader: handleLoadMore, isLoading: isLoadingMore } = useChannelMessagesPaginatorFetch(
    channel,
    useCallback(() => setErrorLoadingMessage(false), []),
    useCallback(() => setErrorLoadingMessage(true), [])
  );

  // Legacy member data structure, should be refactored
  const memberKeys = useMemo(() => Object.keys(members), [members]);
  const otherUser = useMemo(() => {
    if (memberKeys.length !== 2) {
      return null;
    }
    return members[memberKeys.find((key) => key !== userId)];
  }, [memberKeys, members, userId]);
  // Prevent re-renders every time due to new array reference
  const { current: emptyArr } = useRef([]);
  const channelMembers = channelMetadata?.users || local?.users || emptyArr;
  // TODO Legacy data structure, should be unnecessary
  useEffect(() => {
    if (channel && channelMembers?.length) {
      const newMembers = {};
      channelMembers.forEach((m) => {
        newMembers[m.userId] = m;
      });
      setMembers(newMembers);
    }
  }, [channel, channelMembers]);

  // On changing channel, automatically mark it as read
  useEffect(() => {
    if (!channel) return;
    setChannelRead(queryClient, channel);
  }, [channel, queryClient]);

  const lastMessage = messages?.items[messages?.items.length - 1];
  const previousLastMessage = usePrevious(lastMessage);
  /**
   * After onSendMessage, we wait for useChatSubscription
   * to update the cache with the new message. Once it's received, we know it's done
   */
  useEffect(() => {
    if (lastMessage !== previousLastMessage && sendingMessage) {
      setSendingMessage(false);
    }
  }, [lastMessage, previousLastMessage, sendingMessage]);

  const handleImageClick = useCallback((src) => {
    setImages([
      {
        src
      }
    ]);
  }, []);
  const handleStartVideoCall = useCallback(() => {
    if (!channel) return;
    logEvent({
      event: 'Video- Start Video',
      props: {
        'Initiated From': 'Chat'
      }
    });
    const win = window.open(`/video-call/${channel.sid}`, '_blank');
    win?.focus();
  }, [channel]);

  const onSendMessage = useCallback(
    async (message) => {
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
      setSendingMessage(true);

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
        setSendingMessage(false);
        setErrorLoadingMessage(true);
      } finally {
        setFiles([]);
      }
    },
    [channel, firstName, lastName, onSend, files]
  );

  const handleImageClose = useCallback(() => setImages([]), []);
  const startVideo = useCallback(() => {
    if (!channel) return;
    window.open(`/video-call/${channel.sid}`, '_blank');
  }, [channel]);

  if (areMessagesLoading) {
    return <ConversationLoading />;
  }

  if (errorLoadingMessage || messagesError) {
    return <ErrorLoading />;
  }

  return (
    <div className={classes.root}>
      {!reduced && channel && (channelMetadata || local) && (
        <ChatHeader
          channel={channel}
          currentUserName={`${firstName} ${lastName}`}
          handleUpdateGroupName={handleUpdateGroupName}
          isCommunityChat={isCommunityChat}
          members={channelMembers}
          onOpenRightPanel={setRightPanel}
          otherUser={otherUser}
          rightSpace={rightSpace}
          startVideo={startVideo}
          title={
            channel?.friendlyName ||
            removeCurrentUserFromGroupName(channelMetadata?.groupName, { firstName, lastName }) ||
            ''
          }
        />
      )}
      <div className={classes.messageRoot}>
        <div
          className={classNames(
            classes.messageContainer,
            reduced && classes.reducedMessageContainer
          )}
        >
          {!channelLength && (
            <EmptyMain
              otherUser={otherUser}
              noChannel={!channel}
              newChannel={newChannel}
              expertMode={expertMode}
            />
          )}
          {channel && channelLength && avatars && messages?.items && (
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
                ) : (
                  channelMetadata && (
                    <DefaultInitialAlert
                      metadata={channelMetadata}
                      title={
                        channel?.friendlyName ||
                        removeCurrentUserFromGroupName(channelMetadata.groupName, {
                          firstName,
                          lastName
                        }) ||
                        ''
                      }
                      userId={userId}
                    />
                  )
                ))}
              {isLoadingMore && (
                <div className={classes.messageLoading}>
                  <CircularProgress size={20} />
                </div>
              )}
              <ChatMessages
                avatars={avatars}
                channel={channel}
                channelMembers={channelMembers}
                handleBlock={handleBlock}
                handleImageClick={handleImageClick}
                handleStartVideoCall={handleStartVideoCall}
                isCommunityChat={isCommunityChat}
                members={members}
                messages={messages?.items}
                reduced={reduced}
              />
              {sendingMessage && (
                <div className={classes.messageLoading}>
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
            onSendMessage={onSendMessage}
            reduced={reduced}
          />
        )}
      </div>
    </div>
  );
};

export default memo(Main);
