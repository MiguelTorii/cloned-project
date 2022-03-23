import { useCallback, useState } from 'react';

import { Box, Fab, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import IconAdd from '@material-ui/icons/Add';

import AREA_TITLES from 'constants/area-titles';

import { ReactComponent as FlashcardMark } from 'assets/svg/flashcard-mark.svg';
import { ReactComponent as QuestionIcon } from 'assets/svg/ic_ask_a_question.svg';
import { ReactComponent as ActiveCreatePost } from 'assets/svg/ic_create_a_post.svg';
import { ReactComponent as PrivateNotesIcon } from 'assets/svg/ic_in_app_notes.svg';
import { ReactComponent as ShareNotesIcon } from 'assets/svg/ic_notes.svg';
import { ReactComponent as ResourceIcon } from 'assets/svg/ic_share_a_resource.svg';
import { ReactComponent as IconWorkflow } from 'assets/svg/ic_workflow.svg';
import useHudAreaSetter from 'hud/frame/useHudRoutes';
import {
  ASK_A_QUESTION_AREA,
  CALENDAR_AREA,
  CREATE_A_POST_AREA,
  FLASHCARDS_AREA,
  NOTES_AREA,
  SHARE_NOTES_AREA,
  SHARE_RESOURCES_AREA,
  STUDY_TOOLS_MAIN_AREA
} from 'hud/navigationState/hudNavigation';

import useStyles from './MobileActionsStyles';

import type { HudToolData } from 'hud/navigation/HudToolData';

const ICON_SIZE = { width: '24px', height: '24px' };

const actionItems: HudToolData[] = [
  {
    id: FLASHCARDS_AREA,
    displayName: AREA_TITLES.FLASHCARDS,
    icon: <FlashcardMark style={ICON_SIZE} />
  },
  {
    id: CREATE_A_POST_AREA,
    displayName: AREA_TITLES.WRITE_A_POST,
    icon: <ActiveCreatePost style={ICON_SIZE} />
  },
  {
    id: SHARE_NOTES_AREA,
    displayName: AREA_TITLES.SHARE_NOTES,
    icon: <ShareNotesIcon style={ICON_SIZE} />
  },
  {
    id: ASK_A_QUESTION_AREA,
    displayName: AREA_TITLES.ASK_A_QUESTION,
    icon: <QuestionIcon style={ICON_SIZE} />
  },
  {
    id: SHARE_RESOURCES_AREA,
    displayName: AREA_TITLES.SHARE_A_RESOURCE,
    icon: <ResourceIcon style={ICON_SIZE} />
  },
  {
    id: CALENDAR_AREA,
    displayName: AREA_TITLES.WORKFLOW,
    icon: <IconWorkflow style={ICON_SIZE} />
  },
  {
    id: NOTES_AREA,
    displayName: AREA_TITLES.PRIVATE_NOTES,
    icon: <PrivateNotesIcon style={ICON_SIZE} />
  }
];

const MobileActions = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const setHudArea = useHudAreaSetter();

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  const handleClickMenuItem = useCallback(
    (itemId) => {
      setHudArea(STUDY_TOOLS_MAIN_AREA, itemId);
    },
    [setHudArea]
  );

  return (
    <Box>
      <Fab onClick={handleOpenMenu} className={classes.fab} color="primary" aria-label="add">
        <IconAdd />
      </Fab>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        {actionItems.map((item) => (
          <MenuItem key={item.id} onClick={() => handleClickMenuItem(item.id)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText className={classes.actionText} primary={item.displayName} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MobileActions;
