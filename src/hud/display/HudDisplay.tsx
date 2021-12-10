import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from './HudDisplayStyles';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import { HudStoryState } from '../storyState/hudStoryState';

const HudDisplay = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  return (
    <div className={classes.storyAvatarExperienceContainer}>
      {currentStatement && (
        <div className={classes.storyContainer}>
          <div className={classes.storyMessageBackground} />
          <div className={classes.storyAvatar}>
            <HudStoryAvatar />
          </div>
          <div className={classes.storyMessageContainer}>
            <HudStoryMessage />
          </div>
        </div>
      )}
      <div className={classes.experienceBarContainer}>
        <HudExperienceBar />
      </div>
    </div>
  );
};

export default HudDisplay;
