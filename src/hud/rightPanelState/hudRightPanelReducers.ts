import { rightPanelActions } from './hudRightPanelActions';
import { defaultState } from './hudRightPanelState';

import type { HudRightPanelState } from './hudRightPanelState';
import type { Action } from 'types/action';

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
