import type { Action } from '../../types/action';
import { hudStoryActions } from './hudStoryActions';
import { defaultState, HudStoryState } from './hudStoryState';

export default (state: HudStoryState = defaultState, action: Action): HudStoryState => {
  switch (action.type) {
    case hudStoryActions.SET_CURRENT_STATEMENT:
      return {
        ...state,
        currentStatement: action.payload.currentStatement
      };
    case hudStoryActions.GREETING_LOAD_TRIGGERED:
      return {
        ...state,
        greetingLoadTriggered: true
      };
    case hudStoryActions.SET_GREETING:
      return {
        ...state,
        greetingStatements: action.payload.greetingStatements
      };
    default:
      return state;
  }
};
