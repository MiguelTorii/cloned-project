// @flow

import React from 'react';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import ChatItem from '../../components/FloatingChat/ChatItem';
import ChatMessage from '../../components/FloatingChat/ChatMessage';
import ChatMessageDate from '../../components/FloatingChat/ChatMessageDate';
import ChatTextField from '../../components/FloatingChat/ChatTextField';
import { getTitle, fetchAvatars, processMessages, getAvatar } from './utils';
import { getPresignedURL } from '../../api/media';

const styles = () => ({
  typing: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    color: 'black'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  channel: Object,
  onClose: Function
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
  scroll: boolean
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
    scroll: true
  };

  componentDidMount = async () => {
    this.mounted = true;
    const {
      channel,
      user: {
        data: { userId }
      }
    } = this.props;
    channel.setAllMessagesConsumed();
    const title = getTitle(channel, userId);
    this.setState({ title });

    channel.getMessages(10).then(paginator => {
      this.setState({
        messages: paginator.items,
        paginator,
        hasMore: !(paginator.items.length < 10)
      });
    });

    const profileURLs = await fetchAvatars(channel);
    this.setState({ profileURLs });

    channel.on('messageAdded', message => {
      if (!this.mounted) return;
      this.setState(prevState => ({
        messages: [...prevState.messages, message]
      }));
      const { open } = this.state;
      if (!open) {
        this.setState(prevState => ({
          unread: prevState.unread + 1
        }));
      } else {
        channel.setAllMessagesConsumed();
      }
      this.handleScrollToBottom();
    });
    channel.on('updated', ({ channel: updatedChannel, updateReasons }) => {
      if (!this.mounted) return;
      if (updateReasons.indexOf('attributes') > -1) {
        this.setState({
          title: getTitle(updatedChannel, userId)
        });
      }
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

    channel.setAllMessagesConsumed();

    this.setState({
      open: true,
      unread: 0
    });
  };

  handleSendMessage = message => {
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
    channel.sendMessage(message, messageAttributes);
    // logEvent({
    //   event: 'Chat- Send Message',
    //   props: { Content: 'Text' }
    // });
    // this.setState(prevState => ({ count: prevState.count + 1 }));
    // this.handleMessageCount();
  };

  handleSendInput = async file => {
    const {
      channel,
      user: {
        data: { userId, firstName, lastName }
      }
    } = this.props;

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
    // logEvent({
    //   event: 'Chat- Send Message',
    //   props: { Content: 'Image' }
    // });
    // this.setState(prevState => ({ count: prevState.count + 1 }));
    // this.handleMessageCount();
  };

  handleImageLoaded = () => {
    this.handleScrollToBottom();
  };

  handleLoadMore = () => {
    const { paginator } = this.state;
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
  };

  handleTyping = () => {
    const { channel } = this.props;
    channel.typing();
  };

  handleScrollToBottom = () => {
    const { scroll } = this.state;
    if (scroll && this.end) {
      this.end.scrollIntoView({ behavior: 'instant' });
    }
  };

  mounted: boolean;

  // eslint-disable-next-line no-undef
  end: ?HTMLDivElement;

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  renderMessage = (item, profileURLs) => {
    const { id, type } = item;

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
          />
        );
      case 'own':
        return (
          <ChatMessage
            key={id}
            messageList={item.messageList}
            isOwn
            onImageLoaded={this.handleImageLoaded}
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
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      title,
      messages,
      unread,
      hasMore,
      profileURLs,
      typing,
      open
    } = this.state;

    const messageItems = processMessages({
      items: messages,
      userId
    });

    return (
      <ChatItem
        title={title}
        open={open}
        unread={unread}
        onOpen={this.handleChatOpen}
        onClose={this.handleClose}
      >
        <div
          style={{
            overflowY: 'auto',
            height: 'calc(100% - 82px)',
            maxHeight: 'calc(100% - 82px)'
          }}
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
            {messageItems.map(item => this.renderMessage(item, profileURLs))}
            {typing !== '' && (
              <div className={classes.typing}>
                <Typography
                  className={classes.typingText}
                >{`${typing} is typing ...`}</Typography>
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
    );
  }
}

export default withStyles(styles)(ChatChannel);
