import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import MainChatItem from './MainChatItem';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';
import { Member } from '../../types/models';
import { ChannelWrapper } from '../../reducers/chat';

type Props = {
  channel?: Record<string, any>;
  userId?: string;
  onOpenChannel?: (...args: Array<any>) => any;
  selected?: boolean;
  permission?: Array<any>;
  handleRemoveChannel?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  targetChannel?: Array<any>;
  local?: Record<string, ChannelWrapper>;
  dark?: boolean;
};

const ChatListItem = ({
  dark,
  handleMuteChannel,
  selected,
  permission,
  onOpenChannel,
  handleRemoveChannel,
  handleUpdateGroupName,
  targetChannel,
  local,
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
        channel.members.forEach((member: Member) => {
          if (String(member.userId) !== String(userId)) {
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
    onOpenChannel({
      channel: channel.twilioChannel
    });
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
        isLoading={false}
        isOnline={isOnline}
        isDirectChat={isDirectChat}
        imageProfile={thumbnail}
        dark={dark}
        selected={selected}
        name={name}
        muted={channel.muted}
        members={channel.members}
        roomName={channel.title}
        lastMessage={clsx(channel.lastMessage && channel.lastMessage.message)}
        unReadCount={channel.unread}
        onClick={handleOpenChannel}
      />
    </ErrorBoundary>
  );
};

export default ChatListItem;
