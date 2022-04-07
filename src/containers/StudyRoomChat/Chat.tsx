import { useCallback, useMemo, useRef, useState } from 'react';

import cx from 'classnames';
import Lightbox from 'react-images';
import InfiniteScroll from 'react-infinite-scroller';

import CircularProgress from '@material-ui/core/CircularProgress';

import { CHANNEL_SID_NAME } from 'constants/enums';
import type { AvatarData, ChatUpload } from 'utils/chat';
import { getFileAttributes } from 'utils/chat';
import { arrayToObject } from 'utils/helpers';

import { logEvent } from 'api/analytics';
import { sendMessage } from 'api/chat';
import ChatMessages from 'containers/CommunityChat/ChatMessages';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import { useChannelMessagesPaginatorFetch } from 'features/chat';
import { useChatScrollToBottom } from 'features/chat/hooks/useChatScrollToBottom';
import { useAppSelector } from 'redux/store';

import ChannelChatTextField from './ChannelChatTextField';
import { useStyles as useStudyRoomChatStyles } from './StudyRoomChatStyles';

import type { ChannelMetadata, MessagePaginator } from 'features/chat';
import type { Channel } from 'twilio-chat';

type Props = {
  channel?: Channel;
  members?: ChannelMetadata['users'];
  avatars?: AvatarData[];
  messages?: MessagePaginator;
};

const StudyRoomChat = ({ messages, members, channel, avatars }: Props) => {
  const [loading, setLoading] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const classes = useStudyRoomChatStyles();

  const {
    data: { firstName, lastName }
  } = useAppSelector((state) => state.user);

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState<ChatUpload[]>([]);
  const mappedMembers = useMemo(
    () => arrayToObject(members, (member) => String(member.userId)),
    [members]
  );

  const { loader: handleLoadMore } = useChannelMessagesPaginatorFetch(channel);
  const hasMore = Boolean(messages?.hasPrevPage);

  const handleScrollToBottom = useChatScrollToBottom(end, messages);

  const onSendMessage = useCallback(
    async (message: string, files: ChatUpload[]) => {
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
      if (files.length) {
        setLoading(true);
      }

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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [channel, firstName, lastName]
  );

  const handleImageClick = useCallback((src) => {
    setImages([
      {
        src
      }
    ]);
  }, []);

  const handleImageClose = useCallback(() => setImages([]), []);

  const onClose = useCallback(
    (deleteFile: ChatUpload) => {
      const filterFiles = files.filter((file) => file.url !== deleteFile.url);
      setFiles(filterFiles);
    },
    [files]
  );

  return (
    <ErrorBoundary>
      <div className={cx(classes.messageContainer, classes.messageContainerNoImg)}>
        {channel && avatars && members && messages && (
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
            <ChatMessages
              ref={end}
              avatars={avatars}
              channel={channel}
              channelMembers={members}
              handleImageClick={handleImageClick}
              handleScrollToBottom={handleScrollToBottom}
              members={mappedMembers}
              messages={messages?.items}
              isVideoChat
            />
            {loading && (
              <div className={classes.progress}>
                <CircularProgress size={20} />
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
      {channel && (
        <ChannelChatTextField
          setLoading={setLoading}
          channel={channel}
          onSendMessage={onSendMessage}
          setFiles={setFiles}
          files={files}
          onClose={onClose}
        />
      )}
      <Lightbox
        images={images}
        currentImage={0}
        isOpen={images.length > 0}
        onClose={handleImageClose}
      />
    </ErrorBoundary>
  );
};

export default StudyRoomChat;
