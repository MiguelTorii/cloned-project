import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Channel } from 'twilio-chat';
import moment from 'moment';

import { getLocalChannels } from 'lib/chat/channels';
import { useAppSelector } from 'redux/store';

import { useChannelsMetadata } from './useChannelsMetadata';
import { ChannelsMetadata } from '../api/channels';

export const QUERY_KEY_CHANNELS = 'channels';

export const useChannels = <T extends Channel[]>(select?: (data: Channel[]) => T) => {
  const userId = useAppSelector((state) => state.user.data.userId);

  return useQuery([QUERY_KEY_CHANNELS], () => getLocalChannels(userId), {
    select,
    staleTime: Infinity,
    enabled: Boolean(userId)
  });
};

export const useChannelById = (id: string) => {
  const userId = useAppSelector((state) => state.user.data.userId);

  return useQuery([QUERY_KEY_CHANNELS, 'id'], () => getLocalChannels(userId), {
    select: (data) => data.find((channel) => channel.sid === id),
    staleTime: Infinity,
    enabled: Boolean(userId)
  });
};

export const useOrderedChannelList = () => {
  const { data: channels } = useChannelsMetadata();
  const { data: localChannels = [] } = useChannels();

  const ordered = useMemo(() => {
    if (!channels || !localChannels.length) {
      return [];
    }

    return Object.keys(channels)
      .filter((key) => {
        if (!channels[key]?.id) {
          return false;
        }

        const channel = localChannels.find((c) => c.sid === channels[key].sid);

        return !(channel as any)?.channelState?.attributes?.community_id;
      })
      .sort((a: keyof ChannelsMetadata, b: keyof ChannelsMetadata) => {
        /**
         * For empty channels, twilio auto-generates a lastMessage with an auto-generated date
         * As of twilio 6.0, they are not being ordered to the bottom of the list so we have to order this manually
         */
        const aLastMessageEmpty = channels[a].lastReceivedMessage.message === '';
        const bLastMessageEmpty = channels[b].lastReceivedMessage.message === '';

        if (aLastMessageEmpty && !bLastMessageEmpty) {
          return 1;
        }

        if (!aLastMessageEmpty && bLastMessageEmpty) {
          return -1;
        }

        return (
          moment(channels[b].lastReceivedMessage.date).valueOf() -
          moment(channels[a].lastReceivedMessage.date).valueOf()
        );
      });
  }, [channels, localChannels]);

  return ordered;
};
