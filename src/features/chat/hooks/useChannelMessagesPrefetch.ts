import { useCallback } from 'react';

import debounce from 'lodash/debounce';
import { useQueryClient } from 'react-query';

import { HOVER_PREFETCH_DELAY } from 'constants/chat';
import { fetchAvatars } from 'utils/chat';

import { QUERY_KEY_CHANNEL_AVATARS } from './useChannelAvatars';
import { QUERY_KEY_CHANNEL_MESSAGES } from './useChannelMessages';
import { useSelectChannelById } from './useChannels';

export const useChannelMessagesPrefetch = (channelId: string) => {
  const queryClient = useQueryClient();
  const { data: channel } = useSelectChannelById(channelId);

  return useCallback(
    debounce(() => {
      if (!channel) return;
      /** prefetchQuery should not run if we have existing cache
       * but for some reason it is running
       * So we only prefetch if it doesn't exist already.
       */
      const messagesPromise = queryClient.getQueryData([QUERY_KEY_CHANNEL_MESSAGES, channel.sid])
        ? Promise.resolve()
        : queryClient.prefetchQuery([QUERY_KEY_CHANNEL_MESSAGES, channel.sid], () =>
            channel?.getMessages(10)
          );

      const avatarsPromise = queryClient.getQueryData([QUERY_KEY_CHANNEL_AVATARS, channel.sid])
        ? Promise.resolve()
        : queryClient.prefetchQuery([QUERY_KEY_CHANNEL_AVATARS, channel.sid], () =>
            fetchAvatars(channel)
          );

      return Promise.all([messagesPromise, avatarsPromise]);
    }, HOVER_PREFETCH_DELAY),
    [channel, queryClient]
  );
};
