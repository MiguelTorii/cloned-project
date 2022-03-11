import React from 'react';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import cx from 'classnames';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import Lightbox from 'react-images';
import InfiniteScroll from 'react-infinite-scroller';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Member } from 'types/models';
import { sendMessage } from 'api/chat';
import { logEvent } from 'api/analytics';
import { getPresignedURL } from 'api/media';
import type { UserState } from 'reducers/user';
import { ChannelWrapper } from 'reducers/chat';
import { CHANNEL_SID_NAME } from 'constants/enums';
import { getTitle, fetchAvatars, processMessages, getAvatar, getFileAttributes } from 'utils/chat';

import ChatItem from 'components/FloatingChat/ChatItem';
import ChatMessage from 'components/FloatingChat/FloatChatMessage';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import CreateChatChannelInput from 'components/CreateChatChannelInput/CreateChatChannelInput';
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate';
import ChatTextField from 'components/FloatingChat/ChatTextField';

import ChatChannelViewMembers from './ChatChannelViewMembers';
import ChatChannelAddMembers from './ChatChannelAddMembers';

const styles = (theme) => ({
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
  unregisteredMessage: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: theme.spacing()
  },
  searchInput: {
    padding: theme.spacing(1)
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  channels?: Array<any>;
  channel?: any;
  localChannel?: Record<string, any>;
  getMembers?: (...args: Array<any>) => any;
  onClose?: (...args: Array<any>) => any;
  onBlock?: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
  newChannel?: boolean;
  handleChannelCreated?: (...args: Array<any>) => any;
  onSend?: (...args: Array<any>) => any;
  push?: (...args: Array<any>) => any;
  setCurrentCommunityId?: any;
  local?: Record<string, ChannelWrapper>;
};

type State = {
  title: string;
  paginator: any;
  messages: Array<Record<string, any>>;
  hasMore: boolean;
  profileURLs: Array<Record<string, any>>;
  unread: number;
  typing: string;
  open: boolean;
  scroll: boolean;
  viewMembers: boolean;
  loading: boolean;
  images: Array<{
    src: string;
  }>;
  expanded: boolean;
  count: number;
  addMembers: boolean;
  createMessage?: any;
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
    createMessage: null,
    addMembers: false
  };

  mounted: boolean;

  // eslint-disable-next-line no-undef
  end: HTMLDivElement | null | undefined;

  // eslint-disable-next-line no-undef
  scrollParentRef: HTMLDivElement | null | undefined;

  getTypingMemberName = (id) => {
    const {
      localChannel: { members }
    } = this.props;
    const currentMember: Member = members.find((member: Member) => member.userId === id);

    if (currentMember) {
      return `${currentMember.firstname} ${currentMember.lastname}`;
    }
    return '';
  };

  componentDidMount = async () => {
    this.mounted = true;

    try {
      const {
        channel,
        localChannel,
        user: {
          data: { userId }
        }
      } = this.props;

      try {
        channel.setAllMessagesConsumed();
      } catch (err) {
        console.log(err);
      }

      const title = getTitle(channel, userId, localChannel.members);
      this.setState({
        title
      });

      try {
        const paginator = await channel.getMessages(10);

        if (paginator) {
          this.setState({
            messages: paginator.items,
            paginator,
            hasMore: !(paginator.items.length < 10)
          });
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const profileURLs = await fetchAvatars(channel);
        this.setState({
          profileURLs
        });
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
        const { open } = this.state;
        const { channel } = message;

        if (!open) {
          this.setState((prevState) => ({
            unread: prevState.unread + 1
          }));
        } else {
          try {
            channel.setAllMessagesConsumed();
          } catch (e) {}
        }

        this.handleScrollToBottom();
      });
      channel.on('typingStarted', (member) => {
        if (!this.mounted) {
          return;
        }

        const memberId = member?.state?.identity;

        if (memberId) {
          const typingUserName = this.getTypingMemberName(memberId);
          this.setState({
            typing: typingUserName
          });
        }
      });
      channel.on('typingEnded', () => {
        if (!this.mounted) {
          return;
        }

        this.setState({
          typing: ''
        });
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
    if (this.mounted && this.end) {
      this.handleScrollToBottom();
    }
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
    const { channel, setCurrentCommunityId } = this.props;
    setCurrentCommunityId('chat');

    if (open) {
      this.setState({
        open: false
      });
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

  handleClearCreateMessage = () =>
    this.setState({
      createMessage: null
    });

  handleSendMessage = async (message, files) => {
    const {
      channel,
      user: {
        data: { firstName, lastName }
      },
      onSend
    } = this.props;
    const fileAttributes = getFileAttributes(files);
    const messageAttributes = {
      firstName,
      lastName,
      files: fileAttributes,
      imageKey: '',
      isVideoNotification: false,
      source: 'little_chat'
    };
    this.setState({
      loading: true
    });
    const { newChannel } = this.props;

    try {
      if (!newChannel) {
        await sendMessage({
          message,
          chatId: channel.sid,
          ...messageAttributes
        });
        logEvent({
          event: 'Chat- Send Message',
          props: {
            Content: 'Text',
            CHANNEL_SID_NAME: channel.sid
          }
        });
        this.setState(({ count }) => ({
          count: count + 1
        }));
        onSend();
      } else {
        this.setState({
          createMessage: {
            message,
            messageAttributes
          }
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  handleSendInput = async (file) => {
    const {
      channel,
      newChannel,
      user: {
        data: { userId, firstName, lastName }
      },
      onSend
    } = this.props;

    if (newChannel) {
      return;
    }

    this.setState({
      loading: true
    });

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
        isVideoNotification: false,
        source: 'little_chat'
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
      this.setState(({ count }) => ({
        count: count + 1
      }));
      onSend();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  handleImageLoaded = () => {
    this.handleScrollToBottom();
  };

  handleLoadMore = () => {
    const { paginator } = this.state;

    try {
      if ((paginator as any).hasPrevPage) {
        (paginator as any).prevPage().then((result) => {
          this.setState((prevState) => ({
            messages: [...result.items, ...prevState.messages],
            paginator: result,
            hasMore: !(!result.hasPrevPage || result.items.length < 10),
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
        this.end.scrollIntoView({
          behavior: 'auto'
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleDelete = () => {
    const { channel, onRemove } = this.props;

    try {
      onRemove({
        sid: channel.sid
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleStartVideoCall = () => {
    const { channel } = this.props;
    logEvent({
      event: 'Video- Start Video',
      props: {
        'Initiated From': 'Chat'
      }
    });
    const win = window.open(`/video-call/${channel.sid}`, '_blank');
    win.focus();
  };

  handleViewMembers = () => {
    this.setState({
      viewMembers: true
    });
  };

  handleCloseViewMembers = () => {
    this.setState({
      viewMembers: false
    });
  };

  handleOpenAddMembers = () => {
    this.setState({
      addMembers: true
    });
    this.handleCloseViewMembers();
  };

  handleCloseAddMembers = () => {
    this.setState({
      addMembers: false
    });
  };

  handleImageClick = (src) => {
    this.setState({
      images: [
        {
          src
        }
      ]
    });
  };

  handleImageClose = () => {
    this.setState({
      images: []
    });
  };

  handleExpand = () => {
    this.setState(({ expanded }) => ({
      expanded: !expanded
    }));
  };

  isMemberOnline = (userId) => {
    const { localChannel } = this.props;
    const { members = [] } = localChannel;
    const found = members.find((member) => member.userId === userId);
    return found?.isOnline;
  };

  renderMessage = (item, profileURLs) => {
    const { id, type } = item;

    try {
      switch (type) {
        case 'date':
          return <ChatMessageDate key={id} body={item.body} />;

        case 'message':
        case 'own':
          return (
            <ChatMessage
              key={id}
              userId={item.author}
              isUserOnline={this.isMemberOnline(item.author)}
              name={item.name}
              messageList={item.messageList}
              avatar={getAvatar({
                id: item.author,
                profileURLs
              })}
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
      local,
      channels,
      newChannel,
      channel,
      channel: {
        sid,
        channelState: {
          attributes: { groupType = '' }
        }
      },
      onBlock,
      handleChannelCreated,
      setCurrentCommunityId,
      push
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
      createMessage,
      addMembers
    } = this.state;
    const messageItems = processMessages({
      items: messages,
      userId
    });
    return (
      <>
        <ErrorBoundary>
          <ChatItem
            title={title}
            open={open}
            unread={unread}
            setCurrentCommunityId={setCurrentCommunityId}
            expanded={expanded}
            channels={channels}
            local={local}
            onOpen={this.handleChatOpen}
            onClose={this.handleClose}
            onDelete={this.handleDelete}
            newChannel={newChannel}
            channel={channel}
            onStartVideoCall={this.handleStartVideoCall}
            onViewMembers={this.handleViewMembers}
            onExpand={this.handleExpand}
            push={push}
          >
            <div
              className={cx(
                classes.list,
                typing !== '' && classes.listTyping,
                expanded && classes.listExpanded,
                expanded && typing !== '' && classes.listTypingExpanded
              )}
              ref={(node) => {
                this.scrollParentRef = node;
              }}
            >
              {newChannel && (
                <CreateChatChannelInput
                  isFloatChat
                  createMessage={createMessage}
                  onOpenChannel={handleChannelCreated}
                  handleClearCreateMessage={this.handleClearCreateMessage}
                />
              )}
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
                {messageItems.map((item) => this.renderMessage(item, profileURLs))}
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
              userId={userId}
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
      </>
    );
  }
}

export default withStyles(styles as any)(withSnackbar(ChatChannel as any) as any);
