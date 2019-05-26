// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import withStyles from '@material-ui/core/styles/withStyles';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import SignUpForm from '../../components/SignUpForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import Steps from '../../components/SignUpForm/Steps';
import TypeSelect from '../../components/SignUpForm/TypeSelect';
import AccountForm from '../../components/SignUpForm/AccountForm';
import VerifyAccount from '../../components/SignUpForm/VerifyAccount';
import ProfileSetup from '../../components/SignUpForm/ProfileSetup';
import * as signUpActions from '../../actions/sign-up';
import { fetchSchools, sendCode, verifyCode } from '../../api/sign-up';
import { colleges } from '../../constants/clients';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({});

const schools = {};

type ProvidedProps = {
  classes: Object
};

type Props = {
  user: UserState,
  signUp: Function,
  enqueueSnackbar: Function,
  clearError: Function
};

type State = {
  loading: boolean,
  type: string,
  activeStep: number,
  firstName: string,
  lastName: string,
  email: string,
  gender: string,
  password: string,
  birthdate: string
};

class SignUp extends React.Component<ProvidedProps & Props, State> {
  state = {
    loading: false,
    type: '',
    activeStep: 0,
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    password: '',
    birthdate: ''
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
      gender,
      password,
      birthdate
    } = this.state;
    const { signUp } = this.props;
    switch (action) {
      case 'Account':
        this.setState({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          gender: data.gender || '',
          password: data.password || '',
          birthdate: data.birthdate || '',
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
        } finally {
          this.setState({ loading: false });
        }
        break;
      case 'ProfileSetup':
        this.setState({ loading: true });
        try {
          console.log(firstName, lastName, email, gender, password, birthdate);
          console.log(data);
          await signUp({
            state: data.state,
            grade: data.grade,
            school: data.school,
            studentId: data.studentId,
            firstName,
            lastName,
            gender,
            password,
            birthday: birthdate,
            email,
            phone: '',
            parentFirstName: data.parentFirstName,
            parentLastName: data.parentLastName,
            parentPhone: data.parentPhone,
            parentEmail: data.parentEmail,
            segment: type === 'K-12' ? 'K12' : 'College'
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
    const { enqueueSnackbar } = this.props;
    enqueueSnackbar(`New code sent to ${email}`, {
      variant: 'success'
    });
  };

  handleLoadSchools = async ({ type, stateId }) => {
    if (type === 'K-12') {
      if (stateId === '') return { options: [], hasMore: false };
      let result = [];
      if (schools[stateId]) result = schools[stateId];
      else {
        result = await fetchSchools({ stateId });
        schools[stateId] = result;
      }
      return {
        options: result.map(school => ({
          label: school.value,
          value: school.data
        })),
        hasMore: false
      };
    }

    return {
      options: colleges,
      hasMore: false
    };
  };

  handleErrorDialogClose = () => {
    const { clearError } = this.props;
    clearError();
  };

  render() {
    const { classes, user } = this.props;
    const { type, activeStep, loading, email } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body } = errorMessage;

    return (
      <main className={classes.main}>
        <ErrorBoundary>
          <SignUpForm type={type} onReset={this.handleReset}>
            <Steps activeStep={activeStep} hide={Boolean(type === '')} />
            <TypeSelect
              onTypeChange={this.handleTypeChange}
              hide={Boolean(type !== '')}
            />
            <AccountForm
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
            <ProfileSetup
              type={type}
              loading={isLoading || loading}
              hide={Boolean(type === '' || activeStep !== 2)}
              onLoadOptions={this.handleLoadSchools}
              onBack={this.handleBack}
              onSubmit={this.handleSubmit}
            />
          </SignUpForm>
        </ErrorBoundary>
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
      signUp: signUpActions.signUp,
      clearError: signUpActions.clearSignUpError
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(withStyles(styles)(SignUp)));
