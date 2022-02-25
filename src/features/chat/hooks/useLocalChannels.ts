import { getLocalChannels } from 'lib/chat/channels';
import { useQuery } from 'react-query';
import { useAppSelector } from 'redux/store';
import { Channel } from 'twilio-chat';

export const useLocalChannels = <T extends Channel[]>(select?: (data: Channel[]) => T) => {
  const userId = useAppSelector((state) => state.user.data.userId);

  return useQuery(['localChannels'], () => getLocalChannels(userId), {
    select,
    staleTime: Infinity,
    enabled: Boolean(userId)
  });
};

export const useLocalChannelById = (id: string) => {
  const userId = useAppSelector((state) => state.user.data.userId);

  return useQuery(['localChannels', 'id'], () => getLocalChannels(userId), {
    select: (data) => data.find((channel) => channel.sid === id),
    staleTime: Infinity,
    enabled: Boolean(userId)
  });
};
