import React from 'react';
import { CalendarToday } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-on.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard-icon-on.svg';
import { ReactComponent as IconMore } from '../../assets/svg/more.svg';
import { ReactComponent as IconChatMembers } from '../../assets/svg/chat-studyroom-members.svg';
import { ReactComponent as IconBookmarkedPosts } from '../../assets/svg/bookmarked_posts.svg';
import { ReactComponent as IconMyClasses } from '../../assets/svg/classes_overview.svg';
import { ReactComponent as IconClassFeed } from '../../assets/svg/class_feed.svg';
import { ReactComponent as IconStudyTools } from '../../assets/svg/flashcards.svg';
import { ReactComponent as IconFlashcards } from '../../assets/svg/flashcards-menu.svg';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow.svg';
import { ReactComponent as IconStudyingOnCircleIn } from '../../assets/svg/studying_on_circlein.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/achievements.svg';
import { ReactComponent as IconSubmitSupportTicket } from '../../assets/svg/submit_support_ticket.svg';
import { ReactComponent as IconSubmitAnIdea } from '../../assets/svg/submit_an_idea.svg';
import { ReactComponent as IconMobileApp } from '../../assets/svg/get_the_mobile_app.svg';
import HudToolbar from './HudToolbar';

import { useStyles } from './HudNavigationStyles';
import {
  ABOUT_ME_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  BOOKMARKED_POSTS_AREA,
  CALENDAR_AREA,
  CLASSES_AREA,
  CLASSMATES_AREA,
  COMMUNITIES_MAIN_AREA,
  FEEDS_AREA,
  FLASHCARDS_AREA,
  GET_THE_MOBILE_APP_AREA,
  GIVE_FEEDBACK_AREA,
  LEADERBOARD_AREA,
  MORE_MAIN_AREA,
  NOTES_AREA,
  POINTS_HISTORY_AREA,
  PROFILE_MAIN_AREA,
  REWARDS_STORE_AREA,
  RIGHT_SIDE_AREA,
  STUDY_TIPS_AREA,
  STUDY_TOOLS_MAIN_AREA,
  SUPPORT_AREA
} from '../navigationState/hudNavigation';
import HudToolWithDropdown from './HudToolWithDropdown';
import { HudToolData } from './HudToolData';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';
import HudTool from './HudTool';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const HudMainNavigation = () => {
  // TODO add this to make the icons all the same size.
  const classes: any = useStyles();
  const dispatch: Dispatch<Action> = useDispatch();

  const missionsVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const classesNavigationItems: HudToolData[] = [
    {
      id: CLASSES_AREA,
      displayName: 'Classes',
      icon: <IconMyClasses />
    },
    {
      id: FEEDS_AREA,
      displayName: 'Class Feeds',
      icon: <IconClassFeed />
    },
    {
      id: BOOKMARKED_POSTS_AREA,
      displayName: 'Bookmarked Posts',
      icon: <IconBookmarkedPosts />
    },
    {
      id: CLASSMATES_AREA,
      displayName: 'Classmates',
      icon: <IconChatMembers />
    }
  ];

  const studyToolsNavigationItems: HudToolData[] = [
    {
      id: FLASHCARDS_AREA,
      displayName: 'Flashcards',
      icon: <IconFlashcards />
    },
    {
      id: NOTES_AREA,
      displayName: 'Notes',
      icon: <IconNotes />
    },
    {
      id: CALENDAR_AREA,
      displayName: 'Workflow',
      icon: <IconWorkflow />
    },
    {
      id: STUDY_TIPS_AREA,
      displayName: 'Study Tips',
      icon: <IconStudyingOnCircleIn />
    }
  ];

  const achievementsNavigationItems: HudToolData[] = [
    {
      id: LEADERBOARD_AREA,
      displayName: 'Leaderboard',
      icon: <IconAchievements />
    }
  ];

  const moreNavigationItems: HudToolData[] = [
    {
      id: SUPPORT_AREA,
      displayName: 'Support',
      icon: <IconSubmitSupportTicket />
    },
    {
      id: GIVE_FEEDBACK_AREA,
      displayName: 'Give Feedback',
      icon: <IconSubmitAnIdea />
    },
    {
      id: GET_THE_MOBILE_APP_AREA,
      displayName: 'Get the Mobile App',
      icon: <IconMobileApp />
    }
  ];

  const selectSideItem = (sideArea: string) => {
    dispatch(toggleSideAreaVisibility(RIGHT_SIDE_AREA));
  };

  const classesNavigationItem: HudToolData = {
    id: COMMUNITIES_MAIN_AREA,
    displayName: 'Classes',
    icon: <IconClasses />,
    childTools: classesNavigationItems
  };
  const studyToolsNavigationItem: HudToolData = {
    id: STUDY_TOOLS_MAIN_AREA,
    displayName: 'Study Tools',
    icon: <IconStudyTools />,
    childTools: studyToolsNavigationItems
  };
  const achievementsNavigationItem: HudToolData = {
    id: ACHIEVEMENTS_MAIN_AREA,
    displayName: 'Leaderboard',
    icon: <IconLeaderboard />,
    childTools: achievementsNavigationItems
  };
  const moreNavigationItem: HudToolData = {
    id: MORE_MAIN_AREA,
    displayName: 'More...',
    icon: <IconMore />,
    childTools: moreNavigationItems
  };

  const rootNavigationItems: HudToolData[] = [
    classesNavigationItem,
    studyToolsNavigationItem,
    achievementsNavigationItem
  ];

  const missionNavigationItem = {
    id: RIGHT_SIDE_AREA,
    displayName: 'Missions',
    icon: <CalendarToday />
  };

  return (
    <div className={classes.controlPanelMainSection}>
      {rootNavigationItems.map((rootNavigationItem) => (
        <HudToolWithDropdown
          parentNavigationItem={rootNavigationItem}
          key={rootNavigationItem.id}
        />
      ))}
      <HudTool
        onSelectItem={selectSideItem}
        navbarItem={missionNavigationItem}
        isSelected={missionsVisible}
      />
    </div>
  );
};

export default HudMainNavigation;
