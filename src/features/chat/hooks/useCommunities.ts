import { useCallback, useMemo } from 'react';

import { useQuery } from 'react-query';

import { getTransformedChannelsMetada } from 'features/chat';
import { useAppSelector } from 'redux/store';

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

export const useCommunities = () => {
  const { communityChannels } = useAppSelector((state) => state.chat.data);

  const isCommunityChat = useCallback(
    (community) => communityChannels.some((channel) => channel.courseId === community),
    [communityChannels]
  );

  return {
    isCommunityChat
  };
};

export const useCommunityById = (communityId) => {
  const { communities } = useAppSelector((state) => state.chat.data);

  return useMemo(
    () => communities.find((channel) => channel.community.id === communityId),
    [communities, communityId]
  );
};

export const useCommunityChannels = (communityId) => {
  const { communityChannels } = useAppSelector((state) => state.chat.data);

  return useMemo(
    () => communityChannels.find((channel) => channel.courseId === communityId)?.channels || [],
    [communityChannels, communityId]
  );
};
