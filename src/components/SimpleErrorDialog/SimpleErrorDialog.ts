// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '../Dialog/Dialog';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import GradientButton from '../Basic/Buttons/GradientButton';
import { styles } from '../_styles/SimpleErrorDialog';

type Props = {
  classes: Object,
  open: boolean,
  title: string,
  body: string,
  showSignup?: boolean,
  handleClose: Function,
  pushTo: Function
};

class SimpleErrorDialog extends React.PureComponent<ProvidedProps & Props, State> {
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
            <TransparentButton className={classes.button} onClick={this.handleSignUp}>
              Sign up
            </TransparentButton>
          )}
          <GradientButton className={classes.button} onClick={handleClose}>
            {showSignup ? 'Try Again' : 'Ok'}
          </GradientButton>
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

export default connect(null, mapDispatchToProps)(withStyles(styles)(SimpleErrorDialog));
