// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';
import SignInForm from '../components/sign-in-form';
import SimpleErrorDialog from '../components/simple-error-dialog';
import type { State as StoreState } from '../types/state';
import * as signInActions from '../actions/sign-in';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  signIn: Function,
  clearError: Function
};

type State = {
  email: String,
  password: String
};

class SignIn extends React.Component<ProvidedProps & Props, State> {
  state = {
    email: '',
    password: ''
  };

  handleChange = (field: string) => (event: string) => {
    this.setState({
      [field]: event.target.value
    });
  };

  handleSubmit = () => {
    const { signIn } = this.props;
    signIn(this.state);
  };

  handleErrorDialogClose = () => {
    const { clearError } = this.props;
    clearError();
  };

  render() {
    const { classes, user } = this.props;
    const { email, password } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body } = errorMessage;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <SignInForm
          email={email}
          password={password}
          loading={isLoading}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <SimpleErrorDialog
          open={error}
          title={title}
          body={body}
          handleClose={this.handleErrorDialogClose}
        />
      </main>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      signIn: signInActions.signIn,
      clearError: signInActions.clearSignInError
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(SignIn)));
