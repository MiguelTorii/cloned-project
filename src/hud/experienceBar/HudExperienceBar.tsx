import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { ExperienceBarState } from '../experienceBarState/hudExperienceBarState';
import { useStyles } from './HudExperienceBarStyles';

const HudExperienceBar = () => {
  const classes: any = useStyles();

  const experienceBarPoints: number = useSelector(
    (state: { hudExperienceBar: ExperienceBarState }) => state.hudExperienceBar.experienceBarPoints
  );

  const experiencePointTotal: number = useSelector(
    (state: { hudExperienceBar: ExperienceBarState }) => state.hudExperienceBar.experienceBarTotal
  );

  const experienceBarPercent = () => {
    if (!experienceBarPoints) {
      return 1;
    }
    return (experienceBarPoints / experiencePointTotal) * 100;
  };

  const experienceBarFillWidth = {
    width: `${experienceBarPercent()}%`
  };

  return (
    <div className={classes.experienceBar}>
      <div style={experienceBarFillWidth} className={classes.experienceFiller}>
        <Typography className={classes.experienceLabel}>
          {experienceBarPoints}/{experiencePointTotal}
        </Typography>
      </div>
    </div>
  );
};

export default HudExperienceBar;
