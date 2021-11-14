import React from 'react';
import { useSelector } from 'react-redux';
import { StoryState } from '../../reducers/story';
import { useStyles } from './HudStoryStyles';

const StoryMessage = () => {
  const classes: any = useStyles();

  const story: string = useSelector(
    (state: { story: StoryState }) => state.story.data.conversation
  );
  return <div className={classes.storyMessage}>{story}</div>;
};

export default StoryMessage;
