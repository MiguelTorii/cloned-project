import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  setCurrentChannelSidAction,
  setCurrentCommunityChannel,
  setCurrentCommunityChannelIdAction,
  setCurrentCommunityIdAction
} from 'actions/chat';
import { selectCommunitiesWithChannels } from 'reducers/chat';
import { useAppDispatch, useAppSelector } from 'redux/store';

import { useOrderedChannelList, useChannels } from './useChannels';

/**
 * Only used on first mount to change default state of selected channels
 * which based on localStorage
 * to a new channel if the chatId param is different from the current value in storage
 *
 * TODO Replace with approach that handle communities properly:
 * chat/communityId/channelid
 * chat/channelid
 */
export const useSelectChatByIdURL = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { chatId } = useParams();

  const {
    communitiesLoaded,
    data: { selectedChannelId, currentCommunityId, currentCommunityChannelId }
  } = useAppSelector((state) => state.chat);

  const orderedDMChannelList = useOrderedChannelList();
  const communitiesWithChannels = useAppSelector(selectCommunitiesWithChannels);
  const { data: channels } = useChannels();

  const dispatch = useAppDispatch();

  /**
   * As clicking on the chat in the menu redirects directly to a community chat or a DM
   * this only happens when using setCurrentChannelSidAction to go to DMs
   * Such as when clicking DMs button
   * As ordered DM channel list is not easily available in all situations
   * when setCurrentChannelSidAction is called
   * Instead here we handle a scenario in which user selects to go to DMs but has no selectedChannelId
   */
  useEffect(() => {
    if (
      chatId ||
      currentCommunityId ||
      selectedChannelId ||
      !hasMounted ||
      !orderedDMChannelList?.length
    ) {
      return;
    }

    dispatch(setCurrentChannelSidAction(orderedDMChannelList[0]));
  }, [chatId, currentCommunityId, dispatch, hasMounted, orderedDMChannelList, selectedChannelId]);

  // Ran only on app startup based on chatId param
  // Select communities by default, otherwise find a DM
  useEffect(() => {
    if (!communitiesLoaded || !channels?.length || hasMounted) return;

    if (!chatId) {
      if (communitiesWithChannels?.length) {
        const channel = channels.find(
          (c) => c.sid === communitiesWithChannels[0].channels[0].channels[0].chat_id
        );
        dispatch(setCurrentCommunityIdAction(communitiesWithChannels[0].courseId));
        if (channel) {
          dispatch(setCurrentCommunityChannel(channel));
        }
      } else if (orderedDMChannelList?.length) {
        dispatch(setCurrentChannelSidAction(orderedDMChannelList[0]));
        dispatch(setCurrentCommunityIdAction(0));
      }
      setHasMounted(true);
      return;
    }

    const channel = channels?.find((channel) => channel.sid === chatId);
    const communityId = channel?.attributes.community_id;

    if (!communityId && chatId !== selectedChannelId) {
      // Select a DM through URL
      dispatch(setCurrentChannelSidAction(chatId));
    } else if (communityId !== String(currentCommunityId)) {
      // Change to different community based on chat id of  community channel
      dispatch(setCurrentCommunityIdAction(Number(communityId)));
      dispatch(setCurrentCommunityChannel(channel));
    } else if (currentCommunityChannelId !== chatId) {
      // Select different channel in the same community
      dispatch(setCurrentCommunityChannelIdAction(chatId));
    }

    setHasMounted(true);
  }, [
    channels,
    chatId,
    communitiesLoaded,
    communitiesWithChannels,
    currentCommunityChannelId,
    currentCommunityId,
    dispatch,
    hasMounted,
    orderedDMChannelList,
    selectedChannelId
  ]);
};
