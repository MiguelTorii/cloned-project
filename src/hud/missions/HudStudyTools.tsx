import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from './HudMissionsStyles';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow-mark.svg';
import { ReactComponent as QuestionIcon } from '../../assets/svg/question-mark.svg';
import { ReactComponent as ResourceIcon } from '../../assets/svg/resource-mark.svg';
import { ReactComponent as ShareNotesIcon } from '../../assets/svg/share_notes.svg';
import { ReactComponent as CreatePostIcon } from '../../assets/svg/message-mark.svg';
import { ReactComponent as ActiveCreatePost } from '../../assets/svg/posts.svg';
import { ReactComponent as FlashcardMark } from '../../assets/svg/flashcard-mark.svg';
import { ReactComponent as PrivateNotesIcon } from '../../assets/svg/note-mark.svg';
import {
  CALENDAR_AREA,
  CHAT_MAIN_AREA,
  CHAT_AREA,
  FLASHCARDS_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ASK_A_QUESTION_AREA,
  SHARE_RESOURCES_AREA,
  SHARE_NOTES_AREA,
  CREATE_A_POST_AREA,
  NOTES_AREA
} from '../navigationState/hudNavigation';
import { HudToolData } from '../navigation/HudToolData';
import HudToolbar from '../navigation/HudToolbar';
import useHudRoutes from '../frame/useHudRoutes';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const ICON_SIZE = { width: '44px', height: '44px' };

const HudStudyTools = () => {
  const classes: any = useStyles();

  const setHudArea = useHudRoutes();

  const selectLeaf = (mainSubArea: string) => {
    if (mainSubArea === CHAT_AREA) {
      setHudArea(CHAT_MAIN_AREA, CHAT_AREA);
    } else {
      setHudArea(STUDY_TOOLS_MAIN_AREA, mainSubArea);
    }
  };

  const topStudyTools: HudToolData[] = [
    {
      id: FLASHCARDS_AREA,
      displayName: 'Flashcards',
      icon: <FlashcardMark style={ICON_SIZE} />
    },
    {
      id: CREATE_A_POST_AREA,
      displayName: 'Create a post',
      icon: <ActiveCreatePost style={ICON_SIZE} />
    },
    {
      id: CALENDAR_AREA,
      displayName: 'Workflow',
      icon: <IconWorkflow style={ICON_SIZE} />
    },
    {
      id: NOTES_AREA,
      displayName: 'Private notes',
      icon: <PrivateNotesIcon style={ICON_SIZE} />
    }
  ];

  const bottomStudyTools: HudToolData[] = [
    {
      id: SHARE_NOTES_AREA,
      displayName: 'Share notes',
      icon: <ShareNotesIcon style={ICON_SIZE} />
    },
    {
      id: ASK_A_QUESTION_AREA,
      displayName: 'Ask a question',
      icon: <QuestionIcon style={ICON_SIZE} />
    },
    {
      id: SHARE_RESOURCES_AREA,
      displayName: 'Share resources',
      icon: <ResourceIcon style={ICON_SIZE} />
    },
    {
      id: CHAT_AREA,
      displayName: 'chat',
      icon: <CreatePostIcon style={ICON_SIZE} />
    }
  ];

  return (
    <>
      <HudToolbar navbarItems={topStudyTools} onSelectItem={selectLeaf} />
      <HudToolbar navbarItems={bottomStudyTools} onSelectItem={selectLeaf} />
    </>
  );
};

export default HudStudyTools;
