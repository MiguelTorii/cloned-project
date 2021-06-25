// @flow

import React, { useState, useEffect } from 'react';
import MainChatItem from 'components/CommunityChatListItem/MainChatItem';
import ErrorBoundary from 'containers/ErrorBoundary';
import { getGroupMembers } from 'api/chat'
import clsx from 'clsx'

type Props = {
  channel: Object,
  userId: string,
  onOpenChannel: Function,
  selected: boolean,
  permission: Array,
  handleRemoveChannel: Function,
  handleMuteChannel: Function,
  handleMarkAsRead: Function,
  handleUpdateGroupName: Function,
  targetChannel: Array,
  local: Array,
  dark: boolean
};

const ChatListItem = ({
  dark,
  handleMuteChannel,
  selected,
  permission,
  onOpenChannel,
  handleRemoveChannel,
  handleMarkAsRead,
  handleUpdateGroupName,
  targetChannel,
  local,
  channel,
  userId
}: Props) => {
  const [name, setName] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [isDirectChat, setIsDirectChat] = useState(false)
  const [members, setMembers] = useState([])

  useEffect(() => {
    const getMembers = async () => {
      const members = await getGroupMembers({ chatId: channel.sid })
      setMembers(members)
      if(channel && members) {
        if(members.length === 2) {
          setIsDirectChat(true)
          members.forEach(member => {
            if (Number(member.userId) !== Number(userId)) {
              setName(`${member.firstname} ${member.lastname}`)
              setThumbnail(member.image)
              setIsOnline(member.isOnline)
            }
          })
        } else {
          setThumbnail(channel.thumbnail)
        }
      }
    }

    getMembers()
  }, [channel, userId])

  const handleOpenChannel = () => {
    onOpenChannel({ channel: channel.twilioChannel });
  };

  return (
    <ErrorBoundary>
      <MainChatItem
        handleMuteChannel={handleMuteChannel}
        targetChannel={targetChannel[0]}
        roomId={channel.sid}
        local={local}
        permission={permission}
        handleRemoveChannel={handleRemoveChannel}
        handleUpdateGroupName={handleUpdateGroupName}
        handleMarkAsRead={handleMarkAsRead}
        isLoading={false}
        isOnline={isOnline}
        isDirectChat={isDirectChat}
        imageProfile={thumbnail}
        dark={dark}
        selected={selected}
        name={name}
        muted={channel.muted}
        members={members}
        roomName={channel.title}
        lastMessage={clsx(channel.lastMessage && channel.lastMessage.message)}
        unReadCount={channel.unread}
        onClick={handleOpenChannel}
      />
    </ErrorBoundary>
  );
}

export default ChatListItem;
