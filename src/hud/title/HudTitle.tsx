import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useStyles } from './HudTitleStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const subAreaToTitle = {
  ABOUT_ME_AREA: null,
  REWARDS_STORE_AREA: 'Rewards Store',
  POINTS_HISTORY_AREA: 'Points History',
  CHAT_AREA: null,
  CLASSES_AREA: 'Classes',
  FEEDS_AREA: 'Class Feeds',
  CREATE_A_POST_AREA: 'Create a Post',
  ASK_A_QUESTION_AREA: 'Ask a Question',
  SHARE_NOTES_AREA: 'Share Notes',
  SHARE_RESOURCES_AREA: 'Share Resources',
  NOTES_AREA: 'Private Notes',
  FLASHCARDS_AREA: 'Flashcards',
  CALENDAR_AREA: 'Workflow',
  LEADERBOARD_AREA: 'Leaderboard',
  GIVE_FEEDBACK_AREA: 'Give Feedback',
  GET_THE_MOBILE_APP_AREA: 'Get the Mobile App'
};

const HudTitle = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const title = subAreaToTitle[selectedMainSubArea] || '';

  if (!title) {
    return null;
  }

  return (
    <div className={classes.largeTitleContainer}>
      <Typography color="textPrimary" className={classes.largeTitle}>
        {title}
      </Typography>
    </div>
  );
};

export default HudTitle;
