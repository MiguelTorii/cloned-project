import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { StoryState } from '../../reducers/story';
import { useStyles } from './HudStoryStyles';

const StoryMessage = () => {
  const classes: any = useStyles();

  const story: string = useSelector(
    (state: { story: StoryState }) => state.story.data.conversation
  );

  return (
    <div className={classes.storyMessage}>
      <Typography variant="body1">{story}</Typography>
    </div>
  );
};

export default StoryMessage;
