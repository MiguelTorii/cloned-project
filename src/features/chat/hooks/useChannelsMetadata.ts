import { useQuery } from 'react-query';
import { ChannelsMetadata, getTransformedChannelsMetada, ChannelMetadata } from '../api/channels';

export const QUERY_KEY_CHANNEL_METADATA = 'channelMetadata';

export const useChannelsMetadata = <T extends ChannelMetadata>(
  select?: (data: ChannelsMetadata) => T
) =>
  useQuery([QUERY_KEY_CHANNEL_METADATA], () => getTransformedChannelsMetada(), {
    select,
    staleTime: Infinity
  });

export const useChannelMetadataById = (sid: string) => useChannelsMetadata((data) => data[sid]);
