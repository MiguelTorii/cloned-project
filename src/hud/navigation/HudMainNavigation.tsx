import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-off.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard-icon-off.svg';
import { ReactComponent as IconMore } from '../../assets/svg/more.svg';
import { ReactComponent as IconAboutMe } from '../../assets/svg/about_me.svg';
import { ReactComponent as IconPosts } from '../../assets/svg/posts.svg';
import { ReactComponent as IconBookmarkedPosts } from '../../assets/svg/bookmarked_posts.svg';
import { ReactComponent as IconPointsHistory } from '../../assets/svg/points_history.svg';
import { ReactComponent as IconMyClasses } from '../../assets/svg/my_classes.svg';
import { ReactComponent as IconClassesOverview } from '../../assets/svg/classes_overview.svg';
import { ReactComponent as IconClassFeed } from '../../assets/svg/class_feed.svg';
import { ReactComponent as IconMyPosts } from '../../assets/svg/my_posts.svg';
import { ReactComponent as IconStudyTools } from '../../assets/svg/study_tools.svg';
import { ReactComponent as IconFlashcards } from '../../assets/svg/flashcards.svg';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow.svg';
import { ReactComponent as IconStudyingOnCircleIn } from '../../assets/svg/studying_on_circlein.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/achievements.svg';
import { ReactComponent as IconStudyGoals } from '../../assets/svg/study_goals.svg';
import { ReactComponent as IconSubmitSupportTicket } from '../../assets/svg/submit_support_ticket.svg';
import { ReactComponent as IconSubmitAnIdea } from '../../assets/svg/submit_an_idea.svg';
import { ReactComponent as IconMobileApp } from '../../assets/svg/mobile_app.svg';
import { ReactComponent as IconUnblockClassMates } from '../../assets/svg/unblock_classmates.svg';

import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  ACHIEVEMENTS_MAIN_AREA,
  areaToDisplayName,
  COMMUNITIES_MAIN_AREA,
  mainSubAreasInOrder,
  MORE_MAIN_AREA,
  PROFILE_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA
} from '../navigationState/hudNavigation';
import { UserState } from '../../reducers/user';
import useHudRoutes from '../frame/useHudRoutes';

const ICON_SIZE = 30;

const HudMainNavigation = () => {
  // TODO add this to make the icons all the same size.
  const classes: any = useStyles();

  const profile: User = useSelector((state: { user: UserState }) => state.user.data);

  const setHudAreas = useHudRoutes();

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
      displayName: areaToDisplayName[PROFILE_MAIN_AREA],
      icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />
    },
    {
      id: COMMUNITIES_MAIN_AREA,
      displayName: areaToDisplayName[COMMUNITIES_MAIN_AREA],
      icon: <IconClasses />
    },
    {
      id: STUDY_TOOLS_MAIN_AREA,
      displayName: areaToDisplayName[STUDY_TOOLS_MAIN_AREA],
      icon: <IconNotes />
    },
    {
      id: ACHIEVEMENTS_MAIN_AREA,
      displayName: areaToDisplayName[ACHIEVEMENTS_MAIN_AREA],
      icon: <IconLeaderboard />
    },
    {
      id: MORE_MAIN_AREA,
      displayName: areaToDisplayName[MORE_MAIN_AREA],
      icon: <IconMore />
    }
  ];

  const leafNavigationItems = mainSubAreasInOrder[selectedMainArea].map((subArea: string) => ({
    id: subArea,
    displayName: areaToDisplayName[subArea],
    icon: <IconStudyGoals />
    // iconText: areaToDisplayName[subArea][0]
  }));

  return (
    <>
      <HudToolbar onSelectItem={selectLeaf} navbarItems={leafNavigationItems} />
      <HudToolbar onSelectItem={selectRoot} navbarItems={rootNavigationItems} />
    </>
  );
};

export default HudMainNavigation;
