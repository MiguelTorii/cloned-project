import React from 'react';
import withRoot from '../../withRoot';
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}));

type Props = {
  userId: number,
  isMyProfile: boolean,
  displayName: string
};

const PointsReport = ({ userId, isMyProfile, displayName }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">
        { isMyProfile ? 'Your' : `${displayName}'s` } Points Report
      </Typography>
    </Paper>
  );
};

export default withRoot(PointsReport);
