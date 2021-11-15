import React from 'react';
import { Box } from '@material-ui/core';
import MiniWorkflows from '../../containers/MiniWorkflows/MiniWorkflows';
import { useStyles } from './HudMissionsStyles';
import CalendarToday from '../../components/CalendarToday/CalendarToday';

const HudMissions = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.calendarContainer}>
        <CalendarToday />
      </div>
      <MiniWorkflows />
      Next missions and opportunities go here.
    </div>
  );
};

export default HudMissions;
