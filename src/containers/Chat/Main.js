import React, { useRef, useState, useEffect } from 'react'
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
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import EmptyMain from 'containers/Chat/EmptyMain'
import cx from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'inherit',
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
    paddingLeft: theme.spacing(4),
  },
  messageContainer: {
    flex: 1,
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
  rightDrawerClose: {
    right: 10,
  },
  rightDrawerOpen: {
    right: 10,
  },
  leftDrawerClose: {
    left: 10,
  },
  leftDrawerOpen: {
  },
  iconButton: {
    position: 'absolute',
    top: 12,
    padding: 0,
    border: '1px solid white',
    zIndex: 1002
  },
  icon: {
    fontSize: 16,
  },
}))

const Main = ({
  onCollapseLeft,
  onCollapseRight,
  leftSpace,
  rightSpace,
  channel,
  user
}) => {
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
    if (!channel) return
    try {
      channel.typing()
    } catch (err) {
      console.log(err)
    }
  }

  const onSendInput = async file => {
    // this.setState({ loading: true })
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
      // this.setState({ loading: false })
    }
  }

  const  handleImageClose = () => setImages([])
  // if (!channel) return null
  // console.log(typing)

  const renderIcon = d => {
    return ( d
      ? <KeyboardArrowLeftIcon className={classes.icon} />
      : <KeyboardArrowRightIcon className={classes.icon} />
    )}

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <IconButton
          className={cx(
            leftSpace !== 0 ? classes.leftDrawerOpen : classes.leftDrawerClose,
            classes.iconButton
          )}
          onClick={onCollapseLeft}
        >
          {renderIcon(leftSpace !== 0)}
        </IconButton>
        {channel && <IconButton
          className={cx(
            rightSpace !== 0 ? classes.rightDrawerOpen : classes.rightDrawerClose,
            classes.iconButton
          )}
          onClick={onCollapseRight}
        >
          {renderIcon(rightSpace === 0)}
        </IconButton>}
        <Typography className={classes.headerTitle}>{title}</Typography>
      </div>
      <div className={classes.messageContainer}>
        {!channel && <EmptyMain />}
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
