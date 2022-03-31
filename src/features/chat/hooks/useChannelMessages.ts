import { useCallback, useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';

import type { Channel } from 'twilio-chat';

export const QUERY_KEY_CHANNEL_MESSAGES = 'channelMessages';

export type MessagePaginator = Awaited<ReturnType<Channel['getMessages']>>;

export const useChannelMessages = (channel?: Channel) =>
  useQuery([QUERY_KEY_CHANNEL_MESSAGES, channel?.sid], () => channel?.getMessages(10), {
    enabled: Boolean(channel),
    staleTime: Infinity,
    cacheTime: Infinity
  });

export const useChannelMessagesPaginatorFetch = (
  onSuccess: () => void,
  onError: () => void,
  // Because it might take longer to get the channel, we must set it as the last optional param
  channel?: Channel
) => {
  const queryClient = useQueryClient();
  const { data: messages } = useChannelMessages(channel);
  const [isLoading, setIsLoading] = useState(false);

  const loader = useCallback(() => {
    if (!messages?.hasPrevPage || !channel) return Promise.resolve();
    setIsLoading(true);
    return messages
      ?.prevPage()
      .then((result) => {
        queryClient.setQueryData<MessagePaginator>([QUERY_KEY_CHANNEL_MESSAGES, channel.sid], {
          ...result,
          items: [...result.items, ...(messages?.items || [])]
        });
        setIsLoading(false);
        onSuccess();
      })
      .catch(() => {
        setIsLoading(false);
        onError();
      });
  }, [channel, messages, onError, onSuccess, queryClient]);

  return { loader, isLoading };
};
