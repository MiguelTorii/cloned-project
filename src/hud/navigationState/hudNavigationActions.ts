import { Action } from '../../types/action';

export const hudNavigationActions = {
  TOGGLE_SIDE_AREA_VISIBILITY: 'TOGGLE_SIDE_AREA_VISIBILITY',
  HIDE_SIDE_AREA: 'HIDE_SIDE_AREA',
  SET_SELECTED_MAIN_AREA: 'SET_SELECTED_MAIN_AREA',
  SET_SELECTED_MAIN_SUBAREA: 'SET_SELECTED_MAIN_SUBAREA',
  SET_STUDY_TOOLS_OPTION: 'SET_STUDY_TOOLS_OPTION',
  SET_NAVIGATION_HIGHLIGHT: 'SET_NAVIGATION_HIGHLIGHT',
  CLEAR_NAVIGATION_HIGHLIGHT: 'CLEAR_NAVIGATION_HIGHLIGHT'
};

export const toggleSideAreaVisibility = (sideArea: string): Action => ({
  type: hudNavigationActions.TOGGLE_SIDE_AREA_VISIBILITY,
  payload: {
    sideArea
  }
});

export const hideSideArea = (sideArea: string): Action => ({
  type: hudNavigationActions.HIDE_SIDE_AREA,
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
 *
 * Another option is to set the URL directly (useHudRoutes hook will detect
 * the URL change and update the selected area and subarea accordingly).
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

export const setNavigationHighlight = (rootAreaId: string, leafAreaId: string): Action => ({
  type: hudNavigationActions.SET_NAVIGATION_HIGHLIGHT,
  payload: {
    rootAreaId,
    leafAreaId
  }
});

export const clearNavigationHighlight = (): Action => ({
  type: hudNavigationActions.CLEAR_NAVIGATION_HIGHLIGHT,
  payload: {}
});
