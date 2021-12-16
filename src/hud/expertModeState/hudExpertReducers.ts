import { hudExpertActions } from './hudExpertActions';
import { defaultState, HudExpertState } from './hudExpertState';
import { Action } from '../../types/action';

export default (state: HudExpertState = defaultState, action: Action): HudExpertState => {
  switch (action.type) {
    case hudExpertActions.TOGGLE_EXPERT_MODE:
      return {
        isExpert: !state.isExpert
      };
    case hudExpertActions.INITIAL_EXPERT_MODE:
      return {
        isExpert: action.payload.isExpert
      };
    default:
      return state;
  }
};
