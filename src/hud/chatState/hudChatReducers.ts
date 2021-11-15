import type { Action } from '../../types/action';
import { hudChatActions } from './hudChatActions';
import { defaultState, HudChatState } from './hudChatState';

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
        idToChannel: action.payload.builtChannels.idToChannel
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
