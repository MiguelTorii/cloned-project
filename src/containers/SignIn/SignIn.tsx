// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import SignInForm from '../../components/SignInForm/SignInForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog/SimpleErrorDialog';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { AuthState } from '../../reducers/auth';
import * as signInActions from '../../actions/sign-in';
import * as authActions from '../../actions/auth';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import loginBackground from '../../assets/img/login-background.png';
import * as signInApi from '../../api/sign-in';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';

const styles = (theme) => ({
  main: {
    minHeight: '100vh',
    backgroundImage: `url(${loginBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0',
    '-ms-background-size': 'cover',
    '-o-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-webkit-background-size': 'cover',
    backgroundSize: 'cover'
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  logo: {
    marginTop: theme.spacing(8)
  }
});

type Props = {
  classes: Object,
  user: UserState,
  auth: AuthState,
  signIn: Function,
  clearError: Function,
  updateSchool: Function,
  pushTo: Function
};

type State = {
  email: string,
  password: string,
  isVerified: boolean
};

class SignIn extends React.Component<Props, State> {
  state = {
    email: '',
    password: '',
    isVerified: false
  };

  handleChange =
    (field: string) =>
    (
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
    const {
      auth: {
        data: { school }
      },
      signIn,
      pushTo
    } = this.props;
    const { isVerified, email, password } = this.state;
    if (!isVerified) {
      const exists = await signInApi.verifyEmail({ email });
      if (exists) {
        this.setState({ isVerified: true });
      } else {
        pushTo(`/signup?email=${encodeURIComponent(email)}`);
      }
    } else {
      if (!school) {
        return;
      }
      const { id } = school;
      signIn({ email, password, schoolId: id });
    }
  };

  handleErrorDialogClose = () => {
    const { clearError } = this.props;
    clearError();
  };

  handleChangeSchool = () => {
    const { updateSchool } = this.props;
    updateSchool({ school: null });
  };

  render() {
    const {
      classes,
      user,
      auth: {
        data: { school }
      }
    } = this.props;
    const { email, password, isVerified } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body, showSignup } = errorMessage;

    if (!school) {
      return <Redirect to="/auth" />;
    }

    return (
      <main className={classes.main}>
        <Grid container justifyContent="space-around">
          <Grid item xs={12} lg={6} className={classes.grid}>
            <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
            <ErrorBoundary>
              <SignInForm
                email={email}
                password={password}
                isVerified={isVerified}
                loading={isLoading}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                onChangeSchool={this.handleChangeSchool}
              />
            </ErrorBoundary>
          </Grid>
        </Grid>
        <ErrorBoundary>
          <SimpleErrorDialog
            open={error}
            title={title}
            body={body}
            showSignup={showSignup}
            handleClose={this.handleErrorDialogClose}
          />
        </ErrorBoundary>
      </main>
    );
  }
}

const mapStateToProps = ({ user, auth }: StoreState): {} => ({
  user,
  auth
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      signIn: signInActions.signIn,
      clearError: signInActions.clearSignInError,
      updateSchool: authActions.updateSchool,
      pushTo: push
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignIn));
