import cx from 'classnames';
import { useSelector } from 'react-redux';

import AREA_TITLES from 'constants/area-titles';

import { ReactComponent as FlashcardMark } from 'assets/svg/flashcard-mark.svg';
import { ReactComponent as QuestionIcon } from 'assets/svg/ic_ask_a_question.svg';
import { ReactComponent as ChatIcon } from 'assets/svg/ic_chat.svg';
import { ReactComponent as CreatePostIcon } from 'assets/svg/ic_create_a_post.svg';
import { ReactComponent as PrivateNotesIcon } from 'assets/svg/ic_in_app_notes.svg';
import { ReactComponent as ShareNotesIcon } from 'assets/svg/ic_notes.svg';
import { ReactComponent as ResourceIcon } from 'assets/svg/ic_share_a_resource.svg';
import { ReactComponent as IconWorkflow } from 'assets/svg/ic_workflow.svg';
import useHudAreaSetter from 'hud/frame/useHudRoutes';
import HudToolbar from 'hud/navigation/HudToolbar';
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
} from 'hud/navigationState/hudNavigation';
import { useStyles as useHighlightedButtonStyles } from 'styles/HighlightedButton';

import { useStyles } from './HudMissionsStyles';

import type { HudToolData } from 'hud/navigation/HudToolData';
import type { HudNavigationState } from 'hud/navigationState/hudNavigationState';

const ICON_SIZE = { width: '44px', height: '44px' };

const HudStudyTools = () => {
  const classes: any = useStyles();
  const highlightedButtonClasses = useHighlightedButtonStyles();

  const setHudArea = useHudAreaSetter();

  const highlightedNavigation = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.highlightedNavigation
  );

  const highlightStudyToolGroup =
    highlightedNavigation?.rootAreaId === STUDY_TOOLS_MAIN_AREA &&
    !highlightedNavigation?.leafAreaId;

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
      displayName: `${AREA_TITLES.FLASHCARDS}: Create, share and review your flashcards in multiple modes`,
      icon: <FlashcardMark style={ICON_SIZE} />
    },
    {
      id: CREATE_A_POST_AREA,
      displayName: `${AREA_TITLES.WRITE_A_POST}: Share an announcement or message in your class`,
      icon: <CreatePostIcon style={ICON_SIZE} />
    },
    {
      id: SHARE_NOTES_AREA,
      displayName: `${AREA_TITLES.SHARE_NOTES}: Add your custom class notes and resources to keep everything in one place`,
      icon: <ShareNotesIcon style={ICON_SIZE} />
    },
    {
      id: ASK_A_QUESTION_AREA,
      displayName: `${AREA_TITLES.ASK_A_QUESTION}: Need help? Ask a question publicly or anonymously to your class`,
      icon: <QuestionIcon style={ICON_SIZE} />
    }
  ];

  const bottomStudyTools: HudToolData[] = [
    {
      id: SHARE_RESOURCES_AREA,
      displayName: `${AREA_TITLES.SHARE_A_RESOURCE}: Share helpful resources, links, and more with your class`,
      icon: <ResourceIcon style={ICON_SIZE} />
    },
    {
      id: CALENDAR_AREA,
      displayName: `${AREA_TITLES.WORKFLOW}: Manage your time by tracking your tasks, assignments, and important deadlines`,
      icon: <IconWorkflow style={ICON_SIZE} />
    },
    {
      id: NOTES_AREA,
      displayName: `${AREA_TITLES.PRIVATE_NOTES}: Create private notes just for yourself`,
      icon: <PrivateNotesIcon style={ICON_SIZE} />
    },
    {
      id: CHAT_AREA,
      displayName: `${AREA_TITLES.CHAT}: Connect with peers and classmates anywhere, any time`,
      icon: <ChatIcon style={ICON_SIZE} />
    }
  ];

  return (
    <div
      className={cx(
        classes.buttonGroup,
        highlightStudyToolGroup && highlightedButtonClasses.animated
      )}
    >
      <HudToolbar navbarItems={topStudyTools} onSelectItem={selectLeaf} />
      <HudToolbar navbarItems={bottomStudyTools} onSelectItem={selectLeaf} />
    </div>
  );
};

export default HudStudyTools;
