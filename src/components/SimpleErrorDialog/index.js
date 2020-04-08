// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog, { dialogStyle } from '../Dialog';

const styles = () => ({
  button: {
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: '14px',
    margin: 10,
    padding: '9px 18px',
    width: 120,
  },
  buttons: {
    display: 'flex',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  dialog: {
    ...dialogStyle,
    width: 500
  }
});

type Props = {
  classes: Object,
  open: boolean,
  title: string,
  body: string,
  showSignup?: boolean,
  handleClose: Function,
  pushTo: Function
};

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
    const { open, classes, title, body, showSignup, handleClose } = this.props;
    return (
      <Dialog
        ariaDescribedBy="alert-dialog-description"
        className={classes.dialog}
        onCancel={handleClose}
        open={open}
        title={title}
      >
        <Typography color="textPrimary" id="alert-dialog-description">
          {body}
        </Typography>
        <div className={classes.buttons}>
          {showSignup && (
            <Button
              className={classes.button}
              color="primary"
              onClick={this.handleSignUp}
              variant="outlined"
            >
              Sign up
            </Button>
          )}
          <Button
            className={classes.button}
            color="primary"
            onClick={handleClose}
            variant="contained"
          >
            {showSignup ? 'Try Again' : 'Ok'}
          </Button>
        </div>
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
