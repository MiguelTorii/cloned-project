import React from 'react';

import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

import avatarImg from 'assets/svg/circlein_logo.svg';
import useHudAreaSetter from 'hud/frame/useHudRoutes';
import HudMainNavigation from 'hud/navigation/HudMainNavigation';
import HudRightNavigation from 'hud/navigation/HudRightNavigation';
import { COMMUNITIES_MAIN_AREA, FEEDS_AREA } from 'hud/navigationState/hudNavigation';
import useStorySequence from 'hud/storyState/useStorySequence';

import { useStyles } from './HudControlPanelStyles';

const HudControlPanel = () => {
  const classes: any = useStyles();

  const setHudArea = useHudAreaSetter();

  const { sayGreeting } = useStorySequence();

  const homepageReset = () => {
    setHudArea(COMMUNITIES_MAIN_AREA, FEEDS_AREA);
    sayGreeting();
  };

  return (
    <div className={classes.controlPanel}>
      <Button className={classes.circleInLogoContainer} onClick={() => homepageReset()}>
        <img src={avatarImg} alt="CircleIn Logo" className={classes.circleInLogo} />
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
