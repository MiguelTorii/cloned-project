import React, { memo, useCallback, useLayoutEffect, useMemo } from 'react';

import { MessageItemType } from 'constants/common';
import type { AvatarData } from 'utils/chat';
import { getAvatar, processMessages } from 'utils/chat';

import ChatMessageDate from 'components/FloatingChat/ChatMessageDate';
import ChatMessage from 'components/FloatingChat/CommunityChatMessage';
import StudyRoomChatMessage from 'containers/StudyRoomChat/ChatMessage';
import { useChatScrollToBottom } from 'features/chat/hooks/useChatScrollToBottom';
import { useAppSelector } from 'redux/store';

import type { Message } from '@twilio/conversations';
import type { ChannelMetadata } from 'features/chat';
import type { Channel } from 'types/models';

interface Props {
  channel: Channel;
  channelMembers: ChannelMetadata['users'];
  handleBlock?: ((...args: Array<any>) => any) | undefined;
  handleImageClick: (src: string | Blob) => void;
  handleStartVideoCall?: () => void;
  isCommunityChat?: boolean;
  members: { [index: number]: ChannelMetadata['users'][0] };
  messages: Message[];
  avatars: AvatarData[];
  isVideoChat?: boolean;
}

const ChatMessages = ({
  channel,
  channelMembers,
  handleBlock,
  avatars,
  handleImageClick,
  handleStartVideoCall,
  members,
  messages,
  isVideoChat
}: Props) => {
  const userId = useAppSelector((state) => state.user.data.userId);

  const { ref, handleScrollToBottom } = useChatScrollToBottom(messages);

  const messageItems = processMessages({
    items: messages,
    userId,
    channelId: channel.sid
  });

  // Calculate last message index.
  const lastReadIndex = useMemo(() => {
    const lastReadMessageIndex = channel.lastConsumedMessageIndex;

    let resultIndex = lastReadMessageIndex;
    for (const messageItem of messageItems) {
      if (
        messageItem.type === MessageItemType.OWN ||
        messageItem.type === MessageItemType.MESSAGE
      ) {
        for (const message of messageItem.messageList) {
          if (message.index > (lastReadMessageIndex || 0)) {
            if (messageItem.type === MessageItemType.MESSAGE) {
              return resultIndex;
            }
            resultIndex = message.index;
          }
        }
      }
    }
    return resultIndex;
  }, [channel.lastConsumedMessageIndex, messageItems]);

  const getIsOnline = useCallback(
    (userId) => {
      if (!members[userId]) return false;

      const { isOnline } = members[userId];
      return isOnline;
    },
    [members]
  );

  const renderDate = (id: string, body: string) => <ChatMessageDate key={id} body={body} />;

  const renderMessage = (message: ChatMessage, index: number, arr: ChatMessage[]) => {
    const isLastMessage = index === arr.length - 2;
    const { id } = message;
    const isOnline = getIsOnline(message.author);

    return (
      <ChatMessage
        key={id}
        channelId={channel.sid}
        isOnline={isOnline}
        isLastMessage={isLastMessage}
        lastReadMessageIndex={lastReadIndex}
        userId={message.author}
        members={channelMembers}
        isGroupChannel={channelMembers.length > 2}
        name={message.name}
        messageList={message.messageList}
        avatar={getAvatar({
          id: message.author,
          profileURLs: avatars
        })}
        onStartVideoCall={handleStartVideoCall}
        onImageClick={handleImageClick}
        handleBlock={handleBlock}
      />
    );
  };

  const renderVideoMessage = (message: ChatMessage) => (
    <StudyRoomChatMessage
      key={message.id}
      isUserOnline={getIsOnline(message.author)}
      userId={message.author}
      name={message.name}
      messageList={message.messageList}
      avatar={avatars[message.author]?.profileImageUrl}
      onStartVideoCall={() => {}}
      onImageClick={handleImageClick}
    />
  );

  const renderOwnVideoMessage = (message: ChatMessage) => (
    <StudyRoomChatMessage
      key={message.id}
      messageList={message.messageList}
      isOwn
      onStartVideoCall={() => {}}
      onImageClick={handleImageClick}
    />
  );

  if (isVideoChat) {
    return (
      <>
        {messageItems.map((item) => {
          const { id, type } = item;
          switch (type) {
            case 'date':
              return renderDate(id, item.body);

            case 'message':
              return renderVideoMessage(item);

            case 'own': {
              return renderOwnVideoMessage(item);
            }
            case 'end':
              return <Last key={id} ref={ref} onMount={handleScrollToBottom} />;

            default:
              return <></>;
          }
        })}
      </>
    );
  }

  return (
    <>
      {messageItems.map((item, index, arr) => {
        const { id, type } = item;
        switch (type) {
          case 'date':
            return renderDate(id, item.body);

          case 'message':
          case 'own': {
            return renderMessage(item, index, arr);
          }
          case 'end':
            return <Last key={id} ref={ref} onMount={handleScrollToBottom} />;

          default:
            return <></>;
        }
      })}
    </>
  );
};

const Last = React.forwardRef<HTMLDivElement, { onMount: () => void }>(({ onMount }, ref) => {
  useLayoutEffect(() => {
    onMount();
    // Trigger scroll to the bottom only when last item mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      style={{
        float: 'left',
        clear: 'both'
      }}
    />
  );
});

export default ChatMessages;
