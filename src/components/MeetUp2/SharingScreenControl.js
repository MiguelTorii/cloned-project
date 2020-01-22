/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1400
  },
  paper: {
    position: 'relative',
    // backgroundColor: 'white',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  paperHide: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  isSharing: boolean,
  onStopSharing: Function
};

type State = {};

class SharingScreenControl extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, isSharing, onStopSharing } = this.props;

    return (
      <div className={classes.root}>
        <Paper
          className={cx(classes.paper, !isSharing && classes.paperHide)}
          elevation={1}
        >
          <Typography variant="h5" align="center" paragraph>
            You are sharing your screen
          </Typography>
          <Button variant="contained" color="primary" onClick={onStopSharing}>
            Stop Sharing
          </Button>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SharingScreenControl);
