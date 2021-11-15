import { Action } from '../../types/action';

export const hudNavigationActions = {
  TOGGLE_SIDE_AREA_VISIBILITY: 'TOGGLE_SIDE_AREA_VISIBILITY',
  SET_SELECTED_MAIN_AREA: 'SET_SELECTED_MAIN_AREA',
  SET_SELECTED_MAIN_SUBAREA: 'SET_SELECTED_MAIN_SUBAREA'
};

export const toggleSideAreaVisibility = (sideArea: string): Action => ({
  type: hudNavigationActions.TOGGLE_SIDE_AREA_VISIBILITY,
  payload: {
    sideArea
  }
});

export const setSelectedMainArea = (mainArea: string): Action => ({
  type: hudNavigationActions.SET_SELECTED_MAIN_AREA,
  payload: {
    mainArea
  }
});

export const setSelectedMainSubArea = (mainArea: string, mainSubArea: string): Action => ({
  type: hudNavigationActions.SET_SELECTED_MAIN_SUBAREA,
  payload: {
    mainArea,
    mainSubArea
  }
});
