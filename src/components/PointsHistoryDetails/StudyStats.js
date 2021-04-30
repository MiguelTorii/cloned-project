import React from 'react';
import withRoot from '../../withRoot';
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}));

type Props = {
  userId: number
};

const StudyStats = ({ userId }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">
        Total Study Stats
      </Typography>
    </Paper>
  );
};

export default withRoot(StudyStats);
