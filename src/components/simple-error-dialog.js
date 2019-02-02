// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';

const styles = () => ({});

type ProvidedProps = {
  //   classes: Object
};

type Props = {
  //   classes: Object
  open: boolean,
  title: string,
  body: string,
  handleClose: Function
};

type State = {};

class SimpleErrorDialog extends React.PureComponent<
  ProvidedProps & Props,
  State
> {
  render() {
    const { open, title, body, handleClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {body}
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

export default withRoot(withStyles(styles)(SimpleErrorDialog));
