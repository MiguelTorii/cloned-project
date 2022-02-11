import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import AREA_TITLES from 'constants/area-titles';

import { useStyles } from './HudTitleStyles';

const subAreaToTitle = {
  ABOUT_ME_AREA: null,
  REWARDS_STORE_AREA: AREA_TITLES.REWARDS_STORE,
  POINTS_HISTORY_AREA: AREA_TITLES.POINTS_HISTORY,
  CHAT_AREA: null,
  CLASSES_AREA: AREA_TITLES.CLASSES,
  FEEDS_AREA: AREA_TITLES.CLASS_FEEDS,
  CREATE_A_POST_AREA: AREA_TITLES.WRITE_A_POST,
  ASK_A_QUESTION_AREA: AREA_TITLES.ASK_A_QUESTION,
  SHARE_NOTES_AREA: AREA_TITLES.SHARE_NOTES,
  SHARE_RESOURCES_AREA: AREA_TITLES.SHARE_A_RESOURCE,
  NOTES_AREA: AREA_TITLES.PRIVATE_NOTES,
  FLASHCARDS_AREA: AREA_TITLES.FLASHCARDS,
  CALENDAR_AREA: AREA_TITLES.WORKFLOW,
  LEADERBOARD_AREA: AREA_TITLES.LEADERBOARD,
  GIVE_FEEDBACK_AREA: AREA_TITLES.GIVE_FEEDBACK,
  GET_THE_MOBILE_APP_AREA: AREA_TITLES.GET_THE_MOBILE_APP
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
