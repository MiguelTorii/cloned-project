import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from './HudDisplayStyles';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import { HudStoryState } from '../storyState/hudStoryState';

const talkingStoryAvatarSize = '70px';
const silentStoryAvatarSize = '0px';

const HudDisplay = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  const storyAvatarSize = () => {
    if (currentStatement) {
      return { width: talkingStoryAvatarSize, height: talkingStoryAvatarSize };
    }
    return { width: silentStoryAvatarSize, height: silentStoryAvatarSize };
  };

  return (
    <div className={classes.storyAvatarExperienceContainer}>
      <div className={classes.storyAvatarAndMessage}>
        {currentStatement && (
          <>
            <div style={storyAvatarSize()} className={classes.storyAvatar}>
              <HudStoryAvatar />
            </div>
            <div className={classes.storyMessageContainer}>
              <HudStoryMessage />
            </div>
          </>
        )}
        <div className={classes.experienceBar}>
          <HudExperienceBar />
        </div>
      </div>
    </div>
  );
};

export default HudDisplay;
