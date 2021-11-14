import React from 'react';
import { useStyles } from './HudExperienceBarStyles';

const HudExperienceBar = () => {
  const classes: any = useStyles();

  return <div className={classes.experienceBar}>Experience bar goes here.</div>;
};

export default HudExperienceBar;
