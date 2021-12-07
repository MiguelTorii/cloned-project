import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useStyles } from './HudStoryStyles';
import { HudStoryState } from '../storyState/hudStoryState';

const HudStoryMessage = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  return (
    <div className={classes.storyMessage}>
      <Typography variant="body1">{currentStatement}</Typography>
    </div>
  );
};

export default HudStoryMessage;
