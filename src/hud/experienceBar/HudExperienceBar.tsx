import React from 'react';
import { useStyles } from './HudExperienceBarStyles';

const HudExperienceBar = () => {
  const classes: any = useStyles();

  const experienceBarPoints: number = useSelector(
    (state: { experienceBarPoints: ExperienceBarState }) =>
      state.experienceBarPoints.data.experienceBarPoints
  );

  const experienceBarPercent = () => {
    if (!experienceBarPoints) {
      return 1;
    }
    return experienceBarPoints / experiencePointTotal;
  };

  return <div>{experienceBarPercent}</div>;

  return <div className={classes.experienceBar}>Experience bar goes here.</div>;
};

export default HudExperienceBar;
