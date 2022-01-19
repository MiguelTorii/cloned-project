import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainChatItem from './MainChatItem';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';
import { Member } from '../../types/models';
import { AppState } from '../../configureStore';

type Props = {
  channel?: Record<string, any>;
  onOpenChannel?: (...args: Array<any>) => any;
  selected?: boolean;
  handleRemoveChannel?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  targetChannel?: Array<any>;
  dark?: boolean;
};

const ChatListItem = ({
  dark,
  handleMuteChannel,
  selected,
  onOpenChannel,
  handleRemoveChannel,
  handleUpdateGroupName,
  targetChannel,
  channel
}: Props) => {
  const userId = useSelector<AppState, string>((state) => state.user.data.userId);
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
        unReadCount={channel.unread}
        onClick={handleOpenChannel}
      />
    </ErrorBoundary>
  );
};

export default ChatListItem;
