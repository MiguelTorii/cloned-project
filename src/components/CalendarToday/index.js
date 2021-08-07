import React, { useMemo } from 'react';
import { Box, Typography } from '@material-ui/core';
import moment from 'moment';

import useStyles from './styles';

const CalendarToday = () => {
  const classes = useStyles();
  const today = useMemo(() => moment(), []);

  return (
    <Box className={classes.root}>
      <Box className={classes.monthBox}>
        <Typography className={classes.monthText}>
          {today.format('MMMM')}
        </Typography>
      </Box>
      <Box
        className={classes.dayBox}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography className={classes.dayText}>
          {today.format('DD')}
        </Typography>
        <Typography className={classes.weekDayText}>
          {today.format('dddd')}
        </Typography>
      </Box>
    </Box>
  );
};

export default CalendarToday;
