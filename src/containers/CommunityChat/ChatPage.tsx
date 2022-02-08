import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';

import {
  setCommunitiesAction,
  setCommunityChannelsAction,
  setCurrentCommunityAction,
  setCurrentCommunityIdAction,
  setCurrentChannelSidAction
} from 'actions/chat';
import { selectUnread } from 'redux/chat/selectors';
import { useAppSelector } from 'redux/store';
import { getCommunities, getCommunityChannels } from 'api/community';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';
import { CampaignState } from 'reducers/campaign';
import { ChatState } from 'reducers/chat';

import DirectChat from './DirectChat';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';
import useStyles from './_styles/styles';

const ChatPage = () => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const campaign = useSelector((state: { campaign: CampaignState }) => state.campaign);

  const {
    data: {
      local,
      communityChannels,
      communities,
      currentCommunity,
      currentCommunityId,
      oneTouchSendOpen,
      currentCommunityChannel
    }
  } = useSelector((state: { chat: ChatState }) => state.chat);

  const unread = useAppSelector(selectUnread);

  const [loading, setLoading] = useState<boolean>(false);

  // TODO CHAT_REFACTOR: Move logic into a chat hook
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

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  useEffect(() => {
    async function fetchCommunities() {
      try {
        setLoading(true);
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

        if (currentCommunityId && !currentCommunityChannel && nonEmptyCommunities.length > 0) {
          const defaultCommunity = nonEmptyCommunities[0].community;
          dispatch(setCurrentCommunityIdAction(defaultCommunity.id));
          if (defaultCommunity) {
            dispatch(setCurrentCommunityAction(defaultCommunity));
          }
        }

        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchCommunities();
  }, []);

  const handleSelect = useCallback(
    (course) => {
      if (course.id !== currentCommunity?.id) {
        // TODO CHAT_REFACTOR: Dispatch a single, atomic action, not 3 actions here
        dispatch(setCurrentCommunityIdAction(course.id));
        dispatch(setCurrentChannelSidAction(''));
        dispatch(setCurrentCommunityAction(course));
      }
    },
    [currentCommunity, dispatch]
  );

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  useEffect(() => {
    if (oneTouchSendOpen || currentCommunityId === 'chat' || !currentCommunityId) {
      dispatch(setCurrentCommunityAction(DEFAULT_COMMUNITY_MENU_ITEMS));
    } else if (currentCommunity && !!communities?.length && currentCommunity.id !== 'chat') {
      const targetCourse = communities.filter(
        (course) => course.community.id === currentCommunity.id
      );

      if (targetCourse.length && targetCourse[0]?.community) {
        dispatch(setCurrentCommunityAction(targetCourse[0]?.community));
      }
    } else if (currentCommunityId && !!communities?.length && currentCommunityId !== 'chat') {
      const targetCourseChannel = communities.filter(
        (community) => community.community.id === Number(currentCommunityId)
      );

      if (targetCourseChannel.length && targetCourseChannel[0].community) {
        dispatch(setCurrentCommunityAction(targetCourseChannel[0].community));
      }
    }
  }, [currentCommunityId, dispatch, currentCommunity, communities, loading, campaign.chatLanding]);

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className={classes.root}>
      <Box className={classes.collageList}>
        <CollageList
          unreadMessageCount={unread}
          communities={communities}
          communityChannels={communityChannels}
          handleSelect={handleSelect}
        />
      </Box>
      <Box className={classes.directChat}>
        {currentCommunity && currentCommunity.id === 'chat' ? <DirectChat /> : <CommunityChat />}
      </Box>
    </div>
  );
};

export default ChatPage;
