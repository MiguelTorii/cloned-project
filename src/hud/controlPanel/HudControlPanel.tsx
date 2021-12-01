import React from 'react';
import { Avatar, Button } from '@material-ui/core';
import { useStyles } from './HudControlPanelStyles';
import HudMainNavigation from '../navigation/HudMainNavigation';
import HudRightNavigation from '../navigation/HudRightNavigation';
import avatarImg from '../../assets/img/circlein-web-notification.png';
import useHudRoutes from '../frame/useHudRoutes';
import { COMMUNITIES_MAIN_AREA, FEEDS_AREA } from '../navigationState/hudNavigation';

const HudControlPanel = () => {
  const classes: any = useStyles();

  const setHudArea = useHudRoutes();

  const homepageReset = () => {
    setHudArea(COMMUNITIES_MAIN_AREA, FEEDS_AREA);
  };

  return (
    <div className={classes.controlPanel}>
      <Button className={classes.circleInLogoContainer} onClick={() => homepageReset()}>
        <Avatar className={classes.circleInLogo} alt="CircleIn-Logo" src={avatarImg} />
      </Button>

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
