import { useQuery } from 'react-query';
import { useChannelById, useChannels } from './useChannels';
import { queryClient } from 'lib/query';
import { Unreads, getChannelsUnreadCount, getChannelUnreadCount } from '../api/unread';

export const useUnreadCount = <T extends Unreads>(select?: (data: Unreads) => number | T) => {
  const channels = useChannels();

  return useQuery(['unreadCount'], () => getChannelsUnreadCount(channels.data), {
    enabled: Boolean(channels.data?.length),
    select,
    staleTime: Infinity
  });
};

export const useUnreadCountById = (id: string) => {
  const channelQuery = useChannelById(id);

  return useQuery(['unreadCount', id], () => getChannelUnreadCount(channelQuery.data), {
    enabled: Boolean(channelQuery.data),
    staleTime: Infinity,
    initialData: () => {
      const allUnreadMessages = queryClient.getQueryData<Unreads>(['unreads']);
      const cachedUnread = allUnreadMessages?.[id] ?? 0;

      return cachedUnread;
    }
  });
};

export const useAllUnreadCount = () =>
  useUnreadCount((data) => {
    const entries = Object.values(data);
    const count = entries.reduce((value, current) => current + value, 0);
    return count;
  });

export const useUnreadById = (id: string) => useUnreadCount((data) => data[id]);
