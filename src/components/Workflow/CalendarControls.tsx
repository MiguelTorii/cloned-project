import React, { useMemo, useCallback, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { useStyles } from '../_styles/Workflow/CalendarControls';

const CalendarControls = ({
  calendar,
  addTask,
  currentCalendarView,
  tasksEmptyDate,
  onOpenEdit
}) => {
  const [api, setApi] = useState(null);
  const [title, setTitle] = useState('');
  const classes: any = useStyles();
  useEffect(() => {
    if (calendar) {
      const api = calendar.getApi();
      setApi(api);
      setTitle(api?.view?.title);
    }
  }, [calendar]);
  const next = useCallback(() => {
    if (api) {
      api.next();
      setTitle(api?.view?.title);
    }
  }, [api]);
  const previous = useCallback(() => {
    if (api) {
      api.prev();
      setTitle(api?.view?.title);
    }
  }, [api]);
  const today = useCallback(() => {
    if (api) {
      api.today();
      setTitle(api?.view?.title);
    }
  }, [api]);
  const todayDisabled = useMemo(() => {
    if (api && title) {
      const now = new Date();
      return api.view.activeStart < now && now < api.view.activeEnd;
    }

    return true;
  }, [api, title]);
  return (
    <Grid className={classes.container} container justifyContent="space-between">
      <Grid item xs={4}>
        <IconButton aria-label="previous" className={classes.iconButton} onClick={previous}>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton aria-label="next" className={classes.iconButton} onClick={next}>
          <ArrowForwardIosIcon />
        </IconButton>
        <Button
          aria-label="today"
          onClick={today}
          className={classes.today}
          color="primary"
          disabled={todayDisabled}
        >
          Today
        </Button>
      </Grid>
      <Grid item xs={4} className={classes.titleContainer}>
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid item xs={4} className={classes.addTask}>
        <Button aria-label="new-task" onClick={addTask} color="primary">
          Add Task
        </Button>
      </Grid>
    </Grid>
  );
};

export default CalendarControls;
