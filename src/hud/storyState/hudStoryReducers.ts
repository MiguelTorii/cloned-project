import type { Action } from '../../types/action';
import { hudStoryActions } from './hudStoryActions';
import { defaultState, HudStoryState } from './hudStoryState';

export default (state: HudStoryState = defaultState, action: Action): HudStoryState => {
  switch (action.type) {
    case hudStoryActions.SET_CONVERSATION:
      return {
        ...state,
        conversation: action.payload.conversation
      };
    case hudStoryActions.INITIAL_STORY_LOAD:
      return {
        ...state,
        initialLoadTriggered: true
      };
    case hudStoryActions.RESTART_INITIAL_STORY_LOAD:
      return {
        ...state,
        initialLoadTriggered: false
      };
    default:
      return state;
  }
};
