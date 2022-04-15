import { useEffect, useMemo } from 'react';

import { push } from 'connected-react-router';
import { useQueryClient } from 'react-query';
import { useLocation, useParams } from 'react-router';

import { URL } from 'constants/navigation';
import { generateChatPath } from 'utils/chat';

import {
  navigateToDM,
  setCurrentChannelSidAction,
  setCurrentCommunityChannelIdAction,
  setCurrentCommunityIdAction
} from 'actions/chat';
import { enqueueSnackbar } from 'actions/notifications';
import { getChatIdFromHash } from 'api/chat';
import { usePrevious } from 'hooks';
import { selectCommunitiesWithChannels } from 'reducers/chat';
import { useAppDispatch, useAppSelector } from 'redux/store';

import { QUERY_KEY_CHANNELS, useChannels, useOrderedChannelList } from './useChannels';
import { setChannelRead } from './useUnreadCount';

import type { Channel } from 'twilio-chat';

export const useChatParams = () => {
  const { hashId, chatId, communityId } =
    useParams<{ hashId?: string; chatId?: string; communityId?: string }>();

  return {
    hashId,
    chatId,
    communityId: communityId ? Number(communityId) : undefined
  };
};

export const useJoinChatByHash = () => {
  const { hashId } = useChatParams();
  const previousHashId = usePrevious(hashId);
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const validateChatId = async () => {
      if (!hashId) return;

      const chatId = await getChatIdFromHash(hashId);

      if (chatId) {
        dispatch(navigateToDM(chatId));
        queryClient.invalidateQueries([QUERY_KEY_CHANNELS]);
        const channels = queryClient.getQueryData<Channel[]>([QUERY_KEY_CHANNELS]);
        const channel = channels?.find((c) => c.sid === chatId);
        if (channel) {
          await setChannelRead(queryClient, channel);
        }
      } else {
        // invalid channel, redirect to homepage with notification
        enqueueSnackbar({
          notification: {
            message: 'Chat link is invalid!',
            options: {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 3000
            }
          }
        });
        dispatch(push('/'));
      }
    };

    validateChatId();
  }, [dispatch, hashId, previousHashId, queryClient]);
};

export const useSelectChatByIdURL = () => {
  const { pathname } = useLocation();

  /**
   * /chat/:communityId?/:chatId?`
   * communtiyId should match an existing community/class channel
   * 0 represents choosing direct messages
   * chatId should match an existing channel fetched from the SDK
   */
  const { communityId, chatId, hashId } = useChatParams();

  const {
    communitiesLoaded,
    data: { selectedChannelId, currentCommunityId, currentCommunityChannelId }
  } = useAppSelector((state) => state.chat);

  const orderedDMChannelList = useOrderedChannelList();
  const communitiesWithChannels = useAppSelector(selectCommunitiesWithChannels);
  const { data: channels } = useChannels();

  const dispatch = useAppDispatch();
  /**
   * React to navigating to /chat and redirect to any available channel
   * Communities first, then DMs,
   */
  useEffect(() => {
    if (
      !pathname.includes(URL.CHAT) ||
      hashId ||
      communityId !== undefined ||
      !communitiesLoaded ||
      !channels?.length
    ) {
      return;
    }

    // redirect to first class channel, if available
    if (communitiesWithChannels?.length) {
      const communityId = communitiesWithChannels[0].courseId;
      dispatch(push(generateChatPath(communityId, chatId)));
    } else if (orderedDMChannelList?.length) {
      // Select first DM channel or redirect to stored DM channel
      dispatch(navigateToDM(selectedChannelId || orderedDMChannelList[0]));
    }
  }, [
    channels?.length,
    chatId,
    communitiesLoaded,
    communitiesWithChannels,
    communityId,
    dispatch,
    hashId,
    orderedDMChannelList,
    pathname,
    selectedChannelId
  ]);

  const validCommunity = useMemo(
    () => communitiesWithChannels?.find(({ courseId }) => courseId === communityId),
    [communitiesWithChannels, communityId]
  );

  const allCommunityChannelIds = useMemo(
    () => validCommunity?.channels.map((channel) => channel.channels.map((c) => c.chat_id)).flat(),
    [validCommunity?.channels]
  );

  // React to community state changes or incorrect URL params
  useEffect(() => {
    if (
      !pathname.includes(URL.CHAT) ||
      hashId ||
      communityId === undefined ||
      !communitiesLoaded ||
      communityId === Number(currentCommunityId)
    ) {
      return;
    }

    if (validCommunity) {
      dispatch(setCurrentCommunityIdAction(communityId));

      if (chatId && allCommunityChannelIds?.includes(chatId)) return;
      // If community exists but channel is wrong, redirect to first channel
      const firstChannelId = validCommunity.channels[0].channels[0].chat_id;
      dispatch(push(generateChatPath(communityId, firstChannelId)));
    } else if (communityId !== 0 && communitiesWithChannels?.length) {
      // If communtiy is not found but communites exist, redirect to first community
      const communityId = communitiesWithChannels[0].courseId;
      const channelId = communitiesWithChannels[0].channels[0].channels[0].chat_id;
      dispatch(push(generateChatPath(communityId, channelId)));
    } else {
      // Redirect to DMs
      dispatch(setCurrentCommunityIdAction(0));
      if (!chatId || !orderedDMChannelList.includes(chatId)) {
        dispatch(navigateToDM(orderedDMChannelList[0]));
      }
    }
  }, [
    allCommunityChannelIds,
    chatId,
    communitiesLoaded,
    communitiesWithChannels,
    communityId,
    currentCommunityId,
    dispatch,
    hashId,
    orderedDMChannelList,
    pathname,
    validCommunity
  ]);

  // Change selected DM state in response to params
  useEffect(() => {
    if (!channels || communityId !== 0 || !communitiesLoaded || selectedChannelId === chatId) {
      return;
    }
    const validDM = chatId && orderedDMChannelList.includes(chatId);
    if (!validDM && orderedDMChannelList.length) {
      // Select first DM
      dispatch(navigateToDM(orderedDMChannelList[0]));
      dispatch(setCurrentChannelSidAction(orderedDMChannelList[0]));
    } else {
      dispatch(setCurrentChannelSidAction(chatId || null));
    }
  }, [
    channels,
    chatId,
    communitiesLoaded,
    communityId,
    dispatch,
    orderedDMChannelList,
    selectedChannelId
  ]);

  // Change selected community state in response to params
  useEffect(() => {
    if (
      !channels ||
      communityId === 0 ||
      !chatId ||
      !communitiesLoaded ||
      currentCommunityChannelId === chatId
    ) {
      return;
    }
    dispatch(setCurrentCommunityChannelIdAction(chatId));
  }, [channels, chatId, communitiesLoaded, communityId, currentCommunityChannelId, dispatch]);
};
