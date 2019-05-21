// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  open: boolean,
  onClose: Function,
  onCreate: Function
};

type State = {};

class Announcements extends React.PureComponent<Props, State> {
  render() {
    const { open, onClose, onCreate } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="announcements-dialog-title"
        aria-describedby="announcements-dialog-description"
      >
        <DialogTitle id="announcements-dialog-title">Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="announcements-dialog-description"
            color="textPrimary"
          >
            Start a group chat with your classmates to let them know about
            upcoming tests, homework, after-school events or really anything you
            can think of.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onCreate} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Announcements;
