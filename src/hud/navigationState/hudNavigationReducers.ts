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

    case hudNavigationActions.HIDE_SIDE_AREA:
      return {
        ...state,
        sideAreaToIsVisible: {
          ...state.sideAreaToIsVisible,
          [action.payload.sideArea]: false
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

    case hudNavigationActions.SET_STUDY_TOOLS_OPTION:
      return {
        ...state,
        studyToolsOption: action.payload.studyToolsOption
      };

    case hudNavigationActions.SET_NAVIGATION_HIGHLIGHT:
      return {
        ...state,
        highlightedNavigation: {
          rootAreaId: action.payload.rootAreaId,
          leafAreaId: action.payload.leafAreaId
        }
      };

    case hudNavigationActions.CLEAR_NAVIGATION_HIGHLIGHT:
      return {
        ...state,
        highlightedNavigation: null
      };

    default:
      return state;
  }
};
