import React from 'react';
import { useSelector } from 'react-redux';
import { StoryState } from '../../reducers/story';

type Props = {
  classes: Record<string, any>;
};

const StoryMessage = ({ classes }: Props) => {
  const story: string = useSelector(
    (state: { story: StoryState }) => state.story.data.conversation
  );
  return <div>{story}</div>;
};

export default StoryMessage;
