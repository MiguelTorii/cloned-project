import {
  setCommunitiesAction,
  setCommunityChannelsAction,
  setCurrentCommunityIdAction
} from 'actions/chat';
import { getCommunityChannels, getCommunities } from 'api/community';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';

const fetchCommunityChannels = async (communities) => {
  if (!communities?.length) {
    return [];
  }

  try {
    const promises = communities.map(async (course) => {
      if (course?.community) {
        const { community_channels: communityChannels } = await getCommunityChannels({
          communityId: course.community.id
        });
        return communityChannels;
      }
    });
    const channels = await Promise.all(promises);
    return channels
      .filter((channel: any) => channel.length > 0)
      .map((channel) => ({
        courseId: channel[0].community_id,
        channels: channel
      }));
  } catch (e) {
    return [];
  }
};

// TODO Reimplement in react-query

export const useCommunityChatAPI = () => {
  const dispatch = useAppDispatch();
  const currentCommunityId = useAppSelector((state) => state.chat.data.currentCommunityId);
  const currentCommunityChannelId = useAppSelector(
    (state) => state.chat.data.currentCommunityChannelId
  );

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  const fetchCommunities = useCallback(async () => {
    const { communities } = await getCommunities();
    const communityChannels = await fetchCommunityChannels(communities);
    const nonEmptyCommunityIds = communityChannels
      .filter((channelGroup) => (channelGroup.channels as any).length > 0)
      .map((channelGroup) => channelGroup.courseId);
    const nonEmptyCommunities = communities.filter((community) =>
      nonEmptyCommunityIds.includes(community.community.id)
    );
    dispatch(setCommunitiesAction(nonEmptyCommunities));
    dispatch(setCommunityChannelsAction(communityChannels));
    if (currentCommunityId && !currentCommunityChannelId && nonEmptyCommunities.length > 0) {
      const defaultCommunity = nonEmptyCommunities[0].community;
      dispatch(setCurrentCommunityIdAction(defaultCommunity.id));
    }
  }, [currentCommunityChannelId, currentCommunityId, dispatch]);

  return fetchCommunities;
};
