import React from 'react';
import { Avatar, Button, Hidden } from '@material-ui/core';
import { useStyles } from './HudControlPanelStyles';
import HudMainNavigation from '../navigation/HudMainNavigation';
import HudRightNavigation from '../navigation/HudRightNavigation';
import avatarImg from '../../assets/img/circlein-web-notification.png';
import useHudRoutes from '../frame/useHudRoutes';
import { COMMUNITIES_MAIN_AREA, FEEDS_AREA } from '../navigationState/hudNavigation';
import useStorySequence from '../storyState/useStorySequence';

const HudControlPanel = () => {
  const classes: any = useStyles();

  const setHudArea = useHudRoutes();

  const { sayGreeting } = useStorySequence();

  const homepageReset = () => {
    setHudArea(COMMUNITIES_MAIN_AREA, FEEDS_AREA);
    sayGreeting();
  };

  return (
    <div className={classes.controlPanel}>
      <Button className={classes.circleInLogoContainer} onClick={() => homepageReset()}>
        <Avatar className={classes.circleInLogo} alt="CircleIn-Logo" src={avatarImg} />
      </Button>

      <Hidden smDown>
        <div className={classes.mainNavigation}>
          <HudMainNavigation />
        </div>
      </Hidden>

      <div className={classes.missionNavigation}>
        <HudRightNavigation />
      </div>
    </div>
  );
};

export default HudControlPanel;
