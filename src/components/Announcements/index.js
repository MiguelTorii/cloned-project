// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog, { dialogStyle } from '../Dialog';

const styles = () => ({
  dialog: {
    ...dialogStyle,
    width: 500,
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function,
  onCreate: Function
};

type State = {};

class Announcements extends React.PureComponent<Props, State> {
  render() {
    const { classes, open, onClose, onCreate } = this.props;
    return (
      <Dialog
        ariaDescribedBy="circlein-announcements"
        className={classes.dialog}
        okTitle="Create"
        onCancel={onClose}
        onOk={onCreate}
        open={open}
        showActions
        showCancel
        title="Announcement"
      >
        <DialogContentText
          id="circlein-announcements"
          color="textPrimary"
        >
          Start a study hall with your classmates to let them know about
          upcoming tests, homework, after-school events or really anything you
          can think of.
        </DialogContentText>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Announcements);