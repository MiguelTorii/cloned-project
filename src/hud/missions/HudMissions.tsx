import React from 'react';
import { useSelector } from 'react-redux';
import MiniWorkflows from '../../containers/MiniWorkflows/MiniWorkflows';
import { useStyles } from './HudMissionsStyles';
import { RIGHT_SIDE_AREA } from '../navigationState/hudNavigation';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const HudMissions = () => {
  const classes: any = useStyles();

  const isVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  return (
    <div className={classes.container}>
      <MiniWorkflows />
    </div>
  );
};

export default HudMissions;
