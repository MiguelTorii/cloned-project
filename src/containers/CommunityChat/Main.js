// @flow
import React, { memo, useMemo, useCallback, useRef, useState, useEffect } from 'react'
import Lightbox from 'react-images'
import InfiniteScroll from 'react-infinite-scroller'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import findIndex from 'lodash/findIndex'
import uuidv4 from 'uuid/v4'

import { sendMessage } from 'api/chat'
import { logEvent } from 'api/analytics'
import { getCampaign } from 'api/campaign'
import MessageQuill from 'containers/CommunityChat/MessageQuill'
import ChatHeader from 'containers/CommunityChat/ChatHeader'
import EmptyMain from 'containers/CommunityChat/EmptyMain'
import InitialAlert from 'containers/CommunityChat/InitialAlert'
import ChatMessageDate from 'components/FloatingChat/ChatMessageDate'
import ChatMessage from 'components/FloatingChat/CommunityChatMessage'
import { processMessages, fetchAvatars, getAvatar } from 'utils/chat'
import useStyles from './_styles/main'
// import axios from 'axios'
// import { getPresignedURL } from 'api/media'
// import ChatTextField from 'containers/CommunityChat/ChatTextField'
// import LoadImg from 'components/LoadImg'
// import CoverImg from 'assets/svg/community-chat-default-cover.svg'

type Props = {
  isCommunityChat: boolean,
  selectedCourse: Object,
  channel: Object,
  // mainMessage: Array,
  // setMainMessage: Function,
  newMessage: Object,
  rightSpace: number,
  local: Object,
  newChannel: boolean,
  user: Object,
  onSend: Function,
  setRightPanel: Function,
  handleBlock: Function,
  handleUpdateGroupName: Function,
};

const Main = ({
  isCommunityChat = false,
  selectedCourse,
  channel,
  // mainMessage,
  // setMainMessage,
  selectedChannel,
  newMessage,
  rightSpace,
  local,
  newChannel,
  user,
  onSend,
  setRightPanel,
  handleBlock,
  handleUpdateGroupName,
}: Props) => {
  const classes = useStyles()
  const end = useRef(null)
  const [messages, setMessages] = useState([])
  const [paginator, setPaginator] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [scroll, setScroll] = useState(true)
  const [value, setValue] = useState('')
  const [avatars, setAvatars] = useState([])
  const [typing, setTyping] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState({})
  const [campaign, setCampaign] = useState(null)
  const [showError, setShowError] = useState(false)
  const memberKeys = useMemo(() => Object.keys(members), [members])

  const otherUser = useMemo(() => {
    if (memberKeys.length !== 2) return null
    return members[memberKeys.find(key => key !== user.data.userId)]
  }, [memberKeys, members, user.data.userId])

  const hasUnregistered = useMemo(() => {
    return Boolean(memberKeys.find(key => !members[key].registered))
  }, [memberKeys, members])

  const {
    expertMode,
    data: { userId, firstName, lastName }
  } = user

  const handleScrollToBottom = useCallback(() => {
    try {
      if (scroll && end.current) {
        end.current.scrollIntoView({ behavior: 'instant' })
      }
    } catch (err) {
      console.log(err)
    }
  }, [scroll])

  useEffect(() => {
    if (channel && local && local[channel.sid]) {
      const { members } = local[channel.sid]
      const newMembers = {}
      members.forEach(m => {
        newMembers[m.userId] = m
      })
      setMembers(newMembers)
    }
  }, [local, channel])

  useEffect(() => {
    if (channel && newMessage && channel.sid === newMessage.channel.sid) {
      try {
        channel.setAllMessagesConsumed()
      } catch (e) {
        console.log(e)
      }
      const index = findIndex(messages, m => m.sid === newMessage.sid)
      if (index === -1) {
        setMessages([...messages, newMessage])
        setTimeout(handleScrollToBottom, 100)
      }
    }
    // eslint-disable-next-line
  }, [newMessage])

  useEffect(() => {
    const init = async () => {
      try {
        channel.setAllMessagesConsumed()

        const av = await fetchAvatars(channel)
        setAvatars(av)

        const aCampaign = await getCampaign({ campaignId: 9 })
        setCampaign(aCampaign)

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
      } catch (e) {
        console.log(e)
      }
    }

    if (channel) init()
    // eslint-disable-next-line
  }, [channel])

  const messageItems = useMemo(() => processMessages({
    items: messages,
    userId
  }), [messages, userId])

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

  const handleImageClick = useCallback(src => {
    setImages([{ src }])
  }, [])

  const handleStartVideoCall = useCallback(() => {
    logEvent({
      event: 'Video- Start Video',
      props: { 'Initiated From': 'Chat' }
    })
    const win = window.open(`/video-call/${channel.sid}`, '_blank')
    win.focus()
  }, [channel])

  const getRole = useCallback(userId => {
    if (!members[userId]) return null
    const { role } = members[userId]
    return role
  }, [members])

  const getIsOnline = useCallback(userId => {
    if (!members[userId]) return null
    const { isOnline } = members[userId]
    return isOnline
  }, [members])

  const renderMessage = useCallback((item, profileURLs) => {
    const { id, type } = item
    const role = getRole(item.author)
    const isOnline = getIsOnline(item.author)

    try {
      switch (type) {
      case 'date':
        return <ChatMessageDate key={id} body={item.body} />
      case 'message':
      case 'own':
        return (
          <ChatMessage
            key={id}
            role={role}
            date={item.date}
            isOnline={isOnline}
            isOwn={type === 'own'}
            currentUserId={userId}
            userId={item.author}
            isGroupChannl={members.length === 2}
            name={item.name}
            messageList={item.messageList}
            avatar={getAvatar({ id: item.author, profileURLs })}
            onImageLoaded={handleScrollToBottom}
            onStartVideoCall={handleStartVideoCall}
            onImageClick={handleImageClick}
            handleBlock={handleBlock}
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
  }, [getIsOnline, getRole, handleImageClick, handleScrollToBottom, handleStartVideoCall, handleBlock, members, userId])

  const onSendMessage = useCallback(async message => {
    setScroll(true)
    if (!channel) return

    logEvent({
      event: 'Chat- Send Message',
      props: { Content: 'Text', 'Channel SID': channel.sid }
    })

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
      })

      onSend()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [channel, firstName, lastName, onSend])

  const onTyping = useCallback(() => {
    if (!channel) return
    try {
      channel.typing()
    } catch (err) {
      console.log(err)
    }
  }, [channel])

  const handleRTEChange = useCallback(updatedValue => {
    if (updatedValue.trim() === '<p><br></p>') {
      setValue('')
    }
    else {
      const currentValue = updatedValue.replaceAll('<p><br></p>', '')
      setValue(currentValue)
    }
  }, [])

  const handleClick = useCallback((quill) => async () => {
    if (value.trim() === '' || !value) {
      setShowError(true)
    } else {
      await onSendMessage(value.replaceAll('<p><br></p>', ''))
      setValue('')
      if (quill) {
        quill.setText('')
      }
    }
  }, [onSendMessage, value])

  const handleImageClose = useCallback(() => setImages([]), [])

  const startVideo = useCallback(() => {
    window.open(`/video-call/${channel.sid}`, '_blank')
  }, [channel])

  const videoEnabled = useMemo(() => (campaign && campaign.variation_key && campaign.variation_key !== 'hidden'), [campaign])

  const unregisteredUserMessage = useMemo(() => {
    if (newChannel) return null
    if (otherUser && hasUnregistered && messageItems.length !== 1) {
      return (
        <Typography
          className={classes.unregisteredMessage}
        >
          {otherUser.firstname} hasn't logged into CircleIn yet. We’ve sent a notification to log on and respond to you.
        </Typography>
      )
    }

    if (hasUnregistered && messageItems.length !== 1) {
      return (
        <Typography
          className={classes.unregisteredMessage}
        >
        There are some users who hasn't logged into CircleIn yet. We've sent them a notification...
        </Typography>
      )
    }

    return null
  }, [classes.unregisteredMessage, hasUnregistered, messageItems.length, newChannel, otherUser])

  return (
    <div className={classes.root}>
      {channel && <ChatHeader
        channel={channel}
        title={isCommunityChat
          ? selectedChannel?.chat_name
          : local[channel.sid].title
        }
        rightSpace={rightSpace}
        otherUser={otherUser}
        memberKeys={memberKeys}
        startVideo={startVideo}
        videoEnabled={videoEnabled}
        local={local}
        onOpenRightPanel={setRightPanel}
        handleUpdateGroupName={handleUpdateGroupName}
      />}
      <div className={classes.messageRoot}>
        <div className={classes.messageContainer}>
          {!channel && (
            <EmptyMain
              otherUser={otherUser}
              noChannel={!channel}
              newChannel={newChannel}
              expertMode={expertMode}
            />
          )}
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
            {!hasMore
              && isCommunityChat
              && <div className={classes.bannerImage}>
                {/* <LoadImg className={classes.banner} url={CoverImg}/> */}
              </div>
            }
            {!hasMore && <InitialAlert
              isCommunityChat={isCommunityChat}
              selectedCourse={selectedCourse}
              local={local}
              userId={userId}
              channel={channel}
            />}
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
        {unregisteredUserMessage}
        <Lightbox
          images={images}
          currentImage={0}
          isOpen={images.length > 0}
          onClose={handleImageClose}
        />

        {channel && <MessageQuill
          value={value}
          userId={userId}
          onSendMessage={onSendMessage}
          onChange={handleRTEChange}
          setValue={setValue}
          handleClick={handleClick}
          onTyping={onTyping}
          showError={showError}
        />}

        {channel && <div className={classes.typing}>
          <Typography
            className={classes.typingText}
            variant="subtitle1"
          >
            {typing && typing.channel === channel.sid ? `${typing.friendlyName} is typing ...` : ''}
          </Typography>
        </div>}
      </div>
    </div>
  )
}

export default memo(Main)
