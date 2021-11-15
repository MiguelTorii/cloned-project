import React from 'react';
import { useStyles } from './HudControlPanelStyles';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import HudMainNavigation from '../navigation/HudMainNavigation';
import HudLeftNavigation from '../navigation/HudLeftNavigation';
import HudRightNavigation from '../navigation/HudRightNavigation';

const HudControlPanel = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.controlPanelGrid}>
      <div className={classes.chatNavigation}>
        <HudLeftNavigation />
      </div>

      <div className={classes.storyMessageBackground} />

      <div className={classes.storyAvatar}>
        <HudStoryAvatar />
      </div>

      <div className={classes.storyMessage}>
        <HudStoryMessage />
      </div>

      <div className={classes.experienceBar}>
        <HudExperienceBar />
      </div>

      <div className={classes.mainNavigation}>
        <HudMainNavigation />
      </div>

      <div className={classes.missionNavigation}>
        <HudRightNavigation />
      </div>
    </div>
  );
};

export default HudControlPanel;
