import type { Action } from '../../types/action';
import { hudNavigationActions } from './hudNavigationActions';
import { defaultState, HudNavigationState } from './hudNavigationState';

export default (state: HudNavigationState = defaultState, action: Action): HudNavigationState => {
  switch (action.type) {
    case hudNavigationActions.TOGGLE_SIDE_AREA_VISIBILITY:
      return {
        ...state,
        sideAreaToIsVisible: {
          ...state.sideAreaToIsVisible,
          [action.payload.sideArea]: !state.sideAreaToIsVisible[action.payload.sideArea]
        }
      };

    case hudNavigationActions.SET_SELECTED_MAIN_AREA:
      return {
        ...state,
        selectedMainArea: action.payload.mainArea
      };

    case hudNavigationActions.SET_SELECTED_MAIN_SUBAREA:
      return {
        ...state,
        selectedMainArea: action.payload.mainArea,
        selectedMainSubAreas: {
          ...state.selectedMainSubAreas,
          [action.payload.mainArea]: action.payload.mainSubArea
        }
      };

    default:
      return state;
  }
};
