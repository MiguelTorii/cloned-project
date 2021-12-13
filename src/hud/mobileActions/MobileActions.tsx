import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Fab,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover
} from '@material-ui/core';
import IconAdd from '@material-ui/icons/Add';
import useStyles from './MobileActionsStyles';
import { HudToolData } from '../navigation/HudToolData';
import {
  ASK_A_QUESTION_AREA,
  CALENDAR_AREA,
  CREATE_A_POST_AREA,
  FLASHCARDS_AREA,
  NOTES_AREA,
  SHARE_NOTES_AREA,
  SHARE_RESOURCES_AREA,
  STUDY_TOOLS_MAIN_AREA
} from '../navigationState/hudNavigation';
import { ReactComponent as FlashcardMark } from '../../assets/svg/flashcard-mark.svg';
import { ReactComponent as ActiveCreatePost } from '../../assets/svg/posts.svg';
import { ReactComponent as IconWorkflow } from '../../assets/svg/workflow-mark.svg';
import { ReactComponent as PrivateNotesIcon } from '../../assets/svg/note-mark.svg';
import { ReactComponent as ShareNotesIcon } from '../../assets/svg/share_notes.svg';
import { ReactComponent as QuestionIcon } from '../../assets/svg/question-mark.svg';
import { ReactComponent as ResourceIcon } from '../../assets/svg/resource-mark.svg';
import useHudRoutes from '../frame/useHudRoutes';

const ICON_SIZE = { width: '24px', height: '24px' };

const actionItems: HudToolData[] = [
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
  },
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
  }
];

const MobileActions = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const setHudArea = useHudRoutes();

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
            <ListItemText primary={item.displayName} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MobileActions;
