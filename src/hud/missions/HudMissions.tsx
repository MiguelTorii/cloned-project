import React from 'react';
import { useSelector } from 'react-redux';
import MiniWorkflows from '../../containers/MiniWorkflows/MiniWorkflows';
import { useStyles } from './HudMissionsStyles';
import CalendarToday from '../../components/CalendarToday/CalendarToday';
import { BOTTOM_RIGHT_SIDE_AREA, TOP_RIGHT_SIDE_AREA } from '../navigationState/hudNavigation';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const HudMissions = () => {
  const classes: any = useStyles();

  const isTopVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[TOP_RIGHT_SIDE_AREA]
  );

  const isBottomVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[BOTTOM_RIGHT_SIDE_AREA]
  );

  return (
    <div className={classes.container}>
      {isTopVisible && <MiniWorkflows />}

      {isBottomVisible && <div />}
    </div>
  );
};

export default HudMissions;
