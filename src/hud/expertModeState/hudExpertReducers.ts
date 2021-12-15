import { hudExpertActions } from './hudExpertActions';
import { defaultState, HudExpertState } from './hudExpertState';
import { Action } from '../../types/action';

export default (state: HudExpertState = defaultState, action: Action): HudExpertState => {
  switch (action.type) {
    case hudExpertActions.TOGGLE_EXPERT_MODE:
      return {
        isExpert: !state.isExpert
      };
    default:
      return state;
  }
};
