import React, { useRef, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { processMessages, fetchAvatars, getTitle, getAvatar } from 'utils/chat'
import InfiniteScroll from 'react-infinite-scroller'
import uuidv4 from 'uuid/v4'
import ChatTextField from 'components/FloatingChat/ChatTextField'
import ChatMessage from 'components/FloatingChat/ChatMessage'
import axios from 'axios'
import { getPresignedURL } from 'api/media'
import Lightbox from 'react-images'
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    // position: 'fixed',
    // top: 64,
    backgroundColor: theme.circleIn.palette.modalBackground,
    width: '100%',
    padding: theme.spacing(),
    paddingLeft: theme.spacing(2),
  },
  headerTitle: {
    fontSize: 18,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  messageContainer: {
    height: 'calc(100vh - 185px)',
    overflowY: 'auto',
  },
  typing: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    // color: 'black'
    marginLeft: theme.spacing()
  },
}))

const Main = ({ channel, user }) => {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState(null)
  const [paginator, setPaginator] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [scroll, setScroll] = useState(true)
  const end = useRef(null)
  const [avatars, setAvatars] = useState([])
  const [typing, setTyping] = useState(null)
  const [images, setImages] = useState([])
  const [prevChannel, setPrevChannel] = useState(null)

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
    if(newMessage) {
      setMessages([...messages, newMessage])
      setTimeout(handleScrollToBottom, 100)
      setNewMessage(null)
    }
    // eslint-disable-next-line
  }, [newMessage])

  useEffect(() => {
    const init = async () => {
      if (prevChannel) {
        prevChannel.removeAllListeners()
      }
      setPrevChannel(channel)
      setTitle(getTitle(channel, userId))

      const av = await fetchAvatars(channel)
      setAvatars(av)

      const p = await channel.getMessages(10)
      setMessages(p.items)
      setPaginator(p)
      setHasMore(!(p.items.length < 10))
      handleScrollToBottom()

      channel.on('messageAdded', message => {
        setNewMessage(message)
      })

      channel.on(
        'updated',
        async ({ channel: updatedChannel, updateReasons }) => {
          if (updateReasons.indexOf('attributes') > -1) {
            setTitle(getTitle(updatedChannel, userId))
          }
        }
      )

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

    if(channel) init()
    // eslint-disable-next-line
  }, [channel])

  const messageItems = processMessages({
    items: messages,
    userId
  })

  const handleLoadMore = () => {
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
    const messageAttributes = {
      firstName,
      lastName,
      imageKey: '',
      isVideoNotification: false
    }
    // this.setState({ loading: true })
    try {
      await channel.sendMessage(message, messageAttributes)

    } catch (err) {
      console.log(err)
    } finally {
      // this.setState({ loading: false })
    }
  }

  const onTyping = () => {
    try {
      channel.typing()
    } catch (err) {
      console.log(err)
    }
  }

  const onSendInput = async file => {
    // this.setState({ loading: true })

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
      // this.setState({ loading: false })
    }
  }

  const  handleImageClose = () => setImages([])
  if (!channel) return null
  //console.log(typing)
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.headerTitle}>{title}</Typography>
      </div>
      <div className={classes.messageContainer}>
        <InfiniteScroll
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
        </InfiniteScroll>
        {typing && typing.channel === channel.sid && (
          <div className={classes.typing}>
            <Typography
              className={classes.typingText}
              variant="subtitle1"
            >{`${typing.friendlyName} is typing ...`}</Typography>
          </div>
        )}
      </div>
      <ChatTextField
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        onSendInput={onSendInput}
      />
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
