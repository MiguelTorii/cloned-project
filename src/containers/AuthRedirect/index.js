// @flow

import React, { memo, useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import SelectSchool from 'containers/AuthRedirect/SelectSchool'
import * as signInActions from 'actions/sign-in';
import Login from 'containers/AuthRedirect/Login'
import SignUp from 'containers/AuthRedirect/SignUp'
import ForgotPassword from 'containers/AuthRedirect/ForgotPassword'
import NewPassword from 'containers/AuthRedirect/NewPassword'
import Paper from '@material-ui/core/Paper';
import LoadImg from 'components/LoadImg';
import cx from 'classnames'
import type { State as StoreState } from '../../types/state';
import loginBackground from '../../assets/svg/new-auth-bg.svg';
import IsoPhone from '../../assets/svg/IsoPhone.svg';
import authImage from '../../assets/img/new-auth.png';
import * as authActions from '../../actions/auth';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';
import Dialog from '../../components/Dialog';
import * as signUpActions from '../../actions/sign-up';

const styles = theme => ({
  main: {
    minHeight: '100vh',
    justifyContent: 'center',
    display: 'flex',
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
    width: '100%',
    position: 'relative',
    flexDirection: 'column'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 4, 6, 4)
  },
  container: {
    height: '100vh',
  },
  img: {
    width: '100%',
    objectFit: 'scale-down',
  },
  imgText: {
    maxWidth: 500,
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 20,
  },
  imgPhone: {
    position: 'relative',
    top: -60
  },
  backButton: {
    position: 'absolute',
    minWidth: 0,
    left: 0,
    top: 0,
  },
  imgContainer: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

type Props = {
  classes: Object,
  auth: Object,
  updateSchool: Function,
  updateRole: Function,
  signIn: Function,
  signUp: Function,
  clearError: Function,
  updateError: Function,
  search: string,
  pathname: string
};

const Auth = ({
  classes,
  auth,
  user,
  updateSchool,
  signIn,
  updateError,
  signUp,
  clearError,
  search,
  pathname
}: Props) => {
  const [screen, setScreen] = useState(
    pathname === '/reset_password'
      ? 'newPassword'
      : 'school'
  )
  // const [screen, setScreen] = useState('school')
  const {
    data: { school, role }
  } = auth
  const { error, errorMessage } = user;

  const renderScreen = useMemo(() => {
    if (screen === 'login') return <Login
      school={school}
      signIn={signIn}
      role={role}
      setScreen={setScreen}
    />

    if (screen === 'signup') return <SignUp
      school={school}
      updateError={updateError}
      setScreen={setScreen}
      signUp={signUp}
    />

    if (screen === 'forgotPassword') return <ForgotPassword
      setScreen={setScreen}
      updateError={updateError}
    />

    if (screen === 'newPassword') return <NewPassword
      updateError={updateError}
      signIn={signIn}
      search={search}
    />

    return <SelectSchool
      school={school}
      updateSchool={updateSchool}
      setScreen={setScreen}
    />
  } , [role, school, screen, search, signIn, signUp, updateError, updateSchool])

  const goBack = useCallback(() => {
    if (screen === 'login') setScreen('school')
    if (screen === 'signup') setScreen('role')
    if (screen === 'forgotPassword') setScreen('login')
  }, [screen])

  const isPhone = useMemo(() => (
    [
      'login',
      'signup',
      'forgotPassword',
      'newPassword'
    ].includes(screen)
  ), [screen])

  const renderBack = useMemo(() => {
    if(![
      'login',
      'signup',
      'forgotPassword',
      'newPassword'
    ].includes(screen)) {
      return null
    }

    return (
      <Button
        onClick={goBack}
        className={classes.backButton}
      >
        <ArrowBackIosRoundedIcon />
      </Button>
    )}, [classes.backButton, goBack, screen])

  const handleClose = useCallback(() => {
    clearError()
  }, [clearError])

  return (
    <main className={classes.main}>
      <Grid
        container
        item
        xs={12}
        md={10}
        spacing={2}
        alignItems='center'
        className={classes.container}
      >
        <Grid item xs={12} md={6} className={classes.imgContainer}>
          <LoadImg
            url={isPhone ? IsoPhone: authImage}
            className={classes.img}
          />
          <Typography
            color="textPrimary"
            className={cx(isPhone && classes.imgPhone, classes.imgText)}
          >
            When students are connected to the help of their classmates with just a touch of the finger, there’s nothing they can’t do.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <div className={classes.grid}>
              {renderBack}
              <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
              {renderScreen}
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        onCancel={handleClose}
        title={errorMessage.title}
        fullWidth
        maxWidth='xs'
        showActions
        okTitle='Ok'
        onOk={handleClose}
        open={error}
      >
        <Typography>
          {errorMessage.body}
        </Typography>
      </Dialog>
    </main>
  );
}

const mapStateToProps = ({ user, auth }: StoreState): {} => ({
  user,
  auth
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      signIn: signInActions.signIn,
      updateSchool: authActions.updateSchool,
      signUp: signUpActions.signUp,
      updateError: signUpActions.updateError,
      clearError: signUpActions.clearSignUpError,
    },
    dispatch
  );

export default memo(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Auth)));
