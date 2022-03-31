import React, { memo, useCallback, useLayoutEffect, useMemo } from 'react';

import { MessageItemType } from 'constants/common';
import type { AvatarData } from 'utils/chat';
import { getAvatar, processMessages } from 'utils/chat';

import ChatMessageDate from 'components/FloatingChat/ChatMessageDate';
import ChatMessage from 'components/FloatingChat/CommunityChatMessage';
import { useAppSelector } from 'redux/store';

import type { ChannelMetadata } from 'features/chat';
import type { Channel, Message } from 'twilio-chat';

interface Props {
  channel: Channel;
  channelMembers: ChannelMetadata['users'];
  handleBlock: ((...args: Array<any>) => any) | undefined;
  handleImageClick: (src: string | Blob) => void;
  handleScrollToBottom: () => void;
  handleStartVideoCall: () => void;
  isCommunityChat: boolean;
  members: { [index: number]: ChannelMetadata['users'][0] };
  messages: Message[];
  avatars: AvatarData[];
}

const ChatMessages = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      channel,
      channelMembers,
      handleBlock,
      avatars,
      handleImageClick,
      handleScrollToBottom,
      handleStartVideoCall,
      members,
      messages
    },
    ref
  ) => {
    const userId = useAppSelector((state) => state.user.data.userId);

    const messageItems = useMemo(
      () =>
        processMessages({
          items: messages,
          userId,
          channelId: channel.sid
        }),
      [channel.sid, messages, userId]
    );

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

    return (
      <>
        {messageItems.map((item, index, arr) => {
          const isLastMessage = index === arr.length - 2;
          const { id, type } = item;
          switch (type) {
            case 'date':
              return <ChatMessageDate key={id} body={item.body} />;

            case 'message':
            case 'own': {
              const isOnline = getIsOnline(item.author);
              return (
                <ChatMessage
                  key={id}
                  channelId={channel.sid}
                  isOnline={isOnline}
                  isLastMessage={isLastMessage}
                  lastReadMessageIndex={lastReadIndex}
                  userId={item.author}
                  members={channelMembers}
                  isGroupChannel={channelMembers.length > 2}
                  name={item.name}
                  messageList={item.messageList}
                  avatar={getAvatar({
                    id: item.author,
                    profileURLs: avatars
                  })}
                  onStartVideoCall={handleStartVideoCall}
                  onImageClick={handleImageClick}
                  handleBlock={handleBlock}
                />
              );
            }
            case 'end':
              return <Test key={id} ref={ref} onMount={handleScrollToBottom} />;

            default:
              return <></>;
          }
        })}
      </>
    );
  }
);

const Test = React.forwardRef<HTMLDivElement, { onMount: () => void }>(({ onMount }, ref) => {
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

export default memo(ChatMessages);
