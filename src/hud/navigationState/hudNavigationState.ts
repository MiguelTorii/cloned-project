import {
  ABOUT_ME_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  CLASSES_AREA,
  COMMUNITIES_MAIN_AREA,
  GOALS_AREA,
  MORE_MAIN_AREA,
  NOTES_AREA,
  PROFILE_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  SUPPORT_AREA,
  LEFT_SIDE_AREA,
  RIGHT_SIDE_AREA
} from './hudNavigation';

export type HudNavigationState = {
  sideAreaToIsVisible: Record<string, boolean>;
  selectedMainArea: string;
  selectedMainSubAreas: Record<string, string>;
};

export const defaultState: HudNavigationState = {
  sideAreaToIsVisible: {
    [LEFT_SIDE_AREA]: true,
    [RIGHT_SIDE_AREA]: true
  },
  selectedMainArea: PROFILE_MAIN_AREA,
  selectedMainSubAreas: {
    [PROFILE_MAIN_AREA]: ABOUT_ME_AREA,
    [COMMUNITIES_MAIN_AREA]: CLASSES_AREA,
    [STUDY_TOOLS_MAIN_AREA]: NOTES_AREA,
    [ACHIEVEMENTS_MAIN_AREA]: GOALS_AREA,
    [MORE_MAIN_AREA]: SUPPORT_AREA
  }
};
