import { useDispatch, useSelector } from 'react-redux';

import { getChannelMetadata, renewTwilioToken } from 'api/chat';
import { getCommunities } from 'api/community';
import { getChannelsFromClient } from 'lib/chat/channels';
import { renewTokenAndGetClient } from 'lib/chat/client';

import { buildChannels, buildCommunities } from './chatDataBuilder';
import { setCommunitiesAndChannels, startChatLoad } from './hudChatActions';
import { fetchCommunityChannels, fetchCommunityMembers } from './hudChatRESTApi';

import type { IBuiltChannels, IBuiltCommunities } from './chatDataBuilder';
import type { HudChatState } from './hudChatState';
import type { Client } from '@twilio/conversations';
import type { APIChat } from 'api/models/APIChat';
import type { APICommunities } from 'api/models/APICommunities';
import type { APICommunityChannelGroups } from 'api/models/APICommunityChannelGroups';
import type { UserState } from 'reducers/user';
import type { Action, Dispatch } from 'redux';
import type { Channel, ClassmateGroup, User } from 'types/models';

export interface IChatLoadOptions {
  channelId: string;
}

export interface ChatSocketData {
  client: Client;
  channels: Channel[];
}

export interface CommunityChannelData {
  builtCommunities: IBuiltCommunities;
  builtChannels: IBuiltChannels;
}

const triggerLoadChat = async (dispatch: Dispatch<Action>, userId: string) => {
  dispatch(startChatLoad());

  const [communityChannelData, chatSocketData]: [CommunityChannelData, ChatSocketData] =
    await Promise.all([loadCommunities(userId), loadClientAndChannels(userId)]);

  const firstNonDirectChatCommunityId =
    communityChannelData.builtCommunities.communityIdsInDisplayOrder[1];

  dispatch(
    setCommunitiesAndChannels(
      communityChannelData.builtCommunities,
      communityChannelData.builtChannels,
      firstNonDirectChatCommunityId
    )
  );
};

const loadCommunities = async (userId: string): Promise<CommunityChannelData> => {
  const { communities }: APICommunities = await getCommunities();
  const builtCommunities: IBuiltCommunities = buildCommunities(communities);

  const [directChats, channelGroups, memberGroups]: [
    APIChat[],
    APICommunityChannelGroups[],
    ClassmateGroup[]
  ] = await Promise.all([
    getChannelMetadata(),
    fetchCommunityChannels(communities),
    fetchCommunityMembers(communities)
  ]);

  const builtChannels: IBuiltChannels = buildChannels(
    directChats,
    channelGroups,
    memberGroups,
    builtCommunities.idToCommunity
  );

  return {
    builtCommunities,
    builtChannels
  };
};

const loadClientAndChannels = async (userId: string): Promise<ChatSocketData> => {
  const client = await renewTokenAndGetClient(userId);
  const channels = await getChannelsFromClient(client);

  registerForClientEvents(client, userId);

  // TODO initialize and track unread counts

  return {
    client,
    channels
  };
};

const registerForClientEvents = (client: Client, userId: string) => {
  client.on('channelJoined', async (channel) => {
    // TODO update members -- how can we guarantee that the REST API
    // is up to date without using a timeout?
  });
  client.on('channelLeft', async (channel) => {
    // TODO remove channel
  });
  client.on('memberJoined', (member) => {
    // TODO update members -- how can we guarantee that the REST API
    // is up to date without using a timeout?
  });
  client.on('memberLeft', async (member) => {
    // TODO remove member
  });
  client.on('channelUpdated', async ({ channel }) => {
    // TODO update unread count
  });
  client.on('messageAdded', async (message) => {
    // TODO update unread count and channel last message
  });
  client.on('tokenAboutToExpire', async () => {
    try {
      const newToken = await renewTwilioToken(userId);

      if (!newToken || (newToken && newToken === '')) {
        return;
      }

      await client.updateToken(newToken);
    } catch (e) {
      // TODO add error handling
    }
  });
};

// TODO: Remove hook, doesn't seem used
const useChat = () => {
  const dispatch: Dispatch<Action> = useDispatch();

  const currentUser: User = useSelector((state: { user: UserState }) => state.user.data);

  const initialLoadTriggered: boolean = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.initialLoadTriggered
  );

  const loadChat = () => {
    if (!initialLoadTriggered) {
      triggerLoadChat(dispatch, currentUser.userId);
    }
  };

  return {
    loadChat
  };
};

export default useChat;
