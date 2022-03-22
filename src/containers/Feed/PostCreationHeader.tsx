import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import QuestionIcon from '../../assets/svg/ic_ask_a_question.svg';
import FlashcardMark from '../../assets/svg/flashcard-mark.svg';
import ShareNotesIcon from '../../assets/svg/ic_notes.svg';
import ActiveCreatePost from '../../assets/svg/ic_create_a_post.svg';
import IconResource from '../../assets/svg/ic_share_a_resource.svg';
import useHudRoutes from '../../hud/frame/useHudRoutes';
import {
  ASK_A_QUESTION_AREA,
  CREATE_A_POST_AREA,
  FLASHCARDS_AREA,
  SHARE_NOTES_AREA,
  SHARE_RESOURCES_AREA,
  STUDY_TOOLS_MAIN_AREA
} from '../../hud/navigationState/hudNavigation';
import AREA_TITLES from 'constants/area-titles';

import useStyles from './styles';

const ICON_SIZE = { width: '36px', height: '36px' };

const HUD_POST_BUTTONS = [
  {
    value: FLASHCARDS_AREA,
    text: AREA_TITLES.FLASHCARDS,
    icon: FlashcardMark
  },
  {
    value: CREATE_A_POST_AREA,
    text: AREA_TITLES.WRITE_A_POST,
    icon: ActiveCreatePost
  },
  {
    value: SHARE_NOTES_AREA,
    text: AREA_TITLES.SHARE_NOTES,
    icon: ShareNotesIcon
  },
  {
    value: ASK_A_QUESTION_AREA,
    text: AREA_TITLES.ASK_A_QUESTION,
    icon: QuestionIcon
  },
  {
    value: SHARE_RESOURCES_AREA,
    text: AREA_TITLES.SHARE_A_RESOURCE,
    icon: IconResource
  }
];

const PostCreationHeader = () => {
  const setHudArea = useHudRoutes();

  const classes: any = useStyles();
  const dispatch = useDispatch();
  const handleGotoPostCreate = useCallback(
    (value = 0) => {
      setHudArea(STUDY_TOOLS_MAIN_AREA, value);
    },
    [dispatch]
  );

  return (
    <Box className={classes.postHeaderRoot}>
      <Paper className={classes.postHeaderPaper}>
        <div className={classes.hudFeedButtonsContainer}>
          {HUD_POST_BUTTONS.map((item) => (
            <div className={classes.hudFeedButtonGroup} key={item.value}>
              <Button
                className={classes.postButton}
                startIcon={<img src={item.icon} alt={item.text} style={ICON_SIZE} />}
                onClick={() => handleGotoPostCreate(item.value)}
              >
                {item.text}
              </Button>
            </div>
          ))}
        </div>
      </Paper>
    </Box>
  );
};

PostCreationHeader.postTypes = {};
export default PostCreationHeader;
