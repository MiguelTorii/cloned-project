// @flow

import React, { useState, useEffect } from 'react';
import MainChatItem from 'components/ChatListItem/MainChatItem';
import ErrorBoundary from 'containers/ErrorBoundary';
import clsx from 'clsx'

type Props = {
  channel: Object,
  userId: string,
  onOpenChannel: Function,
  selected: boolean,
  dark: boolean
};

const ChatListItem = ({ dark, selected, onOpenChannel, channel, userId }: Props) => {
  const [name, setName] = useState('')
  const [thumbnail, setThumbnail] = useState('')

  useEffect(() => {
    if(channel && channel.members) {
      if(channel.members.length === 2) {
        channel.members.forEach(u => {
          if (Number(u.userId) !== Number(userId)) {
            setName(`${u.firstname} ${u.lastname}`)
            setThumbnail(u.image)
          }
        })
      } else {
        setThumbnail(channel.thumbnail)
      }
    }
  }, [channel, userId])

  const handleOpenChannel = () => {
    onOpenChannel(channel.twilioChannel);
  };

  return (
    <ErrorBoundary>
      <MainChatItem
        roomId={channel.sid}
        isLoading={false}
        imageProfile={thumbnail}
        dark={dark}
        selected={selected}
        name={name}
        roomName={channel.title}
        lastMessage={clsx(channel.lastMessage && channel.lastMessage.message)}
        unReadCount={channel.unread}
        onClick={handleOpenChannel}
      />
    </ErrorBoundary>
  );
}

export default ChatListItem;
