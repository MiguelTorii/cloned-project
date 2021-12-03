import { Action } from '../../types/action';

export const hudNavigationActions = {
  TOGGLE_SIDE_AREA_VISIBILITY: 'TOGGLE_SIDE_AREA_VISIBILITY',
  SET_SELECTED_MAIN_AREA: 'SET_SELECTED_MAIN_AREA',
  SET_SELECTED_MAIN_SUBAREA: 'SET_SELECTED_MAIN_SUBAREA',
  SET_STUDY_TOOLS_OPTION: 'SET_STUDY_TOOLS_OPTION'
};

export const toggleSideAreaVisibility = (sideArea: string): Action => ({
  type: hudNavigationActions.TOGGLE_SIDE_AREA_VISIBILITY,
  payload: {
    sideArea
  }
});

/**
 * This should only be called by useHudRoutes hook.
 * If you are looking to change the main navigation of the hud,
 * use
 * `const setHudAreas = useHudRoutes(); setHudAreas(mainArea, mainSubArea);`
 * instead to ensure that the navigation and the routing stays in sync.
 */
export const setSelectedMainSubArea = (mainArea: string, mainSubArea: string): Action => ({
  type: hudNavigationActions.SET_SELECTED_MAIN_SUBAREA,
  payload: {
    mainArea,
    mainSubArea
  }
});

export const setStudyToolsOption = (studyToolsOption: string): Action => ({
  type: hudNavigationActions.SET_STUDY_TOOLS_OPTION,
  payload: {
    studyToolsOption
  }
});
