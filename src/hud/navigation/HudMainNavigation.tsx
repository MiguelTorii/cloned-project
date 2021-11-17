import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-off.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard.svg';
import { ReactComponent as IconMore } from '../../assets/svg/more.svg';
import { ReactComponent as IconAboutMe } from '../../assets/svg/about_me.svg';
import { ReactComponent as IconPosts } from '../../assets/svg/posts.svg';
import { ReactComponent as IconBookmarkedPosts } from '../../assets/svg/bookmarked_posts.svg';
import { ReactComponent as IconPointsHistory } from '../../assets/svg/points_history.svg';
import { ReactComponent as IconMyClasses } from '../../assets/svg/classes_overview.svg';
import { ReactComponent as IconClassFeed } from '../../assets/svg/class_feed.svg';
import { ReactComponent as IconMyPosts } from '../../assets/svg/my_posts.svg';
import { ReactComponent as IconStudyTools } from '../../assets/svg/study_tools.svg';
import { ReactComponent as IconFlashcards } from '../../assets/svg/flashcards-menu.svg';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow.svg';
import { ReactComponent as IconStudyingOnCircleIn } from '../../assets/svg/studying_on_circlein.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/achievements.svg';
import { ReactComponent as IconStudyGoals } from '../../assets/svg/study_goals.svg';
import { ReactComponent as IconSubmitSupportTicket } from '../../assets/svg/submit_support_ticket.svg';
import { ReactComponent as IconSubmitAnIdea } from '../../assets/svg/submit_an_idea.svg';
import { ReactComponent as IconMobileApp } from '../../assets/svg/get_the_mobile_app.svg';
import { ReactComponent as IconRewardStore } from '../../assets/svg/rewards-icon-off.svg';
import { ReactComponent as IconUnblockClassMates } from '../../assets/svg/unblock_classmates.svg';

import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  ABOUT_ME_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  BADGES_AREA,
  BOOKMARKED_POSTS_AREA,
  CALENDAR_AREA,
  CLASSES_AREA,
  CLASSMATES_AREA,
  COMMUNITIES_MAIN_AREA,
  FEEDS_AREA,
  FLASHCARDS_AREA,
  GET_THE_MOBILE_APP_AREA,
  GIVE_FEEDBACK_AREA,
  GOALS_AREA,
  LEADERBOARD_AREA,
  mainSubAreasInOrder,
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
import { UserState } from '../../reducers/user';
import useHudRoutes from '../frame/useHudRoutes';

const ICON_SIZE = 30;

const HudMainNavigation = () => {
  // TODO add this to make the icons all the same size.
  // TODO set up a state to know which icon is selected
  const classes: any = useStyles();

  const profile: User = useSelector((state: { user: UserState }) => state.user.data);

  const setHudAreas = useHudRoutes();
  const areaToDisplayName: Record<string, { name: string; icon: ReactElement }> = {
    [PROFILE_MAIN_AREA]: {
      name: 'Profile',
      icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />
    },
    [ABOUT_ME_AREA]: { name: 'About Me', icon: <IconAboutMe /> },
    // todo add routes for both of these
    [REWARDS_STORE_AREA]: { name: 'Rewards Store', icon: <IconRewardStore /> },
    [POINTS_HISTORY_AREA]: { name: 'Points History', icon: <IconPointsHistory /> },

    [COMMUNITIES_MAIN_AREA]: { name: 'Classes', icon: <IconClasses /> },
    [CLASSES_AREA]: { name: 'My Classes', icon: <IconMyClasses /> },
    [FEEDS_AREA]: { name: 'Class Feeds', icon: <IconClassFeed /> },
    [BOOKMARKED_POSTS_AREA]: { name: 'Bookmarked Posts', icon: <IconBookmarkedPosts /> },
    [CLASSMATES_AREA]: { name: 'Classmates', icon: <IconPosts /> },

    [STUDY_TOOLS_MAIN_AREA]: { name: 'Study Tools', icon: <IconStudyTools /> },
    [FLASHCARDS_AREA]: { name: 'Flashcards', icon: <IconFlashcards /> },
    [NOTES_AREA]: { name: 'Notes', icon: <IconNotes /> },
    [CALENDAR_AREA]: { name: 'Workflow', icon: <IconWorkflow /> },
    [STUDY_TIPS_AREA]: { name: 'Studying on CircleIn', icon: <IconStudyingOnCircleIn /> },

    [ACHIEVEMENTS_MAIN_AREA]: { name: 'Achievements', icon: <IconAchievements /> },
    [GOALS_AREA]: { name: 'Study Goals', icon: <IconStudyGoals /> },
    [BADGES_AREA]: { name: 'Badges', icon: <IconPosts /> },
    [LEADERBOARD_AREA]: { name: 'Leaderboard', icon: <IconLeaderboard /> },
    [SCHOLARSHIPS_AREA]: { name: 'Scholarships', icon: <IconPosts /> },

    [MORE_MAIN_AREA]: { name: 'More...', icon: <IconMore /> },
    [SUPPORT_AREA]: { name: 'Support', icon: <IconSubmitSupportTicket /> },
    [GIVE_FEEDBACK_AREA]: { name: 'Give Feedback', icon: <IconSubmitAnIdea /> },
    [GET_THE_MOBILE_APP_AREA]: { name: 'Get the Mobile App', icon: <IconMobileApp /> }
  };

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );
  const selectRoot = (mainArea: string) => {
    setHudAreas(mainArea);
  };

  const selectLeaf = (mainSubArea: string) => {
    const validSubAreas = mainSubAreasInOrder[selectedMainArea];
    if (validSubAreas.includes(mainSubArea)) {
      setHudAreas(selectedMainArea, mainSubArea);
    }
  };

  const rootNavigationItems = [
    {
      id: PROFILE_MAIN_AREA,
      displayName: areaToDisplayName[PROFILE_MAIN_AREA].name,
      icon: areaToDisplayName[PROFILE_MAIN_AREA].icon
    },
    {
      id: COMMUNITIES_MAIN_AREA,
      displayName: areaToDisplayName[COMMUNITIES_MAIN_AREA].name,
      icon: areaToDisplayName[COMMUNITIES_MAIN_AREA].icon
    },
    {
      id: STUDY_TOOLS_MAIN_AREA,
      displayName: areaToDisplayName[STUDY_TOOLS_MAIN_AREA].name,
      icon: areaToDisplayName[STUDY_TOOLS_MAIN_AREA].icon
    },
    {
      id: ACHIEVEMENTS_MAIN_AREA,
      displayName: areaToDisplayName[ACHIEVEMENTS_MAIN_AREA].name,
      icon: areaToDisplayName[ACHIEVEMENTS_MAIN_AREA].icon
    },
    {
      id: MORE_MAIN_AREA,
      displayName: areaToDisplayName[MORE_MAIN_AREA].name,
      icon: areaToDisplayName[MORE_MAIN_AREA].icon
    }
  ];

  const leafNavigationItems = mainSubAreasInOrder[selectedMainArea].map((subArea: string) => ({
    id: subArea,
    displayName: areaToDisplayName[subArea].name,
    icon: areaToDisplayName[subArea].icon
  }));

  return (
    <>
      <HudToolbar onSelectItem={selectLeaf} navbarItems={leafNavigationItems} />
      <HudToolbar onSelectItem={selectRoot} navbarItems={rootNavigationItems} />
    </>
  );
};

export default HudMainNavigation;
