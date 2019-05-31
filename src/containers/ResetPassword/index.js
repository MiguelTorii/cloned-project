// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import ResetPasswordForm from '../../components/ResetPasswordForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as signInActions from '../../actions/sign-in';
import ErrorBoundary from '../ErrorBoundary';
import { changePassword } from '../../api/sign-in';

const styles = () => ({});

type Props = {
  classes: Object,
  email: string,
  resetToken: string,
  user: UserState,
  signIn: Function,
  updateError: Function,
  clearError: Function
};

type State = {
  password: string,
  loading: boolean
};

class SignIn extends React.Component<Props, State> {
  state = {
    password: '',
    loading: false
  };

  handleChange = (field: string) => (
    // eslint-disable-next-line no-undef
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    const { target } = event;
    // eslint-disable-next-line no-undef
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    this.setState({
      [field]: target.value
    });
  };

  handleSubmit = async () => {
    const { email, resetToken, updateError } = this.props;
    try {
      this.setState({ loading: true });
      const { password } = this.state;
      const success = await changePassword({ email, password, resetToken });
      if (success) this.handleSignIn();
      else {
        updateError({
          title: 'Error Reseting Password',
          body: "We couldn't process your request, please try again"
        });
      }
    } catch (err) {
      console.log(err);
      updateError({
        title: 'Error Reseting Password',
        body: "We couldn't process your request, please try again"
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSignIn = () => {
    const { signIn, email } = this.props;
    const { password } = this.state;
    signIn({ email, password });
  };

  handleErrorDialogClose = () => {
    const { clearError } = this.props;
    clearError();
  };

  render() {
    const { classes, user } = this.props;
    const { password, loading } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body } = errorMessage;

    return (
      <main className={classes.main}>
        <Grid container justify="space-around">
          <Grid item xs={6}>
            <ErrorBoundary>
              <ResetPasswordForm
                password={password}
                loading={isLoading || loading}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
              />
            </ErrorBoundary>
          </Grid>
        </Grid>
        <ErrorBoundary>
          <SimpleErrorDialog
            open={error}
            title={title}
            body={body}
            handleClose={this.handleErrorDialogClose}
          />
        </ErrorBoundary>
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
      updateError: signInActions.updateError,
      clearError: signInActions.clearSignInError
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignIn));
