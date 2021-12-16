import { push } from 'connected-react-router';
import { Dispatch, useEffect } from 'react';
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
  NOTES_AREA,
  POINTS_HISTORY_AREA,
  PROFILE_MAIN_AREA,
  REWARDS_STORE_AREA,
  SCHOLARSHIPS_AREA,
  STUDY_TIPS_AREA,
  STUDY_TOOLS_MAIN_AREA,
  CREATE_A_POST_AREA,
  ASK_A_QUESTION_AREA,
  SHARE_RESOURCES_AREA,
  SHARE_NOTES_AREA
} from '../navigationState/hudNavigation';
import { setSelectedMainSubArea } from '../navigationState/hudNavigationActions';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import useHudEvents from '../events/useHudEvents';

type TAreaIds = {
  mainArea: string;
  mainSubArea: string;
};

export const landingPage: TAreaIds = {
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
  [EDIT_POST_PATHNAME_PREFIX]: { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/sharelink': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/edit/sharelink': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/question': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/edit/question': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },
  '/notes/': { mainArea: COMMUNITIES_MAIN_AREA, mainSubArea: FEEDS_AREA },

  // CHAT_MAIN_AREA
  '/chat': { mainArea: CHAT_MAIN_AREA, mainSubArea: CHAT_AREA },

  // STUDY_TOOLS_MAIN_AREA
  '/notes': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: NOTES_AREA },
  '/workflow': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: CALENDAR_AREA },
  '/flashcards': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: FLASHCARDS_AREA },
  '/edit/flashcards': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: FLASHCARDS_AREA },
  '/study': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: STUDY_TIPS_AREA },
  '/create/question': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: ASK_A_QUESTION_AREA },
  '/create/sharelink': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: SHARE_RESOURCES_AREA },
  '/create/notes': { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: SHARE_NOTES_AREA },
  [CREATE_POST_PATHNAME]: { mainArea: STUDY_TOOLS_MAIN_AREA, mainSubArea: CREATE_A_POST_AREA },

  // ACHIEVEMENTS_MAIN_AREA
  '/leaderboard': { mainArea: ACHIEVEMENTS_MAIN_AREA, mainSubArea: LEADERBOARD_AREA },

  // PROFILE_MAIN_AREA
  '/profile': { mainArea: PROFILE_MAIN_AREA, mainSubArea: ABOUT_ME_AREA },
  '/pointsHistory': { mainArea: PROFILE_MAIN_AREA, mainSubArea: POINTS_HISTORY_AREA },
  '/store': { mainArea: PROFILE_MAIN_AREA, mainSubArea: REWARDS_STORE_AREA },
  '/feedback': { mainArea: PROFILE_MAIN_AREA, mainSubArea: GIVE_FEEDBACK_AREA },
  '/getTheMobileApp': { mainArea: PROFILE_MAIN_AREA, mainSubArea: GET_THE_MOBILE_APP_AREA }
};

const areasToUrl: Record<string, Record<string, string>> = {
  [PROFILE_MAIN_AREA]: {
    [ABOUT_ME_AREA]: '/profile',
    [POINTS_HISTORY_AREA]: '/pointsHistory',
    [REWARDS_STORE_AREA]: '/store',
    [GIVE_FEEDBACK_AREA]: '/feedback',
    [GET_THE_MOBILE_APP_AREA]: '/getTheMobileApp'
  },
  [CHAT_MAIN_AREA]: {
    [CHAT_AREA]: '/chat'
  },
  [COMMUNITIES_MAIN_AREA]: {
    [CLASSES_AREA]: '/classes',
    [FEEDS_AREA]: '/feed'
  },
  [STUDY_TOOLS_MAIN_AREA]: {
    [NOTES_AREA]: '/notes',
    [FLASHCARDS_AREA]: '/flashcards',
    [CALENDAR_AREA]: '/workflow',
    [CREATE_A_POST_AREA]: '/create_post',
    [ASK_A_QUESTION_AREA]: '/create/question',
    [SHARE_NOTES_AREA]: '/create/notes',
    [SHARE_RESOURCES_AREA]: '/create/sharelink'
  },
  [ACHIEVEMENTS_MAIN_AREA]: {
    [GOALS_AREA]: '/goals',
    [BADGES_AREA]: '/badges',
    [LEADERBOARD_AREA]: '/leaderboard',
    [SCHOLARSHIPS_AREA]: '/scholarships'
  }
};

/**
 * Updates the selected HUD area based on the current route.
 */
const useHudRoutes = () => {
  const pathname: string = useSelector((state: any) => state.router.location.pathname);
  const query = useSelector((state: any) => state.router.location.query);

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
      const notesWithNotesIdPathnameLength = 3;
      const pathParts = pathname.split('/');
      let onePartPathSection = `/${pathParts[firstItemIndex] || ''}`;

      // Hack to fixup URL for create post links
      if (onePartPathSection === '/create_post') {
        const { tab } = query;
        if (tab === '1') {
          onePartPathSection = '/create/question';
        } else if (tab === '2') {
          onePartPathSection = '/create/notes';
        } else if (tab === '3') {
          onePartPathSection = '/create/sharelink';
        }
      } else if (
        onePartPathSection === '/notes' &&
        pathParts.length === notesWithNotesIdPathnameLength
      ) {
        onePartPathSection = '/notes/';
      }

      let areaIds: TAreaIds = pathnameToAreaIds[onePartPathSection];
      if (!areaIds) {
        const twoPartPathSection = `${onePartPathSection}/${pathParts[secondItemIndex] || ''}`;
        areaIds = pathnameToAreaIds[twoPartPathSection];
      }

      if (areaIds) {
        dispatch(setSelectedMainSubArea(areaIds.mainArea, areaIds.mainSubArea));
      }
    }
  }, [pathname, isHud, query]);

  const setHudArea = (mainArea: string, mainSubArea?: string) => {
    const url = areasToUrl[mainArea][mainSubArea || selectedMainSubAreas[mainArea]];
    if (url) {
      dispatch(push(url));
    }
  };

  return setHudArea;
};

export default useHudRoutes;
