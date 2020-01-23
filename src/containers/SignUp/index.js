/* eslint-disable no-case-declarations */
// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { AuthState } from '../../reducers/auth';
import SignUpForm from '../../components/SignUpForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
// import Steps from '../../components/SignUpForm/Steps';
import TypeSelect from '../../components/SignUpForm/TypeSelect';
import AccountForm from '../../components/SignUpForm/AccountForm';
import VerifyAccount from '../../components/SignUpForm/VerifyAccount';
import ReferralCode from '../../components/SignUpForm/ReferralCode';
import * as signUpActions from '../../actions/sign-up';
import * as authActions from '../../actions/auth';
import { sendCode, verifyCode } from '../../api/sign-up';
import ErrorBoundary from '../ErrorBoundary';
import loginBackground from '../../assets/img/login-background.png';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';

const styles = theme => ({
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
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
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

type ProvidedProps = {
  classes: Object
};

type Props = {
  user: UserState,
  auth: AuthState,
  email: string,
  signUp: Function,
  enqueueSnackbar: Function,
  updateError: Function,
  clearError: Function,
  updateSchool: Function
};

type State = {
  loading: boolean,
  type: string,
  activeStep: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  grade: string | number
};

class SignUp extends React.Component<ProvidedProps & Props, State> {
  state = {
    loading: false,
    type: 'College',
    activeStep: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    grade: ''
  };

  componentDidMount = () => {
    const { email } = this.props;
    this.setState({ email });
  };

  handleTypeChange = type => {
    this.setState({ type });
  };

  handleReset = () => {
    this.setState({ type: '' });
  };

  handleSubmit = async formData => {
    const { action, data } = formData;
    const { type, firstName, lastName, email, password, grade } = this.state;
    const {
      auth: {
        data: { school }
      },
      signUp
    } = this.props;
    switch (action) {
    case 'Account':
      this.setState({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        password: data.password || '',
        grade: data.grade || '',
        loading: true
      });
      try {
        await sendCode({ email: data.email });
        this.setState({ activeStep: 1 });
      } finally {
        this.setState({ loading: false });
      }
      break;
    case 'VerifyAccount':
      this.setState({ loading: true });
      try {
        await verifyCode({ email: data.email, code: data.code });
        this.setState({ activeStep: 2 });
      } catch (err) {
        const { updateError } = this.props;
        updateError({
          title: 'Verification Error',
          body: "We couldn't verify your code, please try again."
        });
      } finally {
        this.setState({ loading: false });
      }
      break;
    case 'ReferralCode':
      try {
        this.setState({ loading: true });
        await signUp({
          grade,
          school: school && school.id,
          firstName,
          lastName,
          password,
          email,
          phone: '',
          segment: type,
          referralCode: data.code
        });
      } catch (err) {
        this.setState({ loading: false });
      }
      break;
    default:
      break;
    }
  };

  handleBack = () => {
    this.setState(({ activeStep }) => ({ activeStep: activeStep - 1 }));
  };

  handleResendCode = email => {
    const { enqueueSnackbar, classes } = this.props;
    enqueueSnackbar(`New code sent to ${email}`, {
      variant: 'success',
      ContentProps: {
        classes: {
          root: classes.stackbar
        }
      }
    });
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
      },
      email: propsEmail
    } = this.props;
    const { type, activeStep, loading, email } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body } = errorMessage;

    if (!school) return <Redirect to="/auth" />;
    const { emailDomain, emailRestriction } = school;

    return (
      <main className={classes.main}>
        <Grid container justify="space-around">
          <Grid item xs={12} lg={6} className={classes.grid}>
            <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
            <ErrorBoundary>
              <SignUpForm onChangeSchool={this.handleChangeSchool}>
                <Typography component="h1" variant="h5">
                  {activeStep === 2 ? 'Did a friend refer you?' : 'Create your CircleIn Account'}
                </Typography>
                {/* <Steps activeStep={activeStep} hide={Boolean(type === '')} /> */}
                <TypeSelect
                  onTypeChange={this.handleTypeChange}
                  hide={Boolean(type !== '')}
                />
                <AccountForm
                  type={type}
                  loading={isLoading || loading}
                  hide={Boolean(type === '' || activeStep !== 0)}
                  email={propsEmail}
                  emailDomain={emailDomain}
                  emailRestriction={emailRestriction}
                  onSubmit={this.handleSubmit}
                />
                <VerifyAccount
                  email={email}
                  loading={isLoading || loading}
                  hide={Boolean(type === '' || activeStep !== 1)}
                  onBack={this.handleBack}
                  onResend={this.handleResendCode}
                  onSubmit={this.handleSubmit}
                />
                <ReferralCode
                  loading={isLoading || loading}
                  hide={Boolean(type === '' || activeStep !== 2)}
                  onBack={this.handleBack}
                  onSubmit={this.handleSubmit}
                />
              </SignUpForm>
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

const mapStateToProps = ({ user, auth }: StoreState): {} => ({
  user,
  auth
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      signUp: signUpActions.signUp,
      updateError: signUpActions.updateError,
      clearError: signUpActions.clearSignUpError,
      updateSchool: authActions.updateSchool
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(withStyles(styles)(SignUp)));
