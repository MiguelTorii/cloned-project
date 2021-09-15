// @flow

import React from 'react';
import withRoot from '../../withRoot';
import { Paper, Typography } from '@material-ui/core';

import { useStyles } from '../_styles/PointsHistoryDetails/StudyStats';

type Props = {
  userId: number
};

const StudyStats = ({ userId }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">Total Study Stats</Typography>
    </Paper>
  );
};

export default withRoot(StudyStats);
