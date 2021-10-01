/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
import Lightbox from 'react-images';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { processMessages, getAvatar, fetchAvatars, getFileAttributes } from 'utils/chat';
import { sendMessage } from 'api/chat';
import ChatMessage from '../../components/FloatingChat/ChatMessage';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatTextField from '../../components/FloatingChat/ChatTextField';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { logEvent } from '../../api/analytics';
import { getPresignedURL } from '../../api/media';

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: theme.circleIn.palette.appBar
  },
  list: {
    overflowY: 'auto'
  },
  listTyping: {
    // maxHeight: 270
  },
  typing: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    color: 'black',
    marginLeft: theme.spacing()
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: User,
  open: boolean,
  channel: Object,
  onUnreadUpdate: Function
};

type State = {
  paginator: Object,
  messages: Array<Object>,
  hasMore: boolean,
  profileURLs: Array<Object>,
  typing: string,
  scroll: boolean,
  loading: boolean,
  images: Array<{ src: string }>
};

class VideoChatChannel extends React.Component<Props, State> {
  state = {
    paginator: {},
    messages: [],
    hasMore: true,
    profileURLs: [],
    typing: '',
    scroll: true,
    loading: false,
    images: []
  };

  mounted: boolean;

  // eslint-disable-next-line no-undef
  end: ?HTMLDivElement;

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  componentDidMount = async () => {
    this.mounted = true;
    try {
      const { channel } = this.props;
      //   try {
      //     channel.setAllMessagesConsumed();
      //   } catch (err) {
      //     console.log(err);
      //   }

      try {
        channel.getMessages(30).then((paginator) => {
          this.setState({
            messages: paginator.items,
            paginator,
            hasMore: !(paginator.items.length < 30)
          });
        });
      } catch (err) {
        console.log(err);
      }

      try {
        const profileURLs = await fetchAvatars(channel);
        this.setState({ profileURLs });
      } catch (err) {
        console.log(err);
      }

      channel.on('messageAdded', (message) => {
        if (!this.mounted) {
          return;
        }
        this.setState((prevState) => ({
          messages: [...prevState.messages, message]
        }));
        const { open, onUnreadUpdate } = this.props;
        if (!open) {
          onUnreadUpdate(1);
          //   this.setState(prevState => ({
          //     unread: prevState.unread + 1
          //   }));
        } else {
          console.log('update');
          channel.setAllMessagesConsumed();
          onUnreadUpdate();
        }
        this.handleScrollToBottom();
      });

      channel.on('typingStarted', (member) => {
        if (!this.mounted) {
          return;
        }
        member.getUser().then((user) => {
          const { state } = user;
          const { friendlyName } = state;
          this.setState({ typing: friendlyName });
        });
      });

      channel.on('typingEnded', () => {
        if (!this.mounted) {
          return;
        }
        this.setState({ typing: '' });
      });

      logEvent({
        event: 'User- View Chat Room',
        props: {}
      });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.mounted && this.end) {
      this.handleScrollToBottom();
    }
    const { channel, open, onUnreadUpdate } = this.props;
    if (prevProps.open !== open && open === true) {
      console.log('update');
      try {
        channel.setAllMessagesConsumed();
        onUnreadUpdate();
      } catch (err) {
        console.log(err);
      }
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleSendMessage = async (message, files) => {
    const {
      channel,
      user: { firstName, lastName }
    } = this.props;
    const fileAttributes = getFileAttributes(files);

    const messageAttributes = {
      firstName,
      lastName,
      imageKey: '',
      files: fileAttributes,
      isVideoNotification: false
    };
    this.setState({ loading: true });
    try {
      await sendMessage({
        message,
        chatId: channel.sid,
        ...messageAttributes
      });

      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Text', 'Channel SID': channel.sid }
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSendInput = async (file) => {
    const {
      channel,
      user: { userId, firstName, lastName }
    } = this.props;

    this.setState({ loading: true });

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
        chatId: channel.sid,
        ...messageAttributes
      });
      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Image', 'Channel SID': channel.sid }
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleImageLoaded = () => {
    this.handleScrollToBottom();
  };

  handleLoadMore = () => {
    const { paginator } = this.state;
    try {
      if (paginator.hasPrevPage) {
        paginator.prevPage().then((result) => {
          this.setState((prevState) => ({
            messages: [...result.items, ...prevState.messages],
            paginator: result,
            hasMore: result.hasPrevPage && result.items.length >= 10,
            scroll: false
          }));
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleTyping = () => {
    const { channel } = this.props;
    try {
      channel.typing();
    } catch (err) {
      console.log(err);
    }
  };

  handleScrollToBottom = () => {
    const { scroll } = this.state;
    try {
      if (scroll && this.end) {
        this.end.scrollIntoView({ behavior: 'instant' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleImageClick = (src) => {
    this.setState({ images: [{ src }] });
  };

  handleImageClose = () => {
    this.setState({ images: [] });
  };

  handleStartVideoCall = () => {};

  renderMessage = (item, profileURLs) => {
    const { id, type } = item;
    try {
      switch (type) {
        case 'date':
          return <ChatMessageDate key={id} body={item.body} />;
        case 'message':
          return (
            <ChatMessage
              key={id}
              name={item.name}
              messageList={item.messageList}
              avatar={getAvatar({ id: item.author, profileURLs })}
              onImageLoaded={this.handleImageLoaded}
              onStartVideoCall={this.handleStartVideoCall}
              onImageClick={this.handleImageClick}
            />
          );
        case 'own':
          return (
            <ChatMessage
              key={id}
              messageList={item.messageList}
              isOwn
              onImageLoaded={this.handleImageLoaded}
              onStartVideoCall={this.handleStartVideoCall}
              onImageClick={this.handleImageClick}
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
              ref={(el) => {
                this.end = el;
              }}
            />
          );
        default:
          return null;
      }
    } catch (err) {
      return null;
    }
  };

  render() {
    const {
      classes,
      user: { userId }
    } = this.props;
    const { typing, hasMore, loading, messages, profileURLs, images } = this.state;

    const messageItems = processMessages({
      items: messages,
      userId
    });

    return (
      <>
        <ErrorBoundary>
          <div className={classes.root}>
            <div
              className={cx(classes.list, typing !== '' && classes.listTyping)}
              ref={(node) => {
                this.scrollParentRef = node;
              }}
            >
              <InfiniteScroll
                threshold={50}
                pageStart={0}
                loadMore={this.handleLoadMore}
                hasMore={hasMore}
                useWindow={false}
                initialLoad={false}
                isReverse
                getScrollParent={() => this.scrollParentRef}
              >
                {messageItems.slice(0, 2).map((item) => this.renderMessage(item, profileURLs))}
                {loading && (
                  <div className={classes.progress}>
                    <CircularProgress size={20} />
                  </div>
                )}
              </InfiniteScroll>
            </div>
            {typing !== '' && (
              <div className={classes.typing}>
                <Typography className={classes.typingText} variant="subtitle1">
                  {`${typing} is typing ...`}
                </Typography>
              </div>
            )}
            <ChatTextField
              onSendMessage={this.handleSendMessage}
              onSendInput={this.handleSendInput}
              onTyping={this.handleTyping}
            />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Lightbox
            images={images}
            currentImage={0}
            isOpen={images.length > 0}
            onClose={this.handleImageClose}
          />
        </ErrorBoundary>
      </>
    );
  }
}

export default withStyles(styles)(withSnackbar(VideoChatChannel));
