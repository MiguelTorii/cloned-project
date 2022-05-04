import { useCallback, useEffect, useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';

import type { Channel } from 'types/models';

export const QUERY_KEY_CHANNEL_MESSAGES = 'channelMessages';

export type MessagePaginator = Awaited<ReturnType<Channel['getMessages']>>;

export const useChannelMessages = (channel?: Channel) =>
  useQuery([QUERY_KEY_CHANNEL_MESSAGES, channel?.sid], () => channel?.getMessages(10), {
    enabled: Boolean(channel),
    staleTime: Infinity,
    cacheTime: Infinity
  });

export const useChannelMessagesPaginatorFetch = (
  channel?: Channel,
  onSuccess?: () => void,
  onError?: () => void
) => {
  const queryClient = useQueryClient();
  const { data: messages } = useChannelMessages(channel);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!channel) {
      return;
    }

    channel?.on('messageUpdated', async (updatedMessage) => {
      let data = queryClient.getQueryData<MessagePaginator>([
        QUERY_KEY_CHANNEL_MESSAGES,
        channel.sid
      ]);
      if (!data) {
        data = await queryClient.fetchQuery<MessagePaginator>([
          QUERY_KEY_CHANNEL_MESSAGES,
          channel.sid
        ]);
      }

      const indexOfMessage = data.items.findIndex(
        (message) => message.sid === updatedMessage.message.sid
      );
      if (indexOfMessage !== -1) {
        data.items[indexOfMessage] = updatedMessage.message;
      } else {
        data.items.push(updatedMessage.message);
      }

      queryClient.setQueryData<MessagePaginator>([QUERY_KEY_CHANNEL_MESSAGES, channel.sid], data);
    });
  }, [queryClient, channel?.sid, channel]);

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
        onSuccess?.();
      })
      .catch(() => {
        setIsLoading(false);
        onError?.();
      });
  }, [channel, messages, onError, onSuccess, queryClient]);

  return { messages, loader, isLoading };
};
