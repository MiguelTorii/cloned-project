import {
  setCurrentChannelSidAction,
  setCurrentCommunityChannel,
  setCurrentCommunityChannelIdAction,
  setCurrentCommunityIdAction
} from 'actions/chat';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
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

  const { selectedChannelId, currentCommunityId, currentCommunityChannelId } = useAppSelector(
    (state) => state.chat.data
  );

  const orderedDMChannelList = useOrderedChannelList();
  const { data: channels } = useChannels();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasMounted) return;

    if (!selectedChannelId || !chatId) {
      // By default, choose DMs
      if (currentCommunityId) {
        dispatch(setCurrentCommunityIdAction(0));
        dispatch(setCurrentCommunityChannelIdAction(null));
      }
      if (!orderedDMChannelList?.length) return;
      // Wait for channels to load to select the first one
      dispatch(setCurrentChannelSidAction(orderedDMChannelList[0]));
      setHasMounted(true);
      return;
    }

    if (!channels?.length) return;

    const channel = channels?.find((channel) => channel.sid === chatId);
    const communityId = channel?.attributes.community_id;

    if (!communityId) {
      if (chatId !== selectedChannelId) {
        dispatch(setCurrentChannelSidAction(chatId));
      }
    } else if (communityId !== String(currentCommunityId)) {
      // If a chat id of a community channel is passed, change to communities
      dispatch(setCurrentCommunityIdAction(Number(communityId)));
      dispatch(setCurrentCommunityChannel(channel));
    } else if (currentCommunityChannelId !== chatId) {
      dispatch(setCurrentCommunityChannelIdAction(chatId));
    }

    setHasMounted(true);
  }, [
    channels,
    chatId,
    currentCommunityChannelId,
    currentCommunityId,
    dispatch,
    hasMounted,
    orderedDMChannelList,
    selectedChannelId
  ]);
};
