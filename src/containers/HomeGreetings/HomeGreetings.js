import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import { useSelector } from 'react-redux';

import useStyles from './styles';
import CalendarToday from '../../components/CalendarToday/CalendarToday';
import { fetchGreetings } from '../../api/home';

const HomeGreetings = () => {
  const classes = useStyles();
  const me = useSelector((state) => state.user.data);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchGreetings(moment().format('YYYY-MM-DDThh:mm:ss'))
      .then((rsp) => {
        setData(rsp.greetings);
      });
  }, []);

  const greetingData = useMemo(() => {
    if (!data) return <Box />;
    return (
      <Box mr={2}>
        <Typography variant="h6" className={classes.greetingTitle} paragraph>
          {data.title}
        </Typography>
        <Typography className={classes.quote} paragraph>
          {data.body}
        </Typography>
      </Box>
    );
  }, [me, data, classes]);

  return (
    <Paper elevation={0} className={classes.root} square={false}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {greetingData}
        <CalendarToday />
      </Box>
    </Paper>
  );
};

export default HomeGreetings;
