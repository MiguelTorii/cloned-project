import { push } from 'connected-react-router';
import { useEffect } from 'react';
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

export const useChatParams = () =>
  useParams<{ hashId?: string; chatId?: string; communityId?: string }>();

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
  const { communityId, chatId, hashId } = useChatParams();

  const {
    communitiesLoaded,
    data: { selectedChannelId, currentCommunityId, currentCommunityChannelId }
  } = useAppSelector((state) => state.chat);

  const orderedDMChannelList = useOrderedChannelList();
  const communitiesWithChannels = useAppSelector(selectCommunitiesWithChannels);
  const { data: channels } = useChannels();

  const dispatch = useAppDispatch();

  // When navigating to /chat,
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
      dispatch(push(generateChatPath(0, selectedChannelId || orderedDMChannelList[0])));
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

  // Set community state based on param
  useEffect(() => {
    if (
      !pathname.includes(URL.CHAT) ||
      hashId ||
      communityId === undefined ||
      !communitiesLoaded ||
      Number(communityId) === Number(currentCommunityId)
    ) {
      return;
    }

    const validCommunity = communitiesWithChannels?.find(
      ({ courseId }) => courseId === Number(communityId)
    );
    if (validCommunity) {
      dispatch(setCurrentCommunityIdAction(Number(communityId)));

      if (chatId) return;

      const channelId = validCommunity.channels[0].channels[0].chat_id;
      dispatch(push(generateChatPath(communityId, channelId)));
    } else if (Number(communityId) !== 0 && communitiesWithChannels?.length) {
      // Like with /chat, redirect to first community
      const communityId = communitiesWithChannels[0].courseId;
      const channelId = communitiesWithChannels[0].channels[0].channels[0].chat_id;
      dispatch(push(generateChatPath(communityId, channelId[0])));
    } else {
      // Redirect to DMs
      dispatch(setCurrentCommunityIdAction(0));
      if (!chatId) {
        dispatch(push(generateChatPath(0, orderedDMChannelList[0])));
      }
    }
  }, [
    chatId,
    communitiesLoaded,
    communitiesWithChannels,
    communityId,
    currentCommunityId,
    dispatch,
    hashId,
    orderedDMChannelList,
    pathname
  ]);

  // Selected DM channel based on param
  useEffect(() => {
    if (Number(communityId) !== 0 || !communitiesLoaded || selectedChannelId === chatId) return;
    dispatch(setCurrentChannelSidAction(chatId || orderedDMChannelList[0] || null));
  }, [chatId, communitiesLoaded, communityId, dispatch, orderedDMChannelList, selectedChannelId]);

  // Select Community channel based on param
  useEffect(() => {
    if (
      Number(communityId) === 0 ||
      !chatId ||
      !communitiesLoaded ||
      currentCommunityChannelId === chatId
    ) {
      return;
    }
    dispatch(setCurrentCommunityChannelIdAction(chatId));
  }, [chatId, communitiesLoaded, communityId, currentCommunityChannelId, dispatch]);
};
