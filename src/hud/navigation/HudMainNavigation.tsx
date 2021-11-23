import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-off.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard.svg';
import { ReactComponent as IconMore } from '../../assets/svg/more.svg';
import { ReactComponent as IconAboutMe } from '../../assets/svg/about_me.svg';
import { ReactComponent as IconChatMembers } from '../../assets/svg/chat-studyroom-members.svg';
import { ReactComponent as IconBookmarkedPosts } from '../../assets/svg/bookmarked_posts.svg';
import { ReactComponent as IconPointsHistory } from '../../assets/svg/points_history.svg';
import { ReactComponent as IconMyClasses } from '../../assets/svg/classes_overview.svg';
import { ReactComponent as IconClassFeed } from '../../assets/svg/class_feed.svg';
import { ReactComponent as IconStudyTools } from '../../assets/svg/study_tools.svg';
import { ReactComponent as IconFlashcards } from '../../assets/svg/flashcards-menu.svg';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow.svg';
import { ReactComponent as IconStudyingOnCircleIn } from '../../assets/svg/studying_on_circlein.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/achievements.svg';
import { ReactComponent as IconSubmitSupportTicket } from '../../assets/svg/submit_support_ticket.svg';
import { ReactComponent as IconSubmitAnIdea } from '../../assets/svg/submit_an_idea.svg';
import { ReactComponent as IconMobileApp } from '../../assets/svg/get_the_mobile_app.svg';
import { ReactComponent as IconRewardStore } from '../../assets/svg/rewards-icon-off.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
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
  STUDY_TIPS_AREA,
  STUDY_TOOLS_MAIN_AREA,
  SUPPORT_AREA
} from '../navigationState/hudNavigation';
import { UserState } from '../../reducers/user';
import HudToolGroup from './HudToolGroup';
import { HudTool } from './HudTool';

const ICON_SIZE = 30;

const HudMainNavigation = () => {
  // TODO add this to make the icons all the same size.
  // TODO set up a state to know which icon is selected
  const classes: any = useStyles();

  const profile: User = useSelector((state: { user: UserState }) => state.user.data);

  const profileNavigationItems: HudTool[] = [
    {
      id: ABOUT_ME_AREA,
      displayName: 'About Me',
      icon: <IconAboutMe />
    },
    {
      id: REWARDS_STORE_AREA,
      displayName: 'Rewards Store',
      icon: <IconRewardStore />
    },
    {
      id: POINTS_HISTORY_AREA,
      displayName: 'Points History',
      icon: <IconPointsHistory />
    }
  ];

  const communitiesNavigationItems: HudTool[] = [
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

  const studyToolsNavigationItems: HudTool[] = [
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

  const achievementsNavigationItems: HudTool[] = [
    {
      id: LEADERBOARD_AREA,
      displayName: 'Leaderboard',
      icon: <IconLeaderboard />
    }
  ];

  const moreNavigationItems: HudTool[] = [
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

  const profileNavigationItem: HudTool = {
    id: PROFILE_MAIN_AREA,
    displayName: 'Profile',
    icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />,
    childTools: profileNavigationItems
  };
  const communitiesNavigationItem: HudTool = {
    id: COMMUNITIES_MAIN_AREA,
    displayName: 'Classes',
    icon: <IconClasses />,
    childTools: communitiesNavigationItems
  };
  const studyToolsNavigationItem: HudTool = {
    id: STUDY_TOOLS_MAIN_AREA,
    displayName: 'Study Tools',
    icon: <IconStudyTools />,
    childTools: studyToolsNavigationItems
  };
  const achievementsNavigationItem: HudTool = {
    id: ACHIEVEMENTS_MAIN_AREA,
    displayName: 'Achievements',
    icon: <IconAchievements />,
    childTools: achievementsNavigationItems
  };
  const moreNavigationItem: HudTool = {
    id: MORE_MAIN_AREA,
    displayName: 'More...',
    icon: <IconMore />,
    childTools: moreNavigationItems
  };

  const rootNavigationItems: HudTool[] = [
    profileNavigationItem,
    communitiesNavigationItem,
    studyToolsNavigationItem,
    achievementsNavigationItem,
    moreNavigationItem
  ];

  return (
    <div className={classes.controlPanelMainSection}>
      {rootNavigationItems.map((rootNavigationItem) => (
        <HudToolGroup parentNavigationItem={rootNavigationItem} key={rootNavigationItem.id} />
      ))}
    </div>
  );
};

export default HudMainNavigation;
