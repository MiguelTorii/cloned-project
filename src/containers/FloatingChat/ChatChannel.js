// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import cx from 'classnames';
import Lightbox from 'react-images';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getTitle, fetchAvatars, processMessages, getAvatar } from 'utils/chat';
import CreateChatChannelInput from 'components/CreateChatChannelInput'
import type { UserState } from '../../reducers/user';
import ChatItem from '../../components/FloatingChat/ChatItem';
import ChatMessage from '../../components/FloatingChat/ChatMessage';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatTextField from '../../components/FloatingChat/ChatTextField';
import ChatChannelViewMembers from './ChatChannelViewMembers';
import ChatChannelAddMembers from './ChatChannelAddMembers';
import { getPresignedURL } from '../../api/media';
import { logEvent } from '../../api/analytics';
import { postMessageCount } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  list: {
    overflowY: 'auto',
    flex: 1,
    transition: 'width 0.25s, height 0.25s'
  },
  listTyping: {
    maxHeight: 270
  },
  listExpanded: {
    maxHeight: 390
  },
  listTypingExpanded: {
    maxHeight: 370
  },
  typing: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    // color: 'black'
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
  user: UserState,
  channel: Object,
  onClose: Function,
  onBlock: Function,
  onRemove: Function,
  newChannel: boolean,
  handleChannelCreated: Function,
  enqueueSnackbar: Function,
  onSend: Function
};

type State = {
  title: string,
  paginator: Object,
  messages: Array<Object>,
  hasMore: boolean,
  profileURLs: Array<Object>,
  unread: number,
  typing: string,
  open: boolean,
  scroll: boolean,
  viewMembers: boolean,
  loading: boolean,
  images: Array<{ src: string }>,
  expanded: boolean,
  count: number,
  addMembers: boolean
};

class ChatChannel extends React.PureComponent<Props, State> {
  state = {
    title: '',
    paginator: {},
    messages: [],
    hasMore: true,
    profileURLs: [],
    unread: 0,
    typing: '',
    open: true,
    scroll: true,
    viewMembers: false,
    loading: false,
    images: [],
    expanded: false,
    count: 0,
    addMembers: false
  };

  mounted: boolean;

  // eslint-disable-next-line no-undef
  end: ?HTMLDivElement;

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  componentDidMount = async () => {
    this.mounted = true;
    this.handleMessageCount = debounce(this.handleMessageCount, 5000);
    try {
      const {
        channel,
        user: {
          data: { userId }
        },
      } = this.props;
      try {
        channel.setAllMessagesConsumed();
      } catch (err) {
        console.log(err);
      }

      const title = getTitle(channel, userId);
      this.setState({ title });

      try {
        const paginator = await channel.getMessages(10)
        if (paginator)
          this.setState({
            messages: paginator.items,
            paginator,
            hasMore: !(paginator.items.length < 10)
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
        const { channel } = message
        if (!open) {
          this.setState(prevState => ({
            unread: prevState.unread + 1
          }));
        } else {
          try {
            channel.setAllMessagesConsumed();
          } catch(e) {}
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
        try{
          member.getUser().then(user => {
            const { state } = user;
            const { friendlyName } = state;
            this.setState({ typing: friendlyName });
          });
        } catch(e) {}
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

  handleChatOpen = () => {
    const { open } = this.state;
    const { channel } = this.props;
    if (open) {
      this.setState({ open: false });
      return;
    }

    try {
      channel.setAllMessagesConsumed();
    } catch (err) {
      console.log(err);
    }

    this.setState({
      open: true,
      unread: 0
    });
  };

  handleSendMessage = async message => {
    const {
      channel,
      user: {
        data: { firstName, lastName }
      },
      onSend
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
        props: { Content: 'Text', 'Channel SID': channel.sid }
      });
      this.setState(({ count }) => ({ count: count + 1 }));
      this.handleMessageCount();
      onSend();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSendInput = async file => {
    const {
      channel,
      newChannel,
      user: {
        data: { userId, firstName, lastName }
      },
      onSend
    } = this.props;
    if (newChannel) return

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
        props: { Content: 'Image', 'Channel SID': channel.sid }
      });
      this.setState(({ count }) => ({ count: count + 1 }));
      this.handleMessageCount();
      onSend();
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
      // user: {
      //   data: { userId }
      // },
      onRemove
    } = this.props;
    try {
      // const { state } = channel;
      // const { attributes = {} } = state;
      // const { users = [] } = attributes;
      // const newUsers = users.filter(
      //   o => o.userId.toString() !== userId.toString()
      // );
      onRemove({ sid: channel.sid });
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

  handleOpenAddMembers = () => {
    this.setState({ addMembers: true });
    this.handleCloseViewMembers();
  };

  handleCloseAddMembers = () => {
    this.setState({ addMembers: false });
  };

  handleImageClick = src => {
    this.setState({ images: [{ src }] });
  };

  handleImageClose = () => {
    this.setState({ images: [] });
  };

  handleExpand = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
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
            userId={item.author}
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
      newChannel,
      channel: {
        sid,
        state: {
          attributes: { groupType = '' }
        }
      },
      onBlock,
      handleChannelCreated
    } = this.props;

    const {
      title,
      messages,
      unread,
      hasMore,
      profileURLs,
      typing,
      open,
      viewMembers,
      loading,
      images,
      expanded,
      addMembers
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
            unread={unread}
            isGroup={groupType !== ''}
            expanded={expanded}
            onOpen={this.handleChatOpen}
            onClose={this.handleClose}
            onDelete={this.handleDelete}
            newChannel={newChannel}
            onStartVideoCall={this.handleStartVideoCall}
            onViewMembers={this.handleViewMembers}
            onExpand={this.handleExpand}
          >
            <div
              className={cx(
                classes.list,
                typing !== '' && classes.listTyping,
                expanded && classes.listExpanded,
                expanded && typing !== '' && classes.listTypingExpanded
              )}
              ref={node => {
                this.scrollParentRef = node;
              }}
            >
              {newChannel && <CreateChatChannelInput onOpenChannel={handleChannelCreated} />}
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
            {typing !== '' && (
              <div className={classes.typing}>
                <Typography
                  className={classes.typingText}
                  variant="subtitle1"
                >{`${typing} is typing ...`}</Typography>
              </div>
            )}
            <ChatTextField
              expanded={expanded}
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
            chatId={sid}
            onClose={this.handleCloseViewMembers}
            onBlock={onBlock}
            onAddMember={this.handleOpenAddMembers}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <ChatChannelAddMembers
            chatId={sid}
            open={addMembers}
            onClose={this.handleCloseAddMembers}
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

export default withStyles(styles)(withSnackbar(ChatChannel));
