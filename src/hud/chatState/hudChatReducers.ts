import { hudChatActions } from './hudChatActions';
import { defaultState } from './hudChatState';

import type { HudChatState } from './hudChatState';
import type { Action } from 'types/action';

export default (state: HudChatState = defaultState, action: Action): HudChatState => {
  switch (action.type) {
    case hudChatActions.START_CHAT_LOAD:
      return {
        ...state,
        initialLoadTriggered: true
      };

    case hudChatActions.SET_COMMUNITIES_AND_CHANNELS:
      return {
        ...state,
        idToCommunity: action.payload.builtCommunities.idToCommunity,
        communityIdsInDisplayOrder: action.payload.builtCommunities.communityIdsInDisplayOrder,
        idToChannel: action.payload.builtChannels.idToChannel,
        selectedCommunityId: action.payload.selectedCommunityId
      };

    case hudChatActions.SELECT_COMMUNITY_ID:
      return {
        ...state,
        selectedCommunityId: action.payload.communityId
      };

    case hudChatActions.START_CHANNEL_DATA_LOAD:
      return {
        ...state,
        idToChannel: {
          ...state.idToChannel,
          [action.payload.channelId]: {
            ...state.idToChannel[action.payload.channelId],
            isLoading: true
          }
        }
      };

    case hudChatActions.SELECT_CHANNEL_ID:
      return {
        ...state,
        selectedChannelId: action.payload.channelId
      };

    default:
      return state;
  }
};
