// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({});

type ProvidedProps = {
  //   classes: Object
};

type Props = {
  //   classes: Object
  open: boolean,
  handleClose: Function
};

type State = {};

class ShareDialog extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const { open, handleClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
      >
        <DialogTitle id="share-dialog-title">Share this Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="share-dialog-description">
            Copy this link and send it to your friends.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShareDialog);
