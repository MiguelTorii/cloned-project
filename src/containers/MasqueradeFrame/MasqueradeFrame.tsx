import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, Grid, Typography, Button, Box } from '@material-ui/core';
import { DesktopMac, Stop } from '@material-ui/icons';

import { signOut } from 'actions/sign-in';
import withRoot from 'withRoot';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    border: 'solid 6px #7572F7',
    pointerEvents: 'none',
    zIndex: 3000,
    opacity: '90%'
  },
  header: {
    width: 400,
    maxWidth: '100%',
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.spacing(0, 0, 1, 1),
    backgroundColor: '#7572F7',
    opacity: '90%'
  },
  stopButton: {
    backgroundColor: '#D74244',
    borderRadius: theme.spacing(1),
    pointerEvents: 'all'
  },
  text: {
    marginLeft: theme.spacing(1)
  }
}));

const MasqueradeFrame = () => {
  const classes: any = useStyles();
  const userData = useSelector((state) => (state as any).user.data);
  const dispatch = useDispatch();
  // Whenever userData is updated, the component is re-rendered that the value from the storage is always updated.
  const isMasquerade = useSelector((state) => (state as any).user.isMasquerading);

  const handleStop = () => {
    dispatch(signOut());
  };

  if (!isMasquerade || !userData.email) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Box display="flex" alignItems="center">
              <DesktopMac fontSize="small" />
              <Typography variant="body2" className={classes.text}>
                You are currently acting as {`${userData.firstName} ${userData.lastName}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button
              classes={{
                root: classes.stopButton
              }}
              size="small"
              startIcon={<Stop />}
              onClick={handleStop}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default withRoot(MasqueradeFrame);
