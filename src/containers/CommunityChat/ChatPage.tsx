import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';

import {
  setCommunitiesAction,
  setCommunityChannelsAction,
  setCurrentCommunityAction,
  setCurrentCommunityIdAction,
  setCurrentChannelSidAction
} from 'actions/chat';
import { useAppSelector } from 'redux/store';
import { getCommunities, getCommunityChannels } from 'api/community';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';

import DirectChat from './DirectChat';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';
import useStyles from './_styles/styles';
import { useSelectChatByHash } from 'features/chat';

const ChatPage = () => {
  useSelectChatByHash();

  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    data: {
      communityChannels,
      communities,
      currentCommunity,
      currentCommunityId,
      oneTouchSendOpen,
      currentCommunityChannelId
    }
  } = useAppSelector((state) => state.chat);

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
        if (currentCommunityId && !currentCommunityChannelId && nonEmptyCommunities.length > 0) {
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
  }, [communities, currentCommunity, currentCommunityId, dispatch, oneTouchSendOpen]);

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className={classes.root}>
      <Box className={classes.collageList}>
        <CollageList
          communities={communities}
          communityChannels={communityChannels}
          handleSelect={handleSelect}
        />
      </Box>
      <Box className={classes.directChat}>
        {!currentCommunity?.id ? <DirectChat /> : <CommunityChat />}
      </Box>
    </div>
  );
};

export default ChatPage;
