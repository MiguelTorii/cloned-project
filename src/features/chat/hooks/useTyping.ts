import { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from 'react-query';

import { selectLocalById } from 'redux/chat/selectors';
import { useAppSelector } from 'redux/store';

import { QUERY_KEY_CHANNEL_METADATA } from './useChannelsMetadata';

import type { ChannelsMetadata } from 'features/chat';
import type { KeyOfChannelEvents, Member } from 'twilio-chat';
import type { Channel } from 'types/models';

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
  const queryClient = useQueryClient();
  const local = useAppSelector((state) => selectLocalById(state, channel?.sid));

  useEffect(() => {
    const typingCallback = async (member: Member) => {
      if (!channel || !member.identity) {
        return;
      }
      const user = await member.getUser();
      if (user.identity === userId) return;

      let name = user.friendlyName;
      // New users might not have a friendly name yet
      if (!name) {
        const metadata = queryClient.getQueryData<ChannelsMetadata>([QUERY_KEY_CHANNEL_METADATA]);
        const channelMetadata = metadata?.[channel.sid] || local;
        const channelUser = channelMetadata?.users.find(
          (channelUser) => String(channelUser.userId) === user.identity
        );
        name = channelUser ? `${channelUser.firstName} ${channelUser.lastName}` : '';
      }

      setTyping({
        channelId: channel.sid,
        friendlyName: name || 'Someone'
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
  }, [channel, local, queryClient, userId]);

  return { typing, onTyping };
};
