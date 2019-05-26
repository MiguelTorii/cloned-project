// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import FederatedLogin from '../FederatedLogin';
import SignInForm from '../../components/SignInForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as signInActions from '../../actions/sign-in';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({});

type Props = {
  classes: Object,
  user: UserState,
  signIn: Function,
  clearError: Function
};

type State = {
  email: string,
  password: string
};

class SignIn extends React.Component<Props, State> {
  state = {
    email: '',
    password: ''
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
        <Grid container justify="space-around">
          <Grid item lg={6}>
            <ErrorBoundary>
              <SignInForm
                email={email}
                password={password}
                loading={isLoading}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
            </ErrorBoundary>
          </Grid>
          <Grid item lg={6}>
            <ErrorBoundary>
              <FederatedLogin />
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
      clearError: signInActions.clearSignInError
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignIn));
