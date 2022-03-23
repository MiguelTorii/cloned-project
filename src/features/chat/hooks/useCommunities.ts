import { useQuery } from 'react-query';

import { getTransformedChannelsMetada } from 'features/chat';

import type { ChannelMetadata, ChannelsMetadata } from 'features/chat';

export const QUERY_KEY_CHANNEL_METADATA = 'channelMetadata';

export const useChannelsMetadata = <T extends ChannelMetadata>(
  select?: (data: ChannelsMetadata) => T | undefined
) =>
  useQuery([QUERY_KEY_CHANNEL_METADATA], getTransformedChannelsMetada, {
    select,
    staleTime: Infinity
  });

export const useChannelMetadataById = (sid: string | undefined) =>
  useChannelsMetadata((data) => (sid ? data[sid] : undefined));
