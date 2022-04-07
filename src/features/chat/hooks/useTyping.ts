import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from 'redux/store';

import type { Channel, KeyOfChannelEvents, Member } from 'twilio-chat';

const INITIAL_STATE = { channelId: '', friendlyName: '' };
const EVENT_TYPING_STARTED: KeyOfChannelEvents = 'typingStarted';
const EVENT_TYPING_ENDED: KeyOfChannelEvents = 'typingEnded';

export const useTyping = (channel?: Channel) => {
  const [typing, setTyping] = useState(INITIAL_STATE);

  const onTyping = useCallback(() => {
    if (!channel) {
      return Promise.resolve();
    }
    return channel?.typing();
  }, [channel]);
  const userId = useAppSelector((state) => state.user.data.userId);

  useEffect(() => {
    const typingCallback = (member: Member) => {
      if (!channel || !member.identity) {
        return;
      }
      member.getUser().then((user) => {
        if (user.identity === userId) return;
        setTyping({
          channelId: channel.sid,
          friendlyName: user.friendlyName
        });
      });
    };

    const typingEndCallback = () => {
      setTyping(INITIAL_STATE);
    };

    if (!channel) {
      return;
    }

    channel.on(EVENT_TYPING_STARTED, typingCallback);
    channel.on(EVENT_TYPING_ENDED, typingEndCallback);

    return () => {
      channel?.removeListener(EVENT_TYPING_STARTED, typingCallback);
      channel?.removeListener(EVENT_TYPING_ENDED, typingEndCallback);
    };
  }, [channel, userId]);

  return { typing, onTyping };
};
