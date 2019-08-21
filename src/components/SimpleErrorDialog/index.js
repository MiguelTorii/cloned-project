// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import withStyles from '@material-ui/core/styles/withStyles';
import DialogTitle from '../DialogTitle';

const styles = () => ({});

type ProvidedProps = {
  //   classes: Object
};

type Props = {
  //   classes: Object
  open: boolean,
  title: string,
  body: string,
  showSignup?: boolean,
  handleClose: Function,
  pushTo: Function
};

type State = {};

class SimpleErrorDialog extends React.PureComponent<
  ProvidedProps & Props,
  State
> {
  static defaultProps = {
    showSignup: false
  };

  handleSignUp = () => {
    const { handleClose, pushTo } = this.props;
    handleClose();
    pushTo('/signup');
  };

  render() {
    const { open, title, body, showSignup, handleClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="textPrimary" id="alert-dialog-description">
            {body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {showSignup && (
            <Button
              variant="outlined"
              onClick={this.handleSignUp}
              color="primary"
              autoFocus
            >
              Sign up
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleClose}
            color="primary"
            autoFocus
          >
            {showSignup ? 'Try Again' : 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(SimpleErrorDialog));
