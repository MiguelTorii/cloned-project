import React from 'react';
import MiniWorkflows from '../../containers/MiniWorkflows/MiniWorkflows';
import { useStyles } from './HudMissionsStyles';

const HudMissions = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.container}>
      <MiniWorkflows />
      Next missions and opportunities go here.
    </div>
  );
};

export default HudMissions;
