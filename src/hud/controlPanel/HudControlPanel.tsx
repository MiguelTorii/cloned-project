import React from 'react';
import { Avatar, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useStyles } from './HudControlPanelStyles';
import HudMainNavigation from '../navigation/HudMainNavigation';
import HudRightNavigation from '../navigation/HudRightNavigation';
import avatarImg from '../../assets/img/circlein-web-notification.png';
import useHudRoutes from '../frame/useHudRoutes';
import { COMMUNITIES_MAIN_AREA, FEEDS_AREA } from '../navigationState/hudNavigation';
import useStorySequence from '../storyState/useStorySequence';
import { restartInitialLoad as restartInitialStoryLoad } from '../storyState/hudStoryActions';

const HudControlPanel = () => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const setHudArea = useHudRoutes();

  const reloadStory = useStorySequence();

  const homepageReset = () => {
    setHudArea(COMMUNITIES_MAIN_AREA, FEEDS_AREA);
    dispatch(restartInitialStoryLoad());
    reloadStory();
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
