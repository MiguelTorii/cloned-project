import { push } from 'connected-react-router';
import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { CampaignState } from '../../reducers/campaign';
import {
  ABOUT_ME_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  BADGES_AREA,
  CALENDAR_AREA,
  CLASSES_AREA,
  COMMUNITIES_MAIN_AREA,
  FEEDS_AREA,
  FLASHCARDS_AREA,
  GET_THE_MOBILE_APP_AREA,
  GIVE_FEEDBACK_AREA,
  GOALS_AREA,
  LEADERBOARD_AREA,
  MORE_MAIN_AREA,
  NOTES_AREA,
  POINTS_HISTORY_AREA,
  PROFILE_MAIN_AREA,
  REWARDS_STORE_AREA,
  SCHOLARSHIPS_AREA,
  STUDY_TIPS_AREA,
  STUDY_TOOLS_MAIN_AREA,
  SUPPORT_AREA
} from '../navigationState/hudNavigation';
import { setSelectedMainSubArea } from '../navigationState/hudNavigationActions';
import { HudNavigationState } from '../navigationState/hudNavigationState';

type TAreaIds = {
  mainArea: string;
  mainSubArea: string;
};

const landingPage: TAreaIds = {
  mainArea: STUDY_TOOLS_MAIN_AREA,
  mainSubArea: NOTES_AREA
};

const pathnameToAreaIs: Record<string, TAreaIds> = {
  '/': landingPage,
  '/home': landingPage,

  // PROFILE_MAIN_AREA
  '/profile': { mainArea: PROFILE_MAIN_AREA, mainSubArea: ABOUT_ME_AREA },
  '/pointsHistory': { mainArea: PROFILE_MAIN_AREA, mainSubArea: POINTS_HISTORY_AREA },
  '/store': { mainArea: PROFILE_MAIN_AREA, mainSubArea: REWARDS_STORE_AREA },

  // COMMUNITIES_MAIN_AREA
  '/classes': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: CLASSES_AREA },
  '/feed': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },

  // STUDY_TOOLS_MAIN_AREA
  '/notes': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: NOTES_AREA },
  '/workflow': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: CALENDAR_AREA },
  '/flashcards': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: FLASHCARDS_AREA },
  '/study': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: STUDY_TIPS_AREA },

  // ACHIEVEMENTS_MAIN_AREA
  '/goals': { mainArea: ACHIEVEMENTS_MAIN_AREA, mainSubArea: LEADERBOARD_AREA },
  '/badges': { mainArea: ACHIEVEMENTS_MAIN_AREA, mainSubArea: LEADERBOARD_AREA },
  '/leaderboard': { mainArea: ACHIEVEMENTS_MAIN_AREA, mainSubArea: LEADERBOARD_AREA },
  '/scholarships': { mainArea: ACHIEVEMENTS_MAIN_AREA, mainSubArea: SCHOLARSHIPS_AREA },

  // MORE_MAIN_AREA
  '/support': { mainArea: MORE_MAIN_AREA, mainSubArea: SUPPORT_AREA },
  '/feedback': { mainArea: MORE_MAIN_AREA, mainSubArea: GIVE_FEEDBACK_AREA },
  '/getTheMobileApp': { mainArea: MORE_MAIN_AREA, mainSubArea: GET_THE_MOBILE_APP_AREA }
};

const areasToUrl: Record<string, Record<string, string>> = {
  [PROFILE_MAIN_AREA]: {
    [ABOUT_ME_AREA]: '/profile',
    [POINTS_HISTORY_AREA]: '/pointsHistory',
    [REWARDS_STORE_AREA]: '/store'
  },
  [COMMUNITIES_MAIN_AREA]: {
    [CLASSES_AREA]: '/classes',
    [FEEDS_AREA]: '/feed'
  },
  [STUDY_TOOLS_MAIN_AREA]: {
    [NOTES_AREA]: '/notes',
    [FLASHCARDS_AREA]: '/flashcards',
    [CALENDAR_AREA]: '/workflow',
    [STUDY_TIPS_AREA]: '/study'
  },
  [ACHIEVEMENTS_MAIN_AREA]: {
    [GOALS_AREA]: '/goals',
    [BADGES_AREA]: '/badges',
    [LEADERBOARD_AREA]: '/leaderboard',
    [SCHOLARSHIPS_AREA]: '/scholarships'
  },
  [MORE_MAIN_AREA]: {
    [SUPPORT_AREA]: '/support',
    [GIVE_FEEDBACK_AREA]: '/feedback',
    [GET_THE_MOBILE_APP_AREA]: '/getTheMobileApp'
  }
};

/**
 * Updates the selected HUD area based on the current route.
 */
const useHudRoutes = () => {
  const pathname: string = useSelector((state: any) => state.router.location.pathname);

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedMainSubAreas = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainSubAreas
  );

  useEffect(() => {
    if (isHud && pathname) {
      // Find the root part of the pathname, for example:
      // if the pathname is `/notes/:noteId`,
      // then find just the `/notes` part.
      const itemLimit = 2;
      const itemIndex = 1;
      const rootPathName = `/${pathname.split('/', itemLimit)[itemIndex] || ''}`;

      const areaIds: TAreaIds = pathnameToAreaIs[rootPathName];
      if (areaIds) {
        dispatch(setSelectedMainSubArea(areaIds.mainArea, areaIds.mainSubArea));
      }
    }
  }, [pathname, isHud]);

  const setHudArea = (mainArea: string, mainSubArea?: string) => {
    const url = areasToUrl[mainArea][mainSubArea || selectedMainSubAreas[mainArea]];
    if (url) {
      dispatch(push(url));
    }
  };

  return setHudArea;
};

export default useHudRoutes;
