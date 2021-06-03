import React, { useCallback, useEffect, useState } from 'react';
import withRoot from 'withRoot';
import useStyles from './styles';
import Typography from '@material-ui/core/Typography';
import IconTimer from '@material-ui/icons/Timer';
import Box from '@material-ui/core/Box';
import { INTERVAL } from 'constants/app';
import clsx from 'clsx';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import TransparentButton from 'components/Basic/Buttons/TransparentButton';
import { twoDigitsNumber } from 'utils/helpers';
import Button from '@material-ui/core/Button';
import NumberSelector from 'components/Timer/NumberSelector';
import PropTypes from 'prop-types';

export const TIMER_STATUS = {
  INITIALIZED: 'initialized',
  STARTED: 'started',
  PAUSED: 'paused'
}

const Timer = ({ defaultStatus }) => {
  const classes = useStyles();
  const [status, setStatus] = useState(TIMER_STATUS.INITIALIZED);
  const [currentSeconds, setCurrentSeconds] = useState(null);
  const [initialHours, setInitialHours] = useState(1);
  const [initialMinutes, setInitialMinutes] = useState(0);

  // Event Handlers

  const handleStartTimer = useCallback(() => {
    setCurrentSeconds(initialHours * 3600 + initialMinutes * 60);
    setStatus(TIMER_STATUS.STARTED);
  }, [initialHours, initialMinutes]);

  const handleResetTimer = useCallback(() => {
    setStatus(TIMER_STATUS.INITIALIZED);
  }, []);

  const handlePauseTimer = useCallback(() => {
    setStatus(TIMER_STATUS.PAUSED);
  }, []);

  const handleResumeTimer = useCallback(() => {
    setStatus(TIMER_STATUS.STARTED);
  }, []);

  // Effects
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status === TIMER_STATUS.STARTED) {
        setCurrentSeconds((seconds) => seconds > 0 ? (seconds - 1) : seconds);
      }
    }, INTERVAL.SECOND);
    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (defaultStatus === TIMER_STATUS.PAUSED && currentSeconds === 0) return ;
    if (defaultStatus === TIMER_STATUS.STARTED) {
      setCurrentSeconds(initialHours * 3600 + initialMinutes * 60);
    }
    setStatus(defaultStatus);
  }, [defaultStatus, initialHours, initialMinutes, currentSeconds]);

  // Rendering Helpers
  const renderTimeBox = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        className={clsx(classes.timerBox, status !== TIMER_STATUS.STARTED && 'hand' )}
      >
        <Box mr={1/2}>
          {status === TIMER_STATUS.INITIALIZED ? (
            <NumberSelector value={initialHours} limit={9} onChange={setInitialHours} />
          ) : (
            <Typography variant="h4">
              { twoDigitsNumber(Math.floor(currentSeconds / 3600)) }
            </Typography>
          )}
        </Box>
        <Box mr={2}>
          <Typography>h</Typography>
        </Box>
        <Box mr={1/2}>
          {status === TIMER_STATUS.INITIALIZED ? (
            <NumberSelector limit={59} onChange={setInitialMinutes} value={initialMinutes} />
          ) : (
            <Typography variant="h4">
              { twoDigitsNumber(Math.floor(currentSeconds / 60) % 60) }
            </Typography>
          )}
        </Box>
        <Box mr={2}>
          <Typography>m</Typography>
        </Box>
        <Box mr={1/2}>
          <Typography variant="h4">
            { twoDigitsNumber(
              status === TIMER_STATUS.INITIALIZED
                ? 0
                : Math.floor(currentSeconds % 60)
              )
            }
          </Typography>
        </Box>
        <Typography>s</Typography>
      </Box>
    );
  };

  return (
    <div className={classes.root}>
      <Box display="flex" alignItems="center" mb={3}>
        <Box mr={1}>
          <IconTimer />
        </Box>
        <Typography variant="h6">
          Set a timer
        </Typography>
      </Box>
      { renderTimeBox() }
      <Box display="flex" justifyContent="space-between">
        {TIMER_STATUS.INITIALIZED === status && (
          <GradientButton compact onClick={handleStartTimer}>
            Start
          </GradientButton>
        )}
        {TIMER_STATUS.STARTED === status && currentSeconds > 0 && (
          <TransparentButton compact onClick={handlePauseTimer}>
            Pause
          </TransparentButton>
        )}
        {TIMER_STATUS.STARTED === status && currentSeconds === 0 && (
          <Button className={classes.timeupButton} disabled>
            Time's Up
          </Button>
        )}
        {TIMER_STATUS.PAUSED === status && (
          <GradientButton compact onClick={handleResumeTimer}>
            Resume
          </GradientButton>
        )}
        <TransparentButton compact onClick={handleResetTimer}>
          Reset
        </TransparentButton>
      </Box>
    </div>
  );
};

Timer.propTypes = {
  defaultStatus: PropTypes.string
};

Timer.defaultProps = {
  defaultStatus: TIMER_STATUS.INITIALIZED
};

export default withRoot(Timer);
