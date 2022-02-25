import moment from 'moment';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import {
  TransformedChannels,
  getTransformedAPIChannels,
  TransformedChannel
} from '../api/apiChannels';
import { useLocalChannels } from './useLocalChannels';

const useChannels = <T extends TransformedChannel>(select?: (data: TransformedChannels) => T) =>
  useQuery('channels', () => getTransformedAPIChannels(), {
    select,
    staleTime: Infinity
  });

const useChannelById = (sid: string) => useChannels((data) => data[sid]);

const useOrderedChannelList = () => {
  const { data: channels } = useChannels();
  const { data: localChannels = [] } = useLocalChannels();

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
      .sort((a: keyof TransformedChannels, b: keyof TransformedChannels) => {
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

export { useChannels, useChannelById, useOrderedChannelList };
