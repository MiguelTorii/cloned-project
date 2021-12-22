import React, { useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@material-ui/core';
import { ReactComponent as IconChat } from '../../assets/svg/ic_nav_chat.svg';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow-mark.svg';
import { ReactComponent as QuestionIcon } from '../../assets/svg/ic_ask_a_question.svg';
import { ReactComponent as ResourceIcon } from '../../assets/svg/ic_share_a_resource.svg';
import { ReactComponent as ShareNotesIcon } from '../../assets/svg/ic_notes.svg';
import { ReactComponent as ActiveCreatePost } from '../../assets/svg/posts.svg';
import { ReactComponent as FlashcardMark } from '../../assets/svg/flashcard-mark.svg';
import { ReactComponent as PrivateNotesIcon } from '../../assets/svg/ic_in_app_notes.svg';
import { ReactComponent as IconClasses } from '../../assets/svg/ic_nav_classes.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/ic_nav_leaderboard.svg';
import { ReactComponent as IconMyClasses } from '../../assets/svg/ic_classes.svg';
import { ReactComponent as IconClassFeed } from '../../assets/svg/ic_class_feeds.svg';
import { ReactComponent as IconStudyTools } from '../../assets/svg/flashcards.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/achievements.svg';
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
  LEADERBOARD_AREA,
  NOTES_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ASK_A_QUESTION_AREA,
  SHARE_RESOURCES_AREA,
  SHARE_NOTES_AREA,
  CREATE_A_POST_AREA
} from '../navigationState/hudNavigation';
import HudToolWithDropdown from './HudToolWithDropdown';
import { HudToolData } from './HudToolData';
import { AppState } from '../../configureStore';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { STUDY_TOOLS_NAV_OPTION } from '../../routeConstants';

const ICON_SIZE = { width: '44px', height: '44px' };
const NAVBAR_ICON_SIZE = { width: '50px', height: '50px' };

const HudMainNavigation = () => {
  const classes: any = useStyles();
  const local = useSelector<AppState, Record<string, any>>((state) => state.chat.data.local);

  const unreadMessageCount = useMemo(() => {
    let result = 0;
    Object.keys(local).forEach((l) => {
      if (local[l]?.unread) {
        result += Number(local[l].unread);
      }
    });
    return result;
  }, [local]);

  const studyToolsOption: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.studyToolsOption
  );

  const showStudyTools = studyToolsOption === STUDY_TOOLS_NAV_OPTION;

  const chatNavigationItems: HudToolData[] = [
    {
      id: CHAT_AREA,
      displayName: 'Chat',
      icon: <IconChat style={ICON_SIZE} />
    }
  ];

  const classesNavigationItems: HudToolData[] = [
    {
      id: CLASSES_AREA,
      displayName: 'Classes',
      icon: <IconMyClasses style={ICON_SIZE} />
    },
    {
      id: FEEDS_AREA,
      displayName: 'Class Feeds',
      icon: <IconClassFeed style={ICON_SIZE} />
    }
  ];

  const studyToolsNavigationItems: HudToolData[] = [
    {
      id: FLASHCARDS_AREA,
      displayName: 'Flashcards',
      icon: <FlashcardMark style={ICON_SIZE} />
    },
    {
      id: CREATE_A_POST_AREA,
      displayName: 'Create a Post',
      icon: <ActiveCreatePost style={ICON_SIZE} />
    },
    {
      id: SHARE_NOTES_AREA,
      displayName: 'Share Notes',
      icon: <ShareNotesIcon style={ICON_SIZE} />
    },
    {
      id: ASK_A_QUESTION_AREA,
      displayName: 'Ask a question',
      icon: <QuestionIcon style={ICON_SIZE} />
    },
    {
      id: SHARE_RESOURCES_AREA,
      displayName: 'Share Resources',
      icon: <ResourceIcon style={ICON_SIZE} />
    },
    {
      id: CALENDAR_AREA,
      displayName: 'Workflow',
      icon: <IconWorkflow style={ICON_SIZE} />
    },
    {
      id: NOTES_AREA,
      displayName: 'Private Notes',
      icon: <PrivateNotesIcon style={ICON_SIZE} />
    }
  ];

  const achievementsNavigationItems: HudToolData[] = [
    {
      id: LEADERBOARD_AREA,
      displayName: 'Leaderboard',
      icon: <IconAchievements style={ICON_SIZE} />
    }
  ];

  const chatNavigationItem: HudToolData = {
    id: CHAT_MAIN_AREA,
    displayName: 'chat',
    icon: (
      <Badge badgeContent={unreadMessageCount} color="secondary">
        <IconChat style={NAVBAR_ICON_SIZE} />
      </Badge>
    ),
    childTools: chatNavigationItems
  };

  const classesNavigationItem: HudToolData = {
    id: COMMUNITIES_MAIN_AREA,
    displayName: 'Classes',
    icon: <IconClasses style={NAVBAR_ICON_SIZE} />,
    childTools: classesNavigationItems
  };
  const studyToolsNavigationItem: HudToolData = {
    id: STUDY_TOOLS_MAIN_AREA,
    displayName: 'Study Tools',
    icon: <IconStudyTools style={NAVBAR_ICON_SIZE} />,
    childTools: studyToolsNavigationItems
  };
  const achievementsNavigationItem: HudToolData = {
    id: ACHIEVEMENTS_MAIN_AREA,
    displayName: 'Leaderboard',
    icon: <IconLeaderboard style={NAVBAR_ICON_SIZE} />,
    childTools: achievementsNavigationItems
  };

  let rootNavigationItems: HudToolData[];
  if (showStudyTools) {
    rootNavigationItems = [
      chatNavigationItem,
      classesNavigationItem,
      studyToolsNavigationItem,
      achievementsNavigationItem
    ];
  } else {
    rootNavigationItems = [chatNavigationItem, classesNavigationItem, achievementsNavigationItem];
  }
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
