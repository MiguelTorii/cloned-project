import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { ExperienceState } from '../experienceBarState/hudExperienceState';
import { useStyles } from './HudExperienceBarStyles';

const HudExperienceBar = () => {
  const classes: any = useStyles();

  const experiencePoints: number = useSelector(
    (state: { hudExperience: ExperienceState }) => state.hudExperience.experiencePoints
  );

  const experiencePointTotal: number = useSelector(
    (state: { hudExperience: ExperienceState }) => state.hudExperience.experienceTotal
  );

  const experiencePercent = () => {
    if (!experiencePoints) {
      return 1;
    }
    return (experiencePoints / experiencePointTotal) * 100;
  };

  const experienceBarFillWidth = {
    width: `${experiencePercent()}%`
  };

  return (
    <div className={classes.experienceBarTrack}>
      <div style={experienceBarFillWidth} className={classes.experienceFiller}>
        <Typography className={classes.experienceLabel}>
          {/* todo make this look nicer with commas for the numbers */}
          {experiencePoints.toLocaleString()}/{experiencePointTotal.toLocaleString()}
        </Typography>
      </div>
    </div>
  );
};

export default HudExperienceBar;
