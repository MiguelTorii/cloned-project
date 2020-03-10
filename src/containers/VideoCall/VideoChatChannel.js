/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
import Lightbox from 'react-images';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChatMessage from '../../components/FloatingChat/ChatMessage';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatTextField from '../../components/FloatingChat/ChatTextField';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary';
import { logEvent } from '../../api/analytics';
import { getPresignedURL } from '../../api/media';
import { postMessageCount } from '../../api/chat';
import {
  processMessages,
  getAvatar,
  fetchAvatars
} from '../FloatingChat/utils';

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.circleIn.palette.appBar
  },
  list: {
    overflowY: 'auto',
    flex: 1,
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
  },
  infiniteScroll: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
});

type Props = {
  classes: Object,
  user: User,
  open: boolean,
  channel: Object,
  onUnreadUpdate: Function,
  enqueueSnackbar: Function
};

type State = {
  paginator: Object,
  messages: Array<Object>,
  hasMore: boolean,
  profileURLs: Array<Object>,
  typing: string,
  scroll: boolean,
  loading: boolean,
  images: Array<{ src: string }>,
  count: number
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
    images: [],
    count: 0
  };

  componentDidMount = async () => {
    this.mounted = true;
    this.handleMessageCount = debounce(this.handleMessageCount, 5000);
    try {
      const { channel } = this.props;
      //   try {
      //     channel.setAllMessagesConsumed();
      //   } catch (err) {
      //     console.log(err);
      //   }

      try {
        channel.getMessages(30).then(paginator => {
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

      channel.on('messageAdded', message => {
        if (!this.mounted) return;
        this.setState(prevState => ({
          messages: [...prevState.messages, message]
        }));
        const { open, onUnreadUpdate } = this.props;
        if (!open) {
          onUnreadUpdate(1);
          //   this.setState(prevState => ({
          //     unread: prevState.unread + 1
          //   }));
        } else {
          console.log('update')
          channel.setAllMessagesConsumed();
          onUnreadUpdate();
        }
        this.handleScrollToBottom();
      });

      channel.on('typingStarted', member => {
        if (!this.mounted) return;
        member.getUser().then(user => {
          const { state } = user;
          const { friendlyName } = state;
          this.setState({ typing: friendlyName });
        });
      });

      channel.on('typingEnded', () => {
        if (!this.mounted) return;
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

  componentDidUpdate = prevProps => {
    if (this.mounted && this.end) this.handleScrollToBottom();
    const { channel, open, onUnreadUpdate } = this.props;
    if (prevProps.open !== open && open === true) {
      console.log('update')
      try {
        channel.setAllMessagesConsumed();
        onUnreadUpdate()
      } catch (err) {
        console.log(err);
      }
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleSendMessage = async message => {
    const {
      channel,
      user: { firstName, lastName }
    } = this.props;
    const messageAttributes = {
      firstName,
      lastName,
      imageKey: '',
      isVideoNotification: false
    };
    this.setState({ loading: true });
    try {
      await channel.sendMessage(message, messageAttributes);

      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Text' }
      });
      this.setState(({ count }) => ({ count: count + 1 }));
      this.handleMessageCount();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSendInput = async file => {
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

      await channel.sendMessage('Uploaded a image', messageAttributes);
      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Image' }
      });
      this.setState(({ count }) => ({ count: count + 1 }));
      this.handleMessageCount();
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
        paginator.prevPage().then(result => {
          this.setState(prevState => {
            return {
              messages: [...result.items, ...prevState.messages],
              paginator: result,
              hasMore: !(!result.hasPrevPage || result.items.length < 10),
              scroll: false
            };
          });
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

  handleImageClick = src => {
    this.setState({ images: [{ src }] });
  };

  handleImageClose = () => {
    this.setState({ images: [] });
  };

  handleMessageCount = async () => {
    const { count } = this.state;
    const {
      user: { userId },
      channel
    } = this.props;
    const { sid } = channel;
    const { points } = await postMessageCount({
      userId,
      count,
      sid
    });
    if (points > 0) {
      const { enqueueSnackbar, classes } = this.props;
      enqueueSnackbar(`Awesome! You've earned ${points} points for messages`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        autoHideDuration: 2000,
        ContentProps: {
          classes: {
            root: classes.stackbar
          }
        }
      });
    }

    this.setState({ count: 0 });
  };

  handleStartVideoCall = () => { };

  mounted: boolean

  // eslint-disable-next-line no-undef
  end: ?HTMLDivElement;

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

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
              ref={el => {
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
    const {
      typing,
      hasMore,
      loading,
      messages,
      profileURLs,
      images
    } = this.state;

    const messageItems = processMessages({
      items: messages,
      userId
    });

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <div
              className={cx(classes.list, typing !== '' && classes.listTyping)}
              ref={node => {
                this.scrollParentRef = node;
              }}
            >
              <div className={classes.infiniteScroll}>
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
                  {messageItems.map(item =>
                    this.renderMessage(item, profileURLs)
                  )}
                  {loading && (
                    <div className={classes.progress}>
                      <CircularProgress size={20} />
                    </div>
                  )}
                </InfiniteScroll>
              </div>
            </div>
            {typing !== '' && (
              <div className={classes.typing}>
                <Typography
                  className={classes.typingText}
                  variant="subtitle1"
                >{`${typing} is typing ...`}</Typography>
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
      </Fragment>
    );
  }
}

export default withStyles(styles)(withSnackbar(VideoChatChannel));
