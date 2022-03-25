import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Tooltip, Typography } from '@material-ui/core';

import { XP_BAR_TOOLTIP } from 'constants/common';

import { apiGetExperiencePoints } from 'api/user';
import AnimateOnChange from 'containers/Wrappers/AnimateOnChange';
import { usePrevious } from 'hooks';
import useStorySequence from 'hud/storyState/useStorySequence';

import { setExperiencePoints } from '../experienceBarState/hudExperienceActions';

import { useStyles } from './HudExperienceBarStyles';

import type { ExperienceState } from '../experienceBarState/hudExperienceState';
import type { UserState } from 'reducers/user';

const HudExperienceBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    apiGetExperiencePoints().then(({ points }) => {
      dispatch(setExperiencePoints(points));
    });
  }, [dispatch]);

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

  if (experiencePoints === null) {
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
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            title={XP_BAR_TOOLTIP}
            placement="top"
            arrow
          >
            <div className={classes.experienceBarTrack} onClick={handleClickExpBar}>
              <div style={experienceBarFillWidth} className={classes.experienceFiller} />
              <div className={classes.experienceLabelContainer}>
                <Typography className={classes.experienceLabel}>
                  MVP: {experiencePoints.toLocaleString()}/{experiencePointTotal.toLocaleString()}
                </Typography>
              </div>
            </div>
          </Tooltip>
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
