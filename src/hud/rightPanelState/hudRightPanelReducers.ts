import { defaultState, HudRightPanelState } from './hudRightPanelState';
import { Action } from '../../types/action';
import { rightPanelActions } from './hudRightPanelActions';

export default (state: HudRightPanelState = defaultState, action: Action): HudRightPanelState => {
  switch (action.type) {
    case rightPanelActions.SET_MISSIONS:
      return {
        ...state,
        missions: action.payload.missions
      };
    default:
      return state;
  }
};
