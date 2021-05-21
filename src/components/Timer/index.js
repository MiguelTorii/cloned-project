import React, { useCallback, useEffect, useMemo, useState } from 'react';
import withRoot from 'withRoot';
import useStyles from './styles';
import Typography from '@material-ui/core/Typography';
import IconTimer from '@material-ui/icons/Timer';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import { TimePicker } from '@material-ui/pickers';
import { INTERVAL } from 'constants/app';
import Hidden from '@material-ui/core/Hidden';
import clsx from 'clsx';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import TransparentButton from 'components/Basic/Buttons/TransparentButton';
import { twoDigitsNumber } from 'utils/helpers';
import Button from '@material-ui/core/Button';

const TIMER_STATUS = {
  INITIALIZED: 'initialized',
  STARTED: 'started',
  PAUSED: 'paused'
}

const TimePickerWithRef = React.forwardRef(
  (props, ref) => <TimePicker innerRef={ref} {...props} />
);

const Timer = () => {
  const classes = useStyles();
  const [initialSeconds, setInitialSeconds] = useState(3600);
  const [currentSeconds, setCurrentSeconds] = useState(null);
  const [timerStatus, setTimerStatus] = useState(TIMER_STATUS.INITIALIZED);
  const [timePickerRef, setTimePickerRef] = useState(null);

  // Memos
  const pickerMoment = useMemo(() => {
    return moment().set({
      'hour': Math.floor(initialSeconds / 3600),
      'minute': Math.floor(initialSeconds / 60) % 60,
      'second': initialSeconds % 60
    });
  }, [initialSeconds]);

  // Event Handlers
  const handlePickTime = useCallback((date) => {
    setTimerStatus(TIMER_STATUS.INITIALIZED);
    setInitialSeconds(
      date.get('hour') * 3600 +
      date.get('minute') * 60 +
      date.get('second')
    );
  }, []);

  const handleTimeBoxClick = useCallback(() => {
    if (timePickerRef && timerStatus !== TIMER_STATUS.STARTED) {
      timePickerRef.click();
    }
  }, [timePickerRef, timerStatus]);

  const handleStartTimer = useCallback(() => {
    setCurrentSeconds(initialSeconds);
    setTimerStatus(TIMER_STATUS.STARTED);
  }, [initialSeconds]);

  const handleResetTimer = useCallback(() => {
    setTimerStatus(TIMER_STATUS.INITIALIZED);
  }, []);

  const handlePauseTimer = useCallback(() => {
    setTimerStatus(TIMER_STATUS.PAUSED);
  }, []);

  const handleResumeTimer = useCallback(() => {
    setTimerStatus(TIMER_STATUS.STARTED);
  }, []);

  // Effects
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timerStatus === TIMER_STATUS.STARTED) {
        setCurrentSeconds((seconds) => seconds > 0 ? (seconds - 1) : seconds);
      }
    }, INTERVAL.SECOND);
    return () => clearInterval(intervalId);
  }, [timerStatus]);

  // Rendering Helpers
  const renderTimeBox = () => {
    const seconds = timerStatus === TIMER_STATUS.INITIALIZED ? initialSeconds : currentSeconds;

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        className={clsx(classes.timerBox, timerStatus !== TIMER_STATUS.STARTED && 'hand' )}
        onClick={handleTimeBoxClick}
      >
        <Box mr={1/2}>
          <Typography variant="h4">
            { Math.floor(seconds / 3600) }
          </Typography>
        </Box>
        <Box mr={2}>
          <Typography>h</Typography>
        </Box>
        <Box mr={1/2}>
          <Typography variant="h4">
            { twoDigitsNumber(Math.floor(seconds / 60) % 60) }
          </Typography>
        </Box>
        <Box mr={2}>
          <Typography>m</Typography>
        </Box>
        <Box mr={1/2}>
          <Typography variant="h4">
            { twoDigitsNumber(Math.floor(seconds % 60)) }
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
      <Hidden xsUp implementation="css">
        <TimePickerWithRef
          ref={setTimePickerRef}
          value={pickerMoment}
          disableToolbar
          onChange={handlePickTime}
          ampm={false}
        />
      </Hidden>
      { renderTimeBox() }
      <Box display="flex" justifyContent="space-between">
        {TIMER_STATUS.INITIALIZED === timerStatus && (
          <GradientButton compact onClick={handleStartTimer}>
            Start
          </GradientButton>
        )}
        {TIMER_STATUS.STARTED === timerStatus && currentSeconds > 0 && (
          <GradientButton compact onClick={handlePauseTimer}>
            Pause
          </GradientButton>
        )}
        {TIMER_STATUS.STARTED === timerStatus && currentSeconds === 0 && (
          <Button className={classes.timeupButton} disabled>
            Time's Up
          </Button>
        )}
        {TIMER_STATUS.PAUSED === timerStatus && (
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

export default withRoot(Timer);
