import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';

import clsx from 'clsx';
import useStyles from './styles';

const StudyGoalProgress = ({ title, content, value, total }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={1} direction="column" alignItems="center">
      <Grid item>
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid item>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={100}
            size={72}
            thickness={3}
            color="inherit"
            className={classes.progressBorder}
          />
          <Box top={0} left={0} position="absolute">
            <CircularProgress
              variant="determinate"
              value={_.min([(value * 100) / total, 100])}
              size={72}
              thickness={3}
            />
          </Box>
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {content}
          </Box>
        </Box>
      </Grid>
      <Grid item>
        <Typography className={clsx(classes.progress, value >= total && classes.completed)}>
          {value}/{total}
          {value >= total && ' ⭐️'}
        </Typography>
      </Grid>
    </Grid>
  );
};

StudyGoalProgress.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  value: PropTypes.number,
  total: PropTypes.number
};

StudyGoalProgress.defaultProps = {
  value: 0,
  total: 3
};

export default StudyGoalProgress;
