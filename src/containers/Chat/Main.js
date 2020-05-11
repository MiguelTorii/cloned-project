import React, { useCallback, useRef, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { processMessages, fetchAvatars, getTitle, getAvatar } from 'utils/chat'
import InfiniteScroll from 'react-infinite-scroller'
import uuidv4 from 'uuid/v4'
import ChatTextField from 'containers/Chat/ChatTextField'
import ChatMessage from 'components/FloatingChat/ChatMessage'
import axios from 'axios'
import { getPresignedURL } from 'api/media'
import Lightbox from 'react-images'
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate'
import Button from '@material-ui/core/Button';
import EmptyMain from 'containers/Chat/EmptyMain'
import CircularProgress from '@material-ui/core/CircularProgress';
import VideocamIcon from '@material-ui/icons/Videocam';
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'inherit',
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'relative',
    minHeight: 40,
    // top: 64,
    backgroundColor: theme.circleIn.palette.modalBackground,
    width: '100%',
    padding: theme.spacing(),
  },
  headerTitle: {
    fontSize: 18,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 1),
  },
  messageScroll: {
    flex: 1
  },
  messageContainer: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
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
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    padding: theme.spacing(1/2),
  },
  videoIcon: {
    marginRight: theme.spacing(1/2),
    paddingBottom: theme.spacing(1/8)
  }
}))

const Main = ({
  channel,
  newMessage,
  user
}) => {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [messages, setMessages] = useState([])
  const [paginator, setPaginator] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [scroll, setScroll] = useState(true)
  const end = useRef(null)
  const [avatars, setAvatars] = useState([])
  const [typing, setTyping] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    data: { userId, firstName, lastName }
  } = user

  const handleScrollToBottom = () => {
    try {
      if (scroll && end.current) {
        end.current.scrollIntoView({ behavior: 'instant' })
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(channel && newMessage && channel.sid === newMessage.channel.sid) {
      try {
        channel.setAllMessagesConsumed()
      } catch(e) {}
      setMessages([...messages, newMessage])
      setTimeout(handleScrollToBottom, 100)
    }
    // eslint-disable-next-line
  }, [newMessage])

  useEffect(() => {
    const init = async () => {
      setTitle(getTitle(channel, userId))
      try {
        channel.setAllMessagesConsumed()

        const av = await fetchAvatars(channel)
        setAvatars(av)

        const p = await channel.getMessages(10)
        setMessages(p.items)
        setPaginator(p)
        setHasMore(!(p.items.length < 10))
        handleScrollToBottom()

        if (!channel._events.typingStarted || channel._events.typingStarted.length === 0) {
          channel.on('typingStarted', member => {
            member.getUser().then(user => {
              const { state } = user
              const { friendlyName } = state
              setTyping({ channel: channel.sid, friendlyName })
            })
          })

          channel.on('typingEnded', () => {
            setTyping('')
          })
        }
      } catch(e) {}
    }

    if(channel) init()
    // eslint-disable-next-line
  }, [channel])

  const messageItems = processMessages({
    items: messages,
    userId
  })

  const handleLoadMore = () => {
    setScroll(false)
    try {
      if (paginator.hasPrevPage) {
        paginator.prevPage().then(result => {
          setMessages([...result.items, ...messages])
          setPaginator(result)
          setHasMore(!(!result.hasPrevPage || result.items.length < 10))
          // setScroll(false)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleImageClick = src => setImages([{ src }])

  const handleStartVideoCall = () => {
    // logEvent({
    // event: 'Video- Start Video',
    // props: { 'Initiated From': 'Chat' }
    // });
    const win = window.open(`/video-call/${channel.sid}`, '_blank');
    win.focus();
  };


  const  renderMessage = (item, profileURLs) => {
    const { id, type } = item
    try {
      switch (type) {
      case 'date':
        return <ChatMessageDate key={id} body={item.body} />
      case 'message':
        return (
          <ChatMessage
            key={id}
            userId={item.author}
            name={item.name}
            messageList={item.messageList}
            avatar={getAvatar({ id: item.author, profileURLs })}
            onImageLoaded={handleScrollToBottom}
            onStartVideoCall={handleStartVideoCall}
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
            onStartVideoCall={handleStartVideoCall}
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
  }

  const onSendMessage = async message => {
    setScroll(true)
    if (!channel) return
    const messageAttributes = {
      firstName,
      lastName,
      imageKey: '',
      isVideoNotification: false
    }
    setLoading(true)
    try {
      await channel.sendMessage(message, messageAttributes)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const onTyping = () => {
    if (!channel) return
    try {
      channel.typing()
    } catch (err) {
      console.log(err)
    }
  }

  const onSendInput = async file => {
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

      await channel.sendMessage('Uploaded a image', messageAttributes)
      // logEvent({
      // event: 'Chat- Send Message',
      // props: { Content: 'Image' }
      // })
      // this.setState(({ count }) => ({ count: count + 1 }))
      // this.handleMessageCount()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
      // this.setState({ loading: false })
    }
  }

  const  handleImageClose = () => setImages([])

  const startVideo = useCallback(() =>
    window.open(`/video-call/${channel.sid}`, '_blank'),
  [channel])

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {channel && <Grid container justify='space-between'>
          <Typography className={classes.headerTitle}>{title}</Typography>
          <Button
            variant='contained'
            onClick={startVideo}
            classes={{
              label: classes.videoLabel,
              root: classes.videoButton
            }}
            color='primary'
          >
            <VideocamIcon className={classes.videoIcon} /> Start Video
          </Button>
        </Grid>}
      </div>
      <div className={classes.messageContainer}>
        {(!channel || messageItems.length === 1) && <EmptyMain noChannel={!channel} />}
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
            renderMessage(item, avatars)
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
        onSendInput={onSendInput}
      />}
      <Lightbox
        images={images}
        currentImage={0}
        isOpen={images.length > 0}
        onClose={handleImageClose}
      />
    </div>
  )
}

export default Main
