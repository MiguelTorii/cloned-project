import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import cx from 'classnames';
import uuidv4 from 'uuid/v4';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';

import withStyles from '@material-ui/core/styles/withStyles';

import Lightbox from 'react-images';
import { Channel } from 'twilio-chat';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';

import { sendMessage } from 'api/chat';
import { logEvent } from 'api/analytics';
import { UserState } from 'reducers/user';
import { getPresignedURL } from 'api/media';
import { setChannelRead, useTyping } from 'features/chat';
import { showNotification } from 'actions/notifications';
import { getFileAttributes, processMessages } from 'utils/chat';

import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate';

import ChatMessage from './ChatMessage';
import ChatTextField from './ChatTextField';
import { StudyRoomAvatars, StudyRoomChatMembers } from './StudyRoomChat';

const styles = (theme) => ({
  messageScroll: {
    flex: 1
  },
  messageContainer: {
    margin: theme.spacing(0, 1),
    flex: 1,
    overflowY: 'auto',
    position: 'relative'
  },
  messageContainerNoImg: {
    height: 405
  },
  messageContainerImg: {
    height: 300
  },
  typing: {
    minHeight: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    marginLeft: theme.spacing()
  },
  uploadButton: {
    marginRight: theme.spacing(),
    backgroundColor: theme.circleIn.palette.appBar,
    border: `1px solid ${theme.circleIn.palette.helperText}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: theme.spacing()
  },
  input: {
    display: 'none'
  },
  files: {
    width: '100%',
    padding: theme.spacing(1),
    background: theme.circleIn.palette.hoverMenu,
    borderRadius: theme.spacing(0, 0, 2.5, 2.5),
    display: 'flex',
    flexWrap: 'wrap'
  },
  tooltip: {
    fontSize: 14,
    backgroundColor: theme.circleIn.palette.tooltipBackground
  },
  tooltipArrow: {
    '&::before': {
      backgroundColor: theme.circleIn.palette.tooltipBackground
    }
  },
  popper: {
    zIndex: 1500,
    width: 123,
    textAlign: 'center'
  }
});

type Props = {
  classes?: Record<string, any>;
  channel?: Channel;
  members: StudyRoomChatMembers;
  avatars: StudyRoomAvatars;
};

const StudyRoomChat = ({ members, channel, classes, avatars }: Props) => {
  const end = useRef(null);
  const fileInput = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [scroll, setScroll] = useState(true);
  const [images, setImages] = useState([]);
  const [paginator, setPaginator] = useState(null);
  const [input, setInput] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [mainMessage, setMainMessage] = useState('');

  const client = useQueryClient();

  const { typing, onTyping } = useTyping(channel);

  const onSend = () => {};

  const {
    data: { userId, firstName, lastName }
  } = useSelector((state: { user: UserState }) => state.user);

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
  const messageItems = useMemo(
    () =>
      processMessages({
        items: messages,
        userId
      }),
    [messages, userId]
  );
  const handleScrollToBottom = useCallback(() => {
    try {
      if (scroll && end.current) {
        end.current.scrollIntoView({
          behavior: 'auto'
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [scroll]);
  const onSendMessage = useCallback(
    async (message, files) => {
      setScroll(true);

      if (!channel) {
        return;
      }

      logEvent({
        event: 'Chat- Send Message',
        props: {
          Content: 'Text',
          CHANNEL_SID_NAME: channel.sid
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
            CHANNEL_SID_NAME: channel.sid
          }
        });
        onSend();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [channel, firstName, lastName]
  );
  useEffect(() => {
    const init = async () => {
      try {
        if (!channel || !client) {
          return;
        }
        setChannelRead(client, channel);
        const p = await channel.getMessages(10);
        setMessages(p.items);
        setPaginator(p);
        setHasMore(!(p.items.length < 10));
        handleScrollToBottom();
      } catch (e) {}
    };

    if (channel) {
      init();
    }
  }, [channel, handleScrollToBottom]);
  const handleImageClick = useCallback((src) => {
    setImages([
      {
        src
      }
    ]);
  }, []);

  const isMemberOnline = useCallback((userId) => members[userId]?.isOnline, [members]);
  const renderMessage = useCallback(
    (item) => {
      const { id, type } = item;
      const role = getRole(item.author);

      try {
        switch (type) {
          case 'date':
            return <ChatMessageDate key={id} body={item.body} />;

          case 'message':
            return (
              <ChatMessage
                key={id}
                role={role}
                isUserOnline={isMemberOnline(item.author)}
                userId={item.author}
                name={item.name}
                messageList={item.messageList}
                avatar={avatars[item.author]}
                onImageLoaded={handleScrollToBottom}
                onStartVideoCall={() => {}}
                onImageClick={handleImageClick}
              />
            );

          case 'own':
            return (
              <ChatMessage
                key={id}
                messageList={item.messageList}
                isOwn
                onImageLoaded={handleScrollToBottom}
                onStartVideoCall={() => {}}
                onImageClick={handleImageClick}
              />
            );

          case 'end':
            return (
              <div
                key={uuidv4()}
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
        console.log(err);
        return null;
      }
    },
    [getRole, handleImageClick, handleScrollToBottom, members, isMemberOnline]
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
      console.log(err);
    }
  }, [messages, paginator]);
  const onSendInput = useCallback(
    async (file) => {
      setLoading(true);

      if (!channel) {
        return;
      }

      try {
        const result = await getPresignedURL({
          userId,
          type: 4,
          mediaType: file.type
        });
        const { readUrl, url } = result;
        await axios.put(url, file, {
          headers: {
            'Content-Type': file.type
          }
        });
        const messageAttributes = {
          firstName,
          lastName,
          imageKey: readUrl,
          isVideoNotification: false
        };
        await sendMessage({
          message: 'Uploaded a image',
          ...messageAttributes,
          chatId: channel.sid
        });
        logEvent({
          event: 'Chat- Send Message',
          props: {
            Content: 'Image',
            CHANNEL_SID_NAME: channel.sid
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [channel, firstName, lastName, userId]
  );
  const handleImageClose = useCallback(() => setImages([]), []);
  const uploadFile = useCallback(() => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }, []);
  const onClose = useCallback(
    (deleteFile) => {
      const filterFiles = files.filter((file) => file.url !== deleteFile.url);
      setFiles(filterFiles);
    },
    [files]
  );
  return (
    <ErrorBoundary>
      <div
        className={cx(
          classes.messageContainer,
          input ? classes.messageContainerImg : classes.messageContainerNoImg
        )}
      >
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
            {messageItems.map((item) => renderMessage(item))}
            {loading && (
              <div className={classes.progress}>
                <CircularProgress size={20} />
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
      {channel && (
        <div className={classes.typing}>
          <Typography className={classes.typingText} variant="subtitle1">
            {typing && typing.channelId === channel.sid
              ? `${typing.friendlyName} is typing ...`
              : ''}
          </Typography>
        </div>
      )}
      {channel && (
        <ChatTextField
          onSendMessage={onSendMessage}
          onTyping={onTyping}
          input={input}
          setInput={setInput}
          message={mainMessage}
          setMessage={setMainMessage}
          onSendInput={onSendInput}
          userId={userId}
          setFiles={setFiles}
          files={files}
          showNotification={showNotification}
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

export default withStyles(styles as any)(StudyRoomChat);
