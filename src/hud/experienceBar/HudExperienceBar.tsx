import { Typography } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExperienceState } from '../experienceBarState/hudExperienceState';
import { useStyles } from './HudExperienceBarStyles';
import { apiGetExperiencePoints } from '../../api/user';
import { setIntervalWithFirstCall } from '../../utils/helpers';
import { FETCH_POINTS_INTERVAL } from '../../constants/common';
import { setExperiencePoints } from '../experienceBarState/hudExperienceActions';
import { UserState } from '../../reducers/user';

const HudExperienceBar = () => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const fetchPoints = useCallback(() => {
    apiGetExperiencePoints().then(({ points }) => {
      dispatch(setExperiencePoints(points));
    });
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setIntervalWithFirstCall(fetchPoints, FETCH_POINTS_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchPoints]);

  const experiencePoints: number = useSelector(
    (state: { hudExperience: ExperienceState }) => state.hudExperience.experiencePoints
  );

  const isExpertMode: boolean = useSelector((state: { user: UserState }) => state.user.expertMode);

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

  if (experiencePoints === null) {
    return null;
  }

  return (
    <>
      {!isExpertMode ? (
        <div className={classes.experienceBarTrack}>
          <div style={experienceBarFillWidth} className={classes.experienceFiller}>
            <Typography className={classes.experienceLabel}>
              {experiencePoints.toLocaleString()}/{experiencePointTotal.toLocaleString()}
            </Typography>
          </div>
        </div>
      ) : (
        <div className={classes.expertModeBox}>
          <div className={classes.expertModeText}>Expert Mode</div>
        </div>
      )}
    </>
  );
};

export default HudExperienceBar;
