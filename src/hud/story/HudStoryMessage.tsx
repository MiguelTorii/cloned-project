import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useStyles } from './HudStoryStyles';
import { HudStoryState } from '../storyState/hudStoryState';

const StoryMessage = () => {
  const classes: any = useStyles();

  const conversation: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.conversation
  );

  return (
    <div className={classes.storyMessage}>
      <Typography variant="body1">{conversation}</Typography>
    </div>
  );
};

export default StoryMessage;
