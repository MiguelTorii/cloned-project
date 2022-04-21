import { useQuery } from 'react-query';

import { getChannelsUnreadCount, getChannelUnreadCount } from 'features/chat/api/unread';

import { useSelectChannelById, useChannels } from './useChannels';

import type { Unreads } from 'features/chat/api/unread';
import type { QueryClient } from 'react-query';
import type { Channel } from 'types/models';

export const UNREAD_COUNT_QUERY_KEY = 'unreadCount';

export const useUnreadCount = <T = Unreads>(select?: (data: Unreads) => number) => {
  const channels = useChannels();

  return useQuery([UNREAD_COUNT_QUERY_KEY], () => getChannelsUnreadCount(channels.data), {
    enabled: Boolean(channels.data?.length),
    select,
    staleTime: Infinity
  });
};

export const useFetchUnreadCountById = (id: string, enabled?: boolean) => {
  const channelQuery = useSelectChannelById(id);
  return useQuery([UNREAD_COUNT_QUERY_KEY, id], () => getChannelUnreadCount(channelQuery.data), {
    enabled: Boolean(id && channelQuery.data?.sid && enabled !== undefined ? enabled : true),
    staleTime: Infinity,
    retry: 0
  });
};

export const useAllUnreadCount = () =>
  useUnreadCount((data) => {
    const entries = Object.values(data);
    const count = entries.reduce((value, current) => current + value, 0);
    return count;
  });

export const useUnreadById = (id: string) => useUnreadCount((data) => data[id]);

export const setChannelRead = async (queryClient: QueryClient, channel?: Channel) => {
  if (!channel) {
    return;
  }
  await channel.setAllMessagesRead();
  queryClient.setQueryData<Unreads>(UNREAD_COUNT_QUERY_KEY, (currentUnreads) => {
    const unreads = currentUnreads || {};
    return { ...unreads, [channel.sid]: 0 };
  });
};
