import React from 'react';
import avatarImg from '../../assets/svg/icon-kobe.svg';
import { useStyles } from './HudStoryStyles';

const StoryAvatar = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.storyAvatarBackground}>
      <img src={avatarImg} alt="story-avatar" className={classes.storyAvatar} />
    </div>
  );
};

export default StoryAvatar;
