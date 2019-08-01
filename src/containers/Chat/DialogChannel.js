// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import Lightbox from 'react-images';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import ChatItem from '../../components/FloatingChat/DialogChatItem';
import ChatMessage from '../../components/FloatingChat/ChatMessage';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatTextField from '../../components/FloatingChat/ChatTextField';
import ChatChannelViewMembers from '../FloatingChat/ChatChannelViewMembers';
import {
  getTitle,
  fetchAvatars,
  processMessages,
  getAvatar
} from '../FloatingChat/utils';
import { getPresignedURL } from '../../api/media';
import { logEvent } from '../../api/analytics';
import { postMessageCount } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  list: {
    overflowY: 'auto',
    flex: 1,
    maxHeight: '100%',
    transition: 'width 0.25s, height 0.25s'
  },
  typing: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    color: 'black'
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
  user: UserState,
  channel: Object,
  onClose: Function,
  onBlock: Function,
  onRemove: Function,
  enqueueSnackbar: Function
};

type State = {
  title: string,
  paginator: Object,
  messages: Array<Object>,
  hasMore: boolean,
  profileURLs: Array<Object>,
  typing: string,
  open: boolean,
  scroll: boolean,
  viewMembers: boolean,
  loading: boolean,
  images: Array<{ src: string }>,
  count: number
};

class DialogChannel extends React.PureComponent<Props, State> {
  state = {
    title: '',
    paginator: {},
    messages: [],
    hasMore: true,
    profileURLs: [],
    typing: '',
    open: true,
    scroll: true,
    viewMembers: false,
    loading: false,
    images: [],
    count: 0
  };

  componentDidMount = async () => {
    this.mounted = true;
    this.handleMessageCount = debounce(this.handleMessageCount, 5000);
    try {
      const {
        channel,
        user: {
          data: { userId }
        }
      } = this.props;
      try {
        channel.setAllMessagesConsumed();
      } catch (err) {
        console.log(err);
      }

      const title = getTitle(channel, userId);
      this.setState({ title });

      try {
        channel.getMessages(10).then(paginator => {
          this.setState({
            messages: paginator.items,
            paginator,
            hasMore: !(paginator.items.length < 10)
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
        const { open } = this.state;
        if (open) {
          channel.setAllMessagesConsumed();
        }
        this.handleScrollToBottom();
      });
      channel.on(
        'updated',
        async ({ channel: updatedChannel, updateReasons }) => {
          if (!this.mounted) return;
          if (updateReasons.indexOf('attributes') > -1) {
            this.setState({
              title: getTitle(updatedChannel, userId)
            });
          }
        }
      );
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

  componentDidUpdate = () => {
    if (this.mounted && this.end) this.handleScrollToBottom();
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleClose = () => {
    const { channel, onClose } = this.props;
    onClose(channel.sid);
  };

  handleSendMessage = async message => {
    const {
      channel,
      user: {
        data: { firstName, lastName }
      }
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
      user: {
        data: { userId, firstName, lastName }
      }
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

  handleDelete = () => {
    const {
      channel,
      user: {
        data: { userId }
      },
      onRemove
    } = this.props;
    try {
      const { state } = channel;
      const { attributes = {} } = state;
      const { users = [] } = attributes;
      const newUsers = users.filter(
        o => o.userId.toString() !== userId.toString()
      );
      onRemove({ channel, users: newUsers });
    } catch (err) {
      console.log(err);
    }
  };

  handleStartVideoCall = () => {
    const { channel } = this.props;
    logEvent({
      event: 'Video- Start Video',
      props: { 'Initiated From': 'Chat' }
    });
    const win = window.open(`/video-call/${channel.sid}`, '_blank');
    win.focus();
  };

  handleViewMembers = () => {
    this.setState({ viewMembers: true });
  };

  handleCloseViewMembers = () => {
    this.setState({ viewMembers: false });
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
      user: {
        data: { userId }
      },
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
        variant: 'info',
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

  mounted: boolean;

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
      console.log(err);
      return null;
    }
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      },
      channel: {
        state: {
          attributes: { groupType = '', users = [] }
        }
      },
      onBlock
    } = this.props;

    const {
      title,
      messages,
      hasMore,
      profileURLs,
      typing,
      open,
      viewMembers,
      loading,
      images
    } = this.state;

    const messageItems = processMessages({
      items: messages,
      userId
    });

    return (
      <Fragment>
        <ErrorBoundary>
          <ChatItem
            title={title}
            open={open}
            isGroup={groupType !== ''}
            onClose={this.handleClose}
            onDelete={this.handleDelete}
            onStartVideoCall={this.handleStartVideoCall}
            onViewMembers={this.handleViewMembers}
          >
            <div
              className={classes.list}
              ref={node => {
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
                {messageItems.map(item =>
                  this.renderMessage(item, profileURLs)
                )}
                {typing !== '' && (
                  <div className={classes.typing}>
                    <Typography
                      className={classes.typingText}
                    >{`${typing} is typing ...`}</Typography>
                  </div>
                )}
                {loading && (
                  <div className={classes.progress}>
                    <CircularProgress size={20} />
                  </div>
                )}
              </InfiniteScroll>
            </div>
            <ChatTextField
              onSendMessage={this.handleSendMessage}
              onSendInput={this.handleSendInput}
              onTyping={this.handleTyping}
            />
          </ChatItem>
        </ErrorBoundary>
        <ErrorBoundary>
          <ChatChannelViewMembers
            open={viewMembers}
            userId={userId}
            members={users}
            profileURLs={profileURLs}
            onClose={this.handleCloseViewMembers}
            onBlock={onBlock}
          />
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

export default withStyles(styles)(withSnackbar(DialogChannel));
