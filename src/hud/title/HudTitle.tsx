import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useStyles } from './HudTitleStyles';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { HudStoryState } from '../storyState/hudStoryState';

const subAreaToTitle = {
  ABOUT_ME_AREA: 'About Me',
  REWARDS_STORE_AREA: 'Rewards Store',
  POINTS_HISTORY_AREA: 'Points History',
  CHAT_AREA: 'Chat',
  CLASSES_AREA: 'Classes',
  FEEDS_AREA: 'Class Feeds',
  CREATE_A_POST_AREA: 'Create a Post',
  ASK_A_QUESTION_AREA: 'Ask a Question',
  SHARE_NOTES_AREA: 'Share Notes',
  SHARE_RESOURCES_AREA: 'Share Resources',
  NOTES_AREA: 'Private Notes',
  FLASHCARDS_AREA: 'Flashcards',
  CALENDAR_AREA: 'Workflow',
  LEADERBOARD_AREA: 'Leaderboard'
};

const HudTitle = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const title = subAreaToTitle[selectedMainSubArea] || '';

  if (!currentStatement) {
    return (
      <div className={classes.titleAndStoryContainer}>
        <div className={classes.largeTitleContainer}>
          <Typography color="textPrimary" className={classes.largeTitle}>
            {title}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.titleAndStoryContainer}>
      <div className={classes.storyAvatar}>
        <HudStoryAvatar />
      </div>
      <div className={classes.currentStatement}>
        <HudStoryMessage />
      </div>
      <Typography color="textPrimary" className={classes.smallTitle}>
        {title}
      </Typography>
    </div>
  );
};

export default HudTitle;
