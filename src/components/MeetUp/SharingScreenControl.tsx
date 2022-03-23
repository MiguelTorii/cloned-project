/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';

import cx from 'classnames';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { styles } from '../_styles/MeetUp/SharingScreenControl';

type Props = {
  classes: Record<string, any>;
  isSharing: boolean;
  onStopSharing: (...args: Array<any>) => any;
};
type State = {};

class SharingScreenControl extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, isSharing, onStopSharing } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={cx(classes.paper, !isSharing && classes.paperHide)} elevation={1}>
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

export default withStyles(styles as any)(SharingScreenControl);
