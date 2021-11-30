import React from 'react';
import { useStyles } from './HudControlPanelStyles';
import HudMainNavigation from '../navigation/HudMainNavigation';
import HudRightNavigation from '../navigation/HudRightNavigation';

const HudControlPanel = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.controlPanel}>
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
