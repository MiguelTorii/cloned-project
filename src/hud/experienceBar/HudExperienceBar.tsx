import { Typography } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ExperienceState } from '../experienceBarState/hudExperienceState';
import { useStyles } from './HudExperienceBarStyles';
import { apiGetExperiencePoints } from '../../api/user';
import usePrevious from 'hooks/usePrevious';
import AnimateOnChange from 'containers/Wrappers/AnimateOnChange';
import { setExperiencePoints } from '../experienceBarState/hudExperienceActions';
import { UserState } from '../../reducers/user';
import { AppState } from 'redux/store';
import useStorySequence from 'hud/storyState/useStorySequence';

const HudExperienceBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const showExpBar = useSelector<AppState, boolean>(
    (state) => state.campaign.showScholarshipTracker
  );
  const history = useHistory();

  const fetchPoints = useCallback(() => {
    apiGetExperiencePoints().then(({ points }) => {
      dispatch(setExperiencePoints(points));
    });
  }, [dispatch]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const { closeStory } = useStorySequence();

  const experiencePoints: number = useSelector(
    (state: { hudExperience: ExperienceState }) => state.hudExperience.experiencePoints
  );

  const previousExperiencePoints = usePrevious(experiencePoints);

  const difference = previousExperiencePoints ? experiencePoints - previousExperiencePoints : 0;

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

  const handleClickExpBar = () => {
    history.push(`/leaderboard?tab=grand`);
  };

  if (experiencePoints === null || !showExpBar) {
    return null;
  }

  const handleAnimationStart = () => {
    closeStory();
  };

  return (
    <>
      {!isExpertMode ? (
        <div className={classes.root}>
          <AnimateOnChange
            animationStyles={classes.experienceBarNotificationAnimation}
            className={classes.experienceBarNotificationWrapper}
            handleAnimationStart={handleAnimationStart}
            current={experiencePoints}
            previous={previousExperiencePoints}
          >
            <h3 className={classes.notificationText}>+ {difference} points!</h3>
          </AnimateOnChange>
          <div className={classes.experienceBarTrack} onClick={handleClickExpBar}>
            <div style={experienceBarFillWidth} className={classes.experienceFiller} />
            <div className={classes.experienceLabelContainer}>
              <Typography className={classes.experienceLabel}>
                MVP: {experiencePoints.toLocaleString()}/{experiencePointTotal.toLocaleString()}
              </Typography>
            </div>
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
