import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import * as signInActions from 'actions/sign-in';
import { changePassword } from 'api/sign-in';
import ResetPasswordForm from 'components/ResetPasswordForm/ResetPasswordForm';
import SimpleErrorDialog from 'components/SimpleErrorDialog/SimpleErrorDialog';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

const styles = () => ({});

type Props = {
  classes?: Record<string, any>;
  email: string;
  resetToken: string;
  user?: UserState;
  signIn?: (...args: Array<any>) => any;
  updateError?: (...args: Array<any>) => any;
  clearError?: (...args: Array<any>) => any;
};
type State = {
  password: string;
  loading: boolean;
};

class SignIn extends React.Component<Props, State> {
  state = {
    password: '',
    loading: false
  };

  handleChange = (field: string) => (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { target } = event;

    // eslint-disable-next-line no-undef
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.setState({
      [field]: target.value
    } as any);
  };

  handleSubmit = async () => {
    const { email, resetToken, updateError } = this.props;

    try {
      this.setState({
        loading: true
      });
      const { password } = this.state;
      const success = await changePassword({
        email,
        password,
        resetToken
      });

      if (success) {
        this.handleSignIn();
      } else {
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
      this.setState({
        loading: false
      });
    }
  };

  handleSignIn = () => {
    const { signIn, email } = this.props;
    const { password } = this.state;
    signIn({
      email,
      password
    });
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
        <Grid container justifyContent="space-around">
          <Grid item xs={12} sm={6}>
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

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      signIn: signInActions.signIn,
      updateError: signInActions.updateError,
      clearError: signInActions.clearSignInError
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(SignIn));
