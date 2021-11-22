import React from 'react';
import Avatar from '../../components/Avatar/Avatar';
import avatarImg from '../../assets/img/circlein-web-notification.png';
import { useStyles } from './HudStoryStyles';

const StoryAvatar = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.storyAvatarContainer}>
      <div className={classes.storyAvatarBackground}>
        <Avatar
          className={classes.storyAvatar}
          desktopSize="100%"
          mobileSize="100%"
          alt="story-avatar"
          src={avatarImg}
        />
      </div>
    </div>
  );
};

export default StoryAvatar;
