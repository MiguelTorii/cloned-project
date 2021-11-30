import { push } from 'connected-react-router';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { CampaignState } from '../../reducers/campaign';
import { CREATE_POST_PATHNAME, EDIT_POST_PATHNAME_PREFIX } from '../../routeConstants';
import {
  CHAT_MAIN_AREA,
  CHAT_AREA,
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
  SUPPORT_AREA,
  CREATE_A_POST_AREA,
  ASK_A_QUESTION_AREA,
  SHARE_RESOURCES_AREA,
  SHARE_NOTES_AREA
} from '../navigationState/hudNavigation';
import { setSelectedMainSubArea } from '../navigationState/hudNavigationActions';
import { HudNavigationState } from '../navigationState/hudNavigationState';

type TAreaIds = {
  mainArea: string;
  mainSubArea: string;
};

const landingPage: TAreaIds = {
  mainArea: COMMUNITIES_MAIN_AREA,
  mainSubArea: FEEDS_AREA
};

const pathnameToAreaIds: Record<string, TAreaIds> = {
  '/': landingPage,
  '/home': landingPage,

  // COMMUNITIES_MAIN_AREA
  '/classes': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: CLASSES_AREA },
  '/feed': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/bookmarks': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/my_posts': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/post': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/edit/post': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/share': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  [CREATE_POST_PATHNAME]: { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  [EDIT_POST_PATHNAME_PREFIX]: { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/sharelink': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/create/sharelink': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/edit/sharelink': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/question': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/create/question': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/edit/question': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/create/notes': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },

  // CHAT_MAIN_AREA
  '/chat': { mainArea: CHAT_MAIN_AREA, mainSubArea: CHAT_AREA },

  // STUDY_TOOLS_MAIN_AREA
  '/notes': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: NOTES_AREA },
  '/workflow': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: CALENDAR_AREA },
  '/flashcards': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: FLASHCARDS_AREA },
  '/edit/flashcards': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: FLASHCARDS_AREA },
  '/study': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: STUDY_TIPS_AREA },

  // ACHIEVEMENTS_MAIN_AREA
  '/leaderboard': { mainArea: ACHIEVEMENTS_MAIN_AREA, mainSubArea: LEADERBOARD_AREA },

  // PROFILE_MAIN_AREA
  '/profile': { mainArea: PROFILE_MAIN_AREA, mainSubArea: ABOUT_ME_AREA },
  '/pointsHistory': { mainArea: PROFILE_MAIN_AREA, mainSubArea: POINTS_HISTORY_AREA },
  '/store': { mainArea: PROFILE_MAIN_AREA, mainSubArea: REWARDS_STORE_AREA },

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
  [CHAT_MAIN_AREA]: {
    [CHAT_AREA]: '/chat'
  },
  [COMMUNITIES_MAIN_AREA]: {
    [CLASSES_AREA]: '/classes',
    [FEEDS_AREA]: '/feed',
    [CREATE_A_POST_AREA]: '/create_post?tab=0',
    [ASK_A_QUESTION_AREA]: '/create_post?tab=1',
    [SHARE_NOTES_AREA]: '/create_post?tab=2',
    [SHARE_RESOURCES_AREA]: '/create_post?tab=3'
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
      const firstItemIndex = 1;
      const secondItemIndex = 2;
      const pathParts = pathname.split('/');
      const onePartPathSection = `/${pathParts[firstItemIndex] || ''}`;

      let areaIds: TAreaIds = pathnameToAreaIds[onePartPathSection];
      if (!areaIds) {
        const twoPartPathSection = `${onePartPathSection}/${pathParts[secondItemIndex] || ''}`;
        areaIds = pathnameToAreaIds[twoPartPathSection];
      }

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
