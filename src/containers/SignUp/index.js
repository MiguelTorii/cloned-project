// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { AuthState } from '../../reducers/auth';
import SignUpForm from '../../components/SignUpForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import Steps from '../../components/SignUpForm/Steps';
import TypeSelect from '../../components/SignUpForm/TypeSelect';
import AccountForm from '../../components/SignUpForm/AccountForm';
import VerifyAccount from '../../components/SignUpForm/VerifyAccount';
// import ProfileSetup from '../../components/SignUpForm/ProfileSetup';
import * as signUpActions from '../../actions/sign-up';
import * as authActions from '../../actions/auth';
import {
  // fetchSchools,
  sendCode,
  verifyCode
} from '../../api/sign-up';
// import { getLMSSchools } from '../../api/lms';
import ErrorBoundary from '../ErrorBoundary';
import loginBackground from '../../assets/img/login-background.png';
import logo from '../../assets/svg/circlein_logo_beta.svg';

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
    marginTop: theme.spacing.unit * 8
  }
});

// const schools = {};

type ProvidedProps = {
  classes: Object
};

type Props = {
  user: UserState,
  auth: AuthState,
  signUp: Function,
  enqueueSnackbar: Function,
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
  // gender: string,
  password: string,
  // birthdate: string,
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
    // gender: '',
    password: '',
    grade: ''
    // birthdate: ''
  };

  handleTypeChange = type => {
    this.setState({ type });
  };

  handleReset = () => {
    this.setState({ type: '' });
  };

  handleSubmit = async formData => {
    const { action, data } = formData;
    const {
      type,
      firstName,
      lastName,
      email,
      // gender,
      password,
      grade
      // birthdate
    } = this.state;
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
          // gender: data.gender || '',
          password: data.password || '',
          grade: data.grade || '',
          // birthdate: data.birthdate || '',
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
          // this.setState({ activeStep: 2 });
          await signUp({
            // state: data.state,
            grade,
            school: school && school.id,
            // studentId: data.studentId,
            firstName,
            lastName,
            // gender,
            password,
            // birthday: birthdate,
            email,
            phone: '',
            // parentFirstName: data.parentFirstName,
            // parentLastName: data.parentLastName,
            // parentPhone: data.parentPhone,
            // parentEmail: data.parentEmail,
            segment: type
          });
        } catch (err) {
          this.setState({ loading: false });
        }
        break;
      // case 'ProfileSetup':
      //   this.setState({ loading: true });
      //   try {
      //     await signUp({
      //       state: data.state,
      //       grade: data.grade,
      //       school: data.school,
      //       studentId: data.studentId,
      //       firstName,
      //       lastName,
      //       // gender,
      //       password,
      //       // birthday: birthdate,
      //       email,
      //       phone: '',
      //       parentFirstName: data.parentFirstName,
      //       parentLastName: data.parentLastName,
      //       parentPhone: data.parentPhone,
      //       parentEmail: data.parentEmail,
      //       segment: type === 'K-12' ? 'K12' : 'College'
      //     });
      //   } catch (err) {
      //     this.setState({ loading: false });
      //   }
      //   break;
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

  // handleLoadSchools = async ({ type, stateId }) => {
  //   if (type === 'K-12') {
  //     if (stateId === '') return { options: [], hasMore: false };
  //     let result = [];
  //     if (schools[stateId]) result = schools[stateId];
  //     else {
  //       result = await fetchSchools({ stateId });
  //       schools[stateId] = result;
  //     }
  //     return {
  //       options: result.map(school => ({
  //         label: school.value,
  //         value: school.data
  //       })),
  //       hasMore: false
  //     };
  //   }

  //   const result = await getLMSSchools();

  //   return {
  //     options: result.map(item => ({
  //       label: item.school,
  //       value: item.id
  //     })),
  //     hasMore: false
  //   };
  // };

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
    const { type, activeStep, loading, email } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body } = errorMessage;

    if (!school) return <Redirect to="/auth" />;

    return (
      <main className={classes.main}>
        <Grid container justify="space-around">
          <Grid item xs={12} lg={6} className={classes.grid}>
            <img src={logo} alt="Logo" className={classes.logo} />
            <ErrorBoundary>
              <SignUpForm
                // type={type}
                // onReset={this.handleReset}
                onChangeSchool={this.handleChangeSchool}
              >
                <Steps activeStep={activeStep} hide={Boolean(type === '')} />
                <TypeSelect
                  onTypeChange={this.handleTypeChange}
                  hide={Boolean(type !== '')}
                />
                <AccountForm
                  type={type}
                  loading={isLoading || loading}
                  hide={Boolean(type === '' || activeStep !== 0)}
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
                {/* <ProfileSetup
                  type={type}
                  loading={isLoading || loading}
                  hide={Boolean(type === '' || activeStep !== 2)}
                  onLoadOptions={this.handleLoadSchools}
                  onBack={this.handleBack}
                  onSubmit={this.handleSubmit}
                /> */}
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
      clearError: signUpActions.clearSignUpError,
      updateSchool: authActions.updateSchool
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(withStyles(styles)(SignUp)));
