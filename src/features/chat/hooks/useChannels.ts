import { useMemo, useRef } from 'react';
import moment from 'moment';
import { useQuery } from 'react-query';

import { useChatClient } from 'features/chat/context/ChatClientProvider';
import { getChannelBySid, getChannelsFromClient } from 'lib/chat/channels';
import { useAppSelector } from 'redux/store';

import { useChannelsMetadata } from './useChannelsMetadata';

import type { ChannelMetadata, ChannelsMetadata } from 'features/chat/api/channels';
import type { Channel } from 'twilio-chat';

export const QUERY_KEY_CHANNELS = 'channels';

export const useChannels = <T = Channel[]>(select?: (data: Channel[]) => T | undefined) => {
  const client = useChatClient();

  return useQuery([QUERY_KEY_CHANNELS], () => getChannelsFromClient(client), {
    select,
    staleTime: Infinity,
    enabled: Boolean(client)
  });
};

export const useSelectChannelById = (id: string) =>
  useChannels((channels) => channels.find((channel) => channel.sid === id));

/**
 * Should not be called on many components at once i.e. chat list items.
 * Causes more re-renders than useSelectChannelById. Use for single, larger components.
 * Or to force refresh and get channel.
 */
export const useChannelById = (id?: string) => {
  const userId = useAppSelector((state) => state.user.data.userId);
  const client = useChatClient();

  return useQuery([QUERY_KEY_CHANNELS, id], () => getChannelBySid(id, client), {
    staleTime: Infinity,
    enabled: Boolean(userId && id && client)
  });
};

export const useOrderedChannelList = () => {
  const { data: channelsMetadata } = useChannelsMetadata();
  const { data: channels } = useChannels();

  // Prevent hooks from running again due to different empty array references
  const { current: emptyArr } = useRef([]);

  const ordered = useMemo(() => {
    if (!channelsMetadata || !channels || !channels.length) {
      return emptyArr;
    }

    return Object.keys(channelsMetadata)
      .filter((key) => {
        if (!channelsMetadata[key]?.id) {
          return false;
        }

        const channel = channels.find((c) => c.sid === channelsMetadata[key].sid);

        return !(channel as any)?.channelState?.attributes?.community_id;
      })
      .sort((a: keyof ChannelsMetadata, b: keyof ChannelsMetadata) => {
        const metadataA = channelsMetadata[a] as ChannelMetadata;
        const metadataB = channelsMetadata[b] as ChannelMetadata;

        if (metadataB.showFirst && !metadataA.showFirst) {
          return 1;
        }
        if (metadataA.showFirst && !metadataB.showFirst) {
          return -1;
        }
        /**
         * For empty channels, twilio auto-generates a lastMessage with an auto-generated date
         * As of twilio 6.0, they are not being ordered to the bottom of the list so we have to order this manually
         */
        const aLastMessageEmpty = metadataA.lastReceivedMessage.message === '';
        const bLastMessageEmpty = metadataB.lastReceivedMessage.message === '';

        if (aLastMessageEmpty && !bLastMessageEmpty) {
          return 1;
        }

        if (!aLastMessageEmpty && bLastMessageEmpty) {
          return -1;
        }

        return (
          moment(channelsMetadata[b].lastReceivedMessage.dateSent).valueOf() -
          moment(channelsMetadata[a].lastReceivedMessage.dateSent).valueOf()
        );
      });
  }, [channelsMetadata, emptyArr, channels]);

  return ordered;
};
