import { useState, useEffect, useCallback } from 'react';
import { Channel, KeyOfChannelEvents, Member } from 'twilio-chat';

const INITIAL_STATE = { channelId: '', friendlyName: '' };
const EVENT_TYPING_STARTED: KeyOfChannelEvents = 'typingStarted';
const EVENT_TYPING_ENDED: KeyOfChannelEvents = 'typingEnded';

export const useTyping = (channel?: Channel) => {
  const [typing, setTyping] = useState(INITIAL_STATE);

  const onTyping = useCallback(() => channel?.typing(), [channel]);

  useEffect(() => {
    const typingCallback = (member: Member) => {
      if (!channel || !member.identity) {
        return;
      }
      member.getUser().then((user) => {
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
  }, [channel]);

  return { typing, onTyping };
};
