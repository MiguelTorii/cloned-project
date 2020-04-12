// @flow

import React, { useState, useEffect } from 'react';
import MainChatItem from 'components/ChatListItem/MainChatItem';
import { getTitle, getSubTitle } from 'utils/chat';
import ErrorBoundary from 'containers/ErrorBoundary';

type Props = {
  channel: Object,
  userId: string,
  onOpenChannel: Function,
  selected: boolean,
  dark: boolean,
  onUpdateUnreadCount: Function
};

const ChatListItem = ({ dark, selected, onOpenChannel, channel, userId, onUpdateUnreadCount }: Props) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [unread, setUnread] = useState(0)
  const [newUnread, setNewUnread] = useState(0)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [groupImage, setGroupImage] = useState('')

  useEffect(() => {
    if (newUnread !== 0){
      setUnread(newUnread)
      setNewUnread(0)
    }
  }, [newUnread])

  useEffect(() => {
    try {
      Promise.all([
        channel.getUnconsumedMessagesCount(),
        channel.getMessages(1)
      ]).then(results => {
        const { state, members = [] } = channel;
        const { attributes = {} } = state;
        const { thumbnail = '', users = [] } = attributes;
        if (thumbnail !== '') {
          setGroupImage(thumbnail)
        } else if (users.length === 2) {
          members.forEach(member => {
            const { identity = '' } = member.state || {};
            if (Number(identity) !== Number(userId)) {
              member.getUserDescriptor().then(user => {
                setGroupImage(user.attributes.profileImageUrl)
                setName(user.friendlyName || '')
              });
            }
          });
        }

        const [u, messages] = results
        const { items } = messages;
        const t = getTitle(channel, userId);
        const st = items.length > 0 ? getSubTitle(items[0], userId) : '';
        setNewUnread(u || 0)
        setTitle(t)
        setSubTitle(st)
        setLoading(false)
        onUpdateUnreadCount(u);
      });

      if (!channel._events.messageAdded || channel._events.messageAdded.length === 0) {
        channel.on('messageAdded', message => {
          const st = getSubTitle(message, userId);
          const { channel: { lastConsumedMessageIndex }, index } = message
          setSubTitle(st)
          setNewUnread(index - lastConsumedMessageIndex)
          onUpdateUnreadCount(1);
        });

        channel.on('updated', ({ updateReasons }) => {
          if (updateReasons.indexOf('lastConsumedMessageIndex') > -1) {
            onUpdateUnreadCount(-unread);
            setUnread(0)
          } else if (updateReasons.indexOf('attributes') > -1) {
            const t = getTitle(channel, userId);
            setTitle(t)
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      channel.removeAllListeners()
    }
    // eslint-disable-next-line
  }, [])

  const handleOpenChannel = () => {
    onOpenChannel(channel);
  };

  return (
    <ErrorBoundary>
      <MainChatItem
        roomId={channel.sid}
        isLoading={loading}
        imageProfile={groupImage}
        dark={dark}
        selected={selected}
        name={name}
        roomName={title}
        lastMessage={subTitle}
        unReadCount={unread}
        onClick={handleOpenChannel}
      />
    </ErrorBoundary>
  );
}

export default ChatListItem;
