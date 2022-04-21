import type { IBuiltChannels, IBuiltCommunities } from './chatDataBuilder';
import type { Client } from '@twilio/conversations';
import type { Action } from 'types/action';

export const hudChatActions = {
  START_CHAT_LOAD: 'START_CHAT_LOAD',
  INIT_CHAT_SOCKET: 'INIT_CHAT_SOCKET',
  SELECT_COMMUNITY_ID: 'SELECT_COMMUNITY_ID',
  SET_COMMUNITIES_AND_CHANNELS: 'SET_COMMUNITIES_AND_CHANNELS',
  START_CHANNEL_DATA_LOAD: 'START_CHANNEL_DATA_LOAD',
  SELECT_CHANNEL_ID: 'SELECT_CHANNEL_ID'
};

export const startChatLoad = (): Action => ({
  type: hudChatActions.START_CHAT_LOAD,
  payload: {}
});

export const initChatSocket = (socketClient: Client): Action => ({
  type: hudChatActions.INIT_CHAT_SOCKET,
  payload: {
    socketClient
  }
});

export const setCommunitiesAndChannels = (
  builtCommunities: IBuiltCommunities,
  builtChannels: IBuiltChannels,
  selectedCommunityId: string
): Action => ({
  type: hudChatActions.SET_COMMUNITIES_AND_CHANNELS,
  payload: {
    builtCommunities,
    builtChannels,
    selectedCommunityId
  }
});

export const selectCommunityId = (communityId: string): Action => ({
  type: hudChatActions.SELECT_COMMUNITY_ID,
  payload: {
    communityId
  }
});

// TODO use me
export const startChannelLoad = (channelId: string): Action => ({
  type: hudChatActions.START_CHANNEL_DATA_LOAD,
  payload: {
    channelId: channelId
  }
});

// TODO use me
export const selectChannelId = (channelId: string): Action => ({
  type: hudChatActions.SELECT_CHANNEL_ID,
  payload: {
    channelId
  }
});
