// @flow

import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get'
import InfiniteScroll from 'react-infinite-scroller'
import ChatTextField from 'containers/StudyRoomChat/ChatTextField'
import Lightbox from 'react-images'
import { processMessages } from 'utils/chat'
import CircularProgress from '@material-ui/core/CircularProgress';
import ChatMessage from 'containers/StudyRoomChat/ChatMessage'
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate'
import uuidv4 from 'uuid/v4'
import { sendMessage } from 'api/chat'
import { logEvent } from 'api/analytics';
import axios from 'axios'
import { getPresignedURL } from 'api/media'
import cx from 'classnames'
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  messageScroll: {
    flex: 1
  },
  messageContainer: {
    margin: theme.spacing(0, 1),
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  messageContainerNoImg: {
    height: 405,
  },
  messageContainerImg: {
    height: 300,
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
});

type Props = {
  classes: Object,
  user: Object,
  channel: Object
};

const StudyRoomChat = ({ members, user, channel, classes }: Props) => {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(null)
  const [loading, setLoading] = useState(false)
  const end = useRef(null)
  const [scroll, setScroll] = useState(true)
  const [images, setImages] = useState([])
  const [paginator, setPaginator] = useState(null)
  const [input, setInput] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [mainMessage, setMainMessage] = useState('')

  const onSend = () => {}

  const {
    data: { userId, firstName, lastName }
  } = user

  const onTyping = useCallback(() => {
    const twilioChannel = get(channel, 'twilioChannel')
    if (!twilioChannel) return
    try {
      twilioChannel.typing()
    } catch (err) {
      console.log(err)
    }
  }, [channel])

  const getRole = useCallback(userId => {
    if (!members[userId]) return null
    const { role } = members[userId]
    return role
  }, [members])

  const messageItems = useMemo(() => processMessages({
    items: messages,
    userId
  }), [messages, userId])

  const handleScrollToBottom = useCallback(() => {
    try {
      if (scroll && end.current) {
        end.current.scrollIntoView({ behavior: 'instant' })
      }
    } catch (err) {
      console.log(err)
    }
  }, [scroll])

  const onSendMessage = useCallback(async message => {
    setScroll(true)
    if (!channel) return

    logEvent({
      event: 'Chat- Send Message',
      props: { Content: 'Text', 'Channel SID': channel.sid }
    });

    const messageAttributes = {
      firstName,
      lastName,
      imageKey: '',
      isVideoNotification: false
    }
    setLoading(true)
    try {
      await sendMessage({ message, ...messageAttributes, chatId: channel.sid })

      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Text' }
      });

      onSend();
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [channel, firstName, lastName])


  useEffect(() => {
    const init = async () => {
      try {
        const twilioChannel = get(channel, 'twilioChannel')
        twilioChannel.setAllMessagesConsumed()

        const p = await twilioChannel.getMessages(10)
        setMessages(p.items)
        setPaginator(p)
        setHasMore(!(p.items.length < 10))
        handleScrollToBottom()

        if (
          twilioChannel && (
            !twilioChannel._events.typingStarted ||
            twilioChannel._events.typingStarted.length === 0
          )
        ) {
          twilioChannel.on('typingStarted', member => {
            member.getUser().then(user => {
              const { state } = user
              const { friendlyName } = state
              setTyping({ channel: twilioChannel.sid, friendlyName })
            })
          })

          twilioChannel.on('typingEnded', () => {
            setTyping('')
          })
        }
      } catch (e) {}
    }

    if (channel) init()
  }, [channel, handleScrollToBottom])

  const handleImageClick = useCallback(src => {
    setImages([{ src }])
  }, [])

  const renderMessage = useCallback((item) => {
    const { id, type } = item
    const role = getRole(item.author)
    try {
      switch (type) {
      case 'date':
        return <ChatMessageDate key={id} body={item.body} />
      case 'message':
        return (
          <ChatMessage
            key={id}
            role={role}
            userId={item.author}
            name={item.name}
            messageList={item.messageList}
            avatar={get(members, `${item.author}.avatar`)}
            onImageLoaded={handleScrollToBottom}
            onStartVideoCall={() => {}}
            onImageClick={handleImageClick}
          />
        )
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
        )
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
        )
      default:
        return null
      }
    } catch (err) {
      console.log(err)
      return null
    }
  }, [getRole, handleImageClick, handleScrollToBottom, members])

  const handleLoadMore = useCallback(() => {
    setScroll(false)
    try {
      if (paginator.hasPrevPage) {
        paginator.prevPage().then(result => {
          setMessages([...result.items, ...messages])
          setPaginator(result)
          setHasMore(!(!result.hasPrevPage || result.items.length < 10))
        })
      }
    } catch (err) {
      console.log(err)
    }
  }, [messages, paginator])

  const onSendInput = useCallback(async file => {
    setLoading(true)
    if (!channel) return

    try {
      const result = await getPresignedURL({
        userId,
        type: 4,
        mediaType: file.type
      })

      const { readUrl, url } = result

      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type
        }
      })

      const messageAttributes = {
        firstName,
        lastName,
        imageKey: readUrl,
        isVideoNotification: false
      }

      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Image', 'Channel SID': channel.sid }
      });

      await sendMessage({
        message: 'Uploaded a image',
        ...messageAttributes,
        chatId: channel.sid
      })
      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Image' }
      })
      // this.setState(({ count }) => ({ count: count + 1 }))
      // this.handleMessageCount()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
      // this.setState({ loading: false })
    }
  }, [channel, firstName, lastName, userId])

  const handleImageClose = useCallback(() => setImages([]), [])

  return (
    <ErrorBoundary>
      <div className={cx(
        classes.messageContainer,
        input ? classes.messageContainerImg : classes.messageContainerNoImg
      )}>
        {channel && <InfiniteScroll
          className={classes.messageScroll}
          threshold={50}
          pageStart={0}
          loadMore={handleLoadMore}
          hasMore={hasMore}
          useWindow={false}
          initialLoad={false}
          isReverse
        >
          {messageItems.map(item =>
            renderMessage(item)
          )}
          {loading && (
            <div className={classes.progress}>
              <CircularProgress size={20} />
            </div>
          )}
        </InfiniteScroll>}
      </div>
      {channel && <div className={classes.typing}>
        <Typography
          className={classes.typingText}
          variant="subtitle1"
        >
          {typing && typing.channel === channel.sid ? `${typing.friendlyName} is typing ...` : ''}
        </Typography>
      </div>}
      {channel && <ChatTextField
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        input={input}
        setInput={setInput}
        message={mainMessage}
        setMessage={setMainMessage}
        onSendInput={onSendInput}
      />}
      <Lightbox
        images={images}
        currentImage={0}
        isOpen={images.length > 0}
        onClose={handleImageClose}
      />

    </ErrorBoundary>
  )
}


export default withStyles(styles)(StudyRoomChat);
