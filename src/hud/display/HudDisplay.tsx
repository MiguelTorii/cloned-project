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

  const StoryAvatarSize = () => {
    const conversation: string = useSelector(
      (state: { hudStory: HudStoryState }) => state.hudStory.conversation
    );

    if (conversation) {
      return { width: talkingStoryAvatarSize, height: talkingStoryAvatarSize };
    }
    return { width: silentStoryAvatarSize, height: silentStoryAvatarSize };
  };
  const ConversationHide = () => {
    const conversation: string = useSelector(
      (state: { hudStory: HudStoryState }) => state.hudStory.conversation
    );

    if (!conversation) {
      setTimeout(() => ({ display: 'none' }), 1000);
    }
    return { display: 'grid' };
  };

  return (
    <div className={classes.storyAvatarExperienceContainer}>
      <div style={ConversationHide()} className={classes.storyAvatarAndMessage}>
        <div style={StoryAvatarSize()} className={classes.storyAvatar}>
          <HudStoryAvatar />
        </div>
        <div className={classes.storyMessage}>
          <HudStoryMessage />
        </div>
        <div className={classes.experienceBar}>
          <HudExperienceBar />
        </div>
      </div>
    </div>
  );
};

export default HudDisplay;
