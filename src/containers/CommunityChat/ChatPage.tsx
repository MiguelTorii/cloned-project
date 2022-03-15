import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';

import {
  setCommunitiesAction,
  setCommunityChannelsAction,
  setCurrentCommunityIdAction
} from 'actions/chat';
import { useAppSelector } from 'redux/store';
import { getCommunities, getCommunityChannels } from 'api/community';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';

import DirectChat from './DirectChat';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import useStyles from './_styles/styles';
import { useSelectChatByIdURL } from 'features/chat';
import { useParams } from 'react-router';

const ChatPage = () => {
  useSelectChatByIdURL();
  const { chatId } = useParams();

  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    data: {
      communityChannels,
      communities,
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
      if (course.id !== currentCommunityId) {
        dispatch(setCurrentCommunityIdAction(course.id));
      }
    },
    [currentCommunityId, dispatch]
  );

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  useEffect(() => {
    if (oneTouchSendOpen) {
      dispatch(setCurrentCommunityIdAction(null));
    }
  }, [oneTouchSendOpen, dispatch]);

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
        {currentCommunityId && chatId ? <CommunityChat /> : <DirectChat />}
      </Box>
    </div>
  );
};

export default ChatPage;
