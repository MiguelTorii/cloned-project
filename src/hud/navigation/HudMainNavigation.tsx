import React from 'react';

import { CalendarToday } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import IconChat from '@material-ui/icons/Chat';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-on.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard-icon-on.svg';
import { ReactComponent as IconMore } from '../../assets/svg/more.svg';
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
import { ReactComponent as QuestionIcon } from '../../assets/svg/question-mark.svg';
import { ReactComponent as ResourceIcon } from '../../assets/svg/resource-mark.svg';
import { ReactComponent as ShareNotesIcon } from '../../assets/svg/note-mark.svg';
import { ReactComponent as CreatePostIcon } from '../../assets/svg/message-mark.svg';
import { useStyles } from './HudNavigationStyles';
import {
  ACHIEVEMENTS_MAIN_AREA,
  CALENDAR_AREA,
  CHAT_MAIN_AREA,
  CHAT_AREA,
  CLASSES_AREA,
  COMMUNITIES_MAIN_AREA,
  FEEDS_AREA,
  FLASHCARDS_AREA,
  GET_THE_MOBILE_APP_AREA,
  GIVE_FEEDBACK_AREA,
  LEADERBOARD_AREA,
  MORE_MAIN_AREA,
  NOTES_AREA,
  STUDY_TOOLS_MAIN_AREA,
  SUPPORT_AREA,
  ASK_A_QUESTION_AREA,
  SHARE_RESOURCES_AREA,
  SHARE_NOTES_AREA,
  CREATE_A_POST_AREA
} from '../navigationState/hudNavigation';
import HudToolWithDropdown from './HudToolWithDropdown';
import { HudToolData } from './HudToolData';

const HudMainNavigation = () => {
  const classes: any = useStyles();

  const chatNavigationItems: HudToolData[] = [
    {
      id: CHAT_AREA,
      displayName: 'Chat',
      icon: <IconChat />
    }
  ];

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
      id: CREATE_A_POST_AREA,
      displayName: 'Create a post',
      icon: <CreatePostIcon />
    },
    {
      id: ASK_A_QUESTION_AREA,
      displayName: 'Ask a question',
      icon: <QuestionIcon />
    },
    {
      id: SHARE_NOTES_AREA,
      displayName: 'Share notes',
      icon: <ShareNotesIcon />
    },
    {
      id: SHARE_RESOURCES_AREA,
      displayName: 'Share resources',
      icon: <ResourceIcon />
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

  const chatNavigationItem: HudToolData = {
    id: CHAT_MAIN_AREA,
    displayName: 'chat',
    icon: <IconChat />,
    childTools: chatNavigationItems
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
    chatNavigationItem,
    classesNavigationItem,
    studyToolsNavigationItem,
    achievementsNavigationItem
  ];

  return (
    <div className={classes.controlPanelMainSection}>
      {rootNavigationItems.map((rootNavigationItem) => (
        <HudToolWithDropdown
          parentNavigationItem={rootNavigationItem}
          key={rootNavigationItem.id}
        />
      ))}
    </div>
  );
};

export default HudMainNavigation;
