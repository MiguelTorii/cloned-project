// @flow

import React, { useState, useEffect } from 'react';
import MainChatItem from 'components/ChatListItem/MainChatItem';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import clsx from 'clsx';

type Props = {
  channel: Object,
  userId: string,
  onOpenChannel: Function,
  selected: boolean,
  handleRemoveChannel: Function,
  handleMuteChannel: Function,
  dark: boolean
};

const ChatListItem = ({
  dark,
  handleMuteChannel,
  selected,
  onOpenChannel,
  handleRemoveChannel,
  channel,
  userId
}: Props) => {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isDirectChat, setIsDirectChat] = useState(false);

  useEffect(() => {
    if (channel && channel.members) {
      if (channel.members.length === 2) {
        setIsDirectChat(true);
        channel.members.forEach((member) => {
          if (Number(member.userId) !== Number(userId)) {
            setName(`${member.firstname} ${member.lastname}`);
            setThumbnail(member.image);
            setIsOnline(member.isOnline);
          }
        });
      } else {
        setThumbnail(channel.thumbnail);
      }
    }
  }, [channel, userId]);

  const handleOpenChannel = () => {
    onOpenChannel({ channel: channel.twilioChannel });
  };

  return (
    <ErrorBoundary>
      <MainChatItem
        handleMuteChannel={handleMuteChannel}
        roomId={channel.sid}
        handleRemoveChannel={handleRemoveChannel}
        isLoading={false}
        isOnline={isOnline}
        isDirectChat={isDirectChat}
        imageProfile={thumbnail}
        dark={dark}
        selected={selected}
        name={name}
        muted={channel.muted}
        roomName={channel.title}
        lastMessage={clsx(channel.lastMessage && channel.lastMessage.message)}
        unReadCount={channel.unread}
        onClick={handleOpenChannel}
      />
    </ErrorBoundary>
  );
};

export default ChatListItem;
