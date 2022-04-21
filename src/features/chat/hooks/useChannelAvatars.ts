import { useQuery } from 'react-query';

import { fetchAvatars } from 'utils/chat';

import type { Channel } from 'types/models';

export const QUERY_KEY_CHANNEL_AVATARS = 'channelAvatars';

export const useChannelAvatars = (channel?: Channel) =>
  useQuery([QUERY_KEY_CHANNEL_AVATARS, channel?.sid], () => fetchAvatars(channel!), {
    enabled: Boolean(channel),
    staleTime: Infinity,
    cacheTime: Infinity
  });
