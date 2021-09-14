import React, {
  memo,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { processMessages, fetchAvatars, getAvatar } from 'utils/chat';
import InfiniteScroll from 'react-infinite-scroller';
import uuidv4 from 'uuid/v4';
import ChatTextField from 'containers/Chat/ChatTextField';
import ChatMessage from 'components/FloatingChat/ChatMessage';
import axios from 'axios';
import { getPresignedURL } from 'api/media';
import { sendMessage } from 'api/chat';
import Lightbox from 'react-images';
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate';
import Button from '@material-ui/core/Button';
import EmptyMain from 'containers/Chat/EmptyMain';
import CircularProgress from '@material-ui/core/CircularProgress';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import Grid from '@material-ui/core/Grid';
import CreateChatChannelInput from 'components/CreateChatChannelInput/CreateChatChannelInput';
import { logEvent } from 'api/analytics';
import { getCampaign } from 'api/campaign';
import findIndex from 'lodash/findIndex';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'inherit',
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    position: 'relative',
    minHeight: 40,
    // top: 64,
    backgroundColor: theme.circleIn.palette.modalBackground,
    width: '100%',
    padding: theme.spacing()
  },
  headerTitle: {
    fontSize: 18,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 1)
  },
  messageScroll: {
    flex: 1
  },
  messageContainer: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative'
  },
  typing: {
    minHeight: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    // color: 'black'
    marginLeft: theme.spacing()
  },
  videoLabel: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'none'
  },
  videoButton: {
    backgroundColor: theme.circleIn.palette.brand,
    fontWeight: 'bold',
    padding: theme.spacing(1 / 2, 1),
    color: theme.circleIn.palette.textOffwhite,
    borderRadius: theme.spacing(2)
  },
  videoIcon: {
    marginRight: theme.spacing(1 / 2),
    paddingBottom: theme.spacing(1 / 8)
  },
  selectClasses: {
    float: 'right'
  },
  unregisteredMessage: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing()
  }
}));

const Main = ({
  channel,
  mainMessage,
  setMainMessage,
  newMessage,
  onOpenChannel,
  local,
  newChannel,
  user,
  onSend
}) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [paginator, setPaginator] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [scroll, setScroll] = useState(true);
  const end = useRef(null);
  const [avatars, setAvatars] = useState([]);
  const [typing, setTyping] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState({});
  const [campaign, setCampaign] = useState(null);
  const memberKeys = useMemo(() => Object.keys(members), [members]);
  const otherUser = useMemo(() => {
    if (memberKeys.length !== 2) return null;
    return members[memberKeys.find((key) => key !== user.data.userId)];
  }, [memberKeys, members, user.data.userId]);
  const localChannel = useMemo(
    () => channel && local[channel.sid],
    [channel, local]
  );

  const {
    expertMode,
    data: { userId, firstName, lastName }
  } = user;

  const handleScrollToBottom = useCallback(() => {
    try {
      if (scroll && end.current) {
        end.current.scrollIntoView({ behavior: 'instant' });
      }
    } catch (err) {
      console.log(err);
    }
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
      } catch (e) {}
      const index = findIndex(messages, (m) => m.sid === newMessage.sid);
      if (index === -1) {
        setMessages([...messages, newMessage]);
        setTimeout(handleScrollToBottom, 100);
      }
    }
    // eslint-disable-next-line
  }, [newMessage]);

  useEffect(() => {
    const init = async () => {
      try {
        channel.setAllMessagesConsumed();

        const [avatars, aCampaign, chatData] = await Promise.all([
          fetchAvatars(channel),
          getCampaign({ campaignId: 9 }),
          channel.getMessages(10)
        ]);

        setAvatars(avatars);
        setCampaign(aCampaign);
        setMessages(chatData.items);
        setPaginator(chatData);
        setHasMore(!(chatData.items.length < 10));
        handleScrollToBottom();

        if (
          !channel._events.typingStarted ||
          channel._events.typingStarted.length === 0
        ) {
          channel.on('typingStarted', (member) => {
            member.getUser().then((user) => {
              const { state } = user;
              const { friendlyName } = state;
              setTyping({ channel: channel.sid, friendlyName });
            });
          });

          channel.on('typingEnded', () => {
            setTyping('');
          });
        }
      } catch (e) {}
    };

    if (channel) init();
    // eslint-disable-next-line
  }, [channel, channel?.channelState?.dateUpdated]);

  const messageItems = useMemo(
    () =>
      processMessages({
        items: messages,
        userId
      }),
    [messages, userId]
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

  const handleImageClick = useCallback((src) => {
    setImages([{ src }]);
  }, []);

  const handleStartVideoCall = useCallback(() => {
    logEvent({
      event: 'Video- Start Video',
      props: { 'Initiated From': 'Chat' }
    });
    const win = window.open(`/video-call/${channel.sid}`, '_blank');
    win.focus();
  }, [channel]);

  const getRole = useCallback(
    (userId) => {
      if (!members[userId]) return null;
      const { role } = members[userId];
      return role;
    },
    [members]
  );

  const renderMessage = useCallback(
    (item, profileURLs) => {
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
                userId={item.author}
                name={item.name}
                messageList={item.messageList}
                avatar={getAvatar({ id: item.author, profileURLs })}
                onImageLoaded={handleScrollToBottom}
                onStartVideoCall={handleStartVideoCall}
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
                onStartVideoCall={handleStartVideoCall}
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
    [getRole, handleImageClick, handleScrollToBottom, handleStartVideoCall]
  );

  const onSendMessage = useCallback(
    async (message) => {
      setScroll(true);
      if (!channel) return;

      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Text', 'Channel SID': channel.sid }
      });

      const messageAttributes = {
        firstName,
        lastName,
        imageKey: '',
        isVideoNotification: false
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
          props: { Content: 'Text' }
        });

        onSend();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [channel, firstName, lastName, onSend]
  );

  const onTyping = useCallback(() => {
    if (!channel) return;
    try {
      channel.typing();
    } catch (err) {
      console.log(err);
    }
  }, [channel]);

  const onSendInput = useCallback(
    async (file) => {
      setLoading(true);
      if (!channel) return;

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

        logEvent({
          event: 'Chat- Send Message',
          props: { Content: 'Image', 'Channel SID': channel.sid }
        });

        await sendMessage({
          message: 'Uploaded a image',
          ...messageAttributes,
          chatId: channel.sid
        });
        logEvent({
          event: 'Chat- Send Message',
          props: { Content: 'Image' }
        });
        // this.setState(({ count }) => ({ count: count + 1 }))
        // this.handleMessageCount()
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        // this.setState({ loading: false })
      }
    },
    [channel, firstName, lastName, userId]
  );

  const handleImageClose = useCallback(() => setImages([]), []);

  const startVideo = useCallback(() => {
    window.open(`/video-call/${channel.sid}`, '_blank');
  }, [channel]);

  const videoEnabled = useMemo(
    () =>
      campaign && campaign.variation_key && campaign.variation_key !== 'hidden',
    [campaign]
  );

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {newChannel && <CreateChatChannelInput onOpenChannel={onOpenChannel} />}
        {channel && (
          <Grid container justify="space-between">
            <Typography className={classes.headerTitle}>
              {localChannel?.title}
            </Typography>
            {(otherUser?.registered || memberKeys.length > 2) && videoEnabled && (
              <Button
                variant="contained"
                onClick={startVideo}
                classes={{
                  label: classes.videoLabel,
                  root: classes.videoButton
                }}
                color="primary"
              >
                <VideocamRoundedIcon className={classes.videoIcon} /> Study Room
              </Button>
            )}
          </Grid>
        )}
      </div>
      <div className={classes.messageContainer}>
        {(!channel || messageItems.length === 1) && (
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
            {messageItems.map((item) => renderMessage(item, avatars))}
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
            {typing && typing.channel === channel.sid
              ? `${typing.friendlyName} is typing ...`
              : ''}
          </Typography>
        </div>
      )}
      {channel && (
        <ChatTextField
          onSendMessage={onSendMessage}
          onTyping={onTyping}
          message={mainMessage}
          setMessage={setMainMessage}
          onSendInput={onSendInput}
        />
      )}
      <Lightbox
        images={images}
        currentImage={0}
        isOpen={images.length > 0}
        onClose={handleImageClose}
      />
    </div>
  );
};

export default memo(Main);
