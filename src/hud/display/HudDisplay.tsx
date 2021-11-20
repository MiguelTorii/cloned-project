import React from 'react';
import { useStyles } from './HudDisplayStyles';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import HudExperienceBar from '../experienceBar/HudExperienceBar';

const HudDisplay = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.displayGrid}>
      <div className={classes.storyAvatar}>
        <HudStoryAvatar />
      </div>

      <div className={classes.storyMessage}>
        <HudStoryMessage />
      </div>

      <div className={classes.experienceBar}>
        <HudExperienceBar />
      </div>
    </div>
  );
};

export default HudDisplay;
