import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from './HudStoryStyles';
import HudStoryAvatar from './HudStoryAvatar';
import HudStoryMessage from './HudStoryMessage';
import { HudStoryState } from '../storyState/hudStoryState';

const HudStory = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  if (!currentStatement) {
    return null;
  }

  return (
    <div className={classes.storyContainer}>
      <div className={classes.storyMessageBackground} />
      <div className={classes.storyAvatarContainer}>
        <HudStoryAvatar />
      </div>
      <div className={classes.storyMessageContainer}>
        <HudStoryMessage />
      </div>
    </div>
  );
};

export default HudStory;
