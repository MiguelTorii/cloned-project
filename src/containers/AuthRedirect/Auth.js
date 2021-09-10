// @flow

import React, { useEffect, memo, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import TextField from '@material-ui/core/TextField';
import SelectSchool from 'containers/AuthRedirect/SelectSchool';
import Login from 'containers/AuthRedirect/Login';
import SignUp from 'containers/AuthRedirect/SignUp';
import WalkThrough from 'containers/AuthRedirect/WalkThrough';
import ForgotPassword from 'containers/AuthRedirect/ForgotPassword';
import FirstTime from 'containers/AuthRedirect/FirstTime';
import NewPassword from 'containers/AuthRedirect/NewPassword';
import LoadImg from 'components/LoadImg/LoadImg';
import Dialog from 'components/Dialog/Dialog';
import { emailRequest, getSchool } from 'api/sign-in';
import * as signInActions from 'actions/sign-in';
import * as authActions from 'actions/auth';
import * as signUpActions from 'actions/sign-up';
import { deepLinkCheck } from 'utils/helpers';
import loginBackground from 'assets/svg/new-auth-bg.svg';
import CircleInPhone from 'assets/img/CircleInPhone.png';
import authImage from 'assets/img/new-auth.png';
import { ReactComponent as AppLogo } from 'assets/svg/circlein_logo.svg';
import type { State as StoreState } from 'types/state';

const styles = (theme) => ({
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
  deeplinkBlankPage: {
    position: 'absolute',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
    zIndex: 2147483647,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
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
    padding: theme.spacing(2, 4, 4, 4)
  },
  container: {
    height: '100vh'
  },
  img: {
    width: '100%',
    objectFit: 'scale-down'
  },
  imgText: {
    maxWidth: 500,
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 20
  },
  imgPhone: {
    position: 'relative',
    top: -10
  },
  backButton: {
    position: 'absolute',
    minWidth: 0,
    left: 0,
    top: 0
  },
  imgContainer: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    justifyContent: 'center'
  },
  walkthrough: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    margin: 0
  },
  contentClass: {
    padding: '0px !important'
  },
  body: {
    marginBottom: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  auth: Object,
  signIn: Function,
  signUp: Function,
  clearError: Function,
  updateError: Function,
  state: Object,
  search: string,
  pathname: string
};

const Auth = ({
  classes,
  auth,
  state,
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
    pathname === '/reset_password' ? 'newPassword' : 'school'
  );
  const [school, setSchool] = useState(auth.data?.school);
  const [isLoginAsExternalUser, setLoginAsExternalUser] = useState(false);
  const [email, setEmail] = useState('');
  const [deeplinkLoading, setDeeplinkLoading] = useState(false);

  const isDeepLink = useMemo(() => deepLinkCheck(pathname), [pathname]);

  const {
    data: { role }
  } = auth;
  const { error, errorMessage } = user;

  useEffect(() => {
    setSchool(auth.data?.school);
  }, [auth]);

  useEffect(() => {
    if (isDeepLink) {
      setDeeplinkLoading(true);
    }
  }, [isDeepLink]);

  useEffect(() => {
    const schoolId = pathname.split('/')[2];

    const loadSchoolById = async () => {
      try {
        const school = await getSchool({ schoolId: pathname.split('/')[2] });
        setSchool(school);
      } catch (err) {}
    };

    schoolId && loadSchoolById();
  }, [setSchool, pathname]);

  useEffect(() => {
    if (state?.error) {
      updateError({
        title: 'Oops! 🙊',
        body: 'This is the login page for the main application where students collaborate. We have a separate login page for the Insights Dashboard!',
        action: 'loginFail'
      });
    }
  }, [state, updateError]);

  const renderScreen = useMemo(() => {
    switch (screen) {
      case 'login':
        return (
          <Login
            school={school}
            signIn={signIn}
            role={role}
            setScreen={setScreen}
            isLoginAsExternalUser={isLoginAsExternalUser}
          />
        );
      case 'signup':
        return (
          <SignUp
            school={school}
            updateError={updateError}
            setScreen={setScreen}
            signUp={signUp}
          />
        );
      case 'firstTime':
        return <FirstTime setScreen={setScreen} updateError={updateError} />;
      case 'forgotPassword':
        return (
          <ForgotPassword setScreen={setScreen} updateError={updateError} />
        );
      case 'newPassword':
        return (
          <NewPassword
            updateError={updateError}
            signIn={signIn}
            search={search}
          />
        );
      default:
        return (
          <SelectSchool
            school={school}
            setScreen={setScreen}
            isDeepLink={isDeepLink}
            setDeeplinkLoading={setDeeplinkLoading}
            updateSchool={updateSchool}
            updateError={updateError}
            setLoginAsExternalUser={setLoginAsExternalUser}
          />
        );
    }
  }, [
    isLoginAsExternalUser,
    role,
    school,
    screen,
    isDeepLink,
    search,
    signIn,
    signUp,
    updateError,
    updateSchool
  ]);

  const goBack = useCallback(() => {
    if (isDeepLink) setSchool({});
    if (screen === 'login') {
      setLoginAsExternalUser(false);
      setScreen('school');
    }
    if (screen === 'signup') setScreen('role');
    if (screen === 'forgotPassword') setScreen('login');
    if (screen === 'firstTime') setScreen('login');
  }, [screen, isDeepLink]);

  const isPhone = useMemo(
    () =>
      [
        'login',
        'signup',
        'forgotPassword',
        'firstTime',
        'newPassword'
      ].includes(screen),
    [screen]
  );

  const renderBack = useMemo(() => {
    if (!['login', 'signup', 'forgotPassword', 'firstTime'].includes(screen)) {
      return null;
    }

    return (
      <Button onClick={goBack} className={classes.backButton}>
        <ArrowBackIosRoundedIcon />
      </Button>
    );
  }, [classes.backButton, goBack, screen]);

  const handleClose = useCallback(() => {
    clearError();
  }, [clearError]);

  const onSend = useCallback(async () => {
    if (email) {
      await emailRequest({
        email,
        reason: 'Students Access'
      });
      updateError({
        title: '',
        body: <Typography>Email successfully sent!</Typography>
      });
    }
  }, [email, updateError]);

  const redirectDashboard = useCallback(() => {
    const origin = window.location.origin.includes('dev')
      ? 'https://insights-dev.circleinapp.com/'
      : 'https://insights.circleinapp.com/';

    window.location.href = origin;
  }, []);

  const onOk = useCallback(() => {
    switch (errorMessage.action) {
      case 'email':
        onSend();
        break;
      case 'loginFail':
        redirectDashboard();
        break;
      default:
        handleClose();
    }
  }, [errorMessage.action, handleClose, onSend, redirectDashboard]);

  return (
    <main className={classes.main}>
      {isDeepLink && deeplinkLoading && (
        <div className={classes.deeplinkBlankPage}>
          <CircularProgress />
          <Typography variant="body1">Taking you to login...</Typography>
        </div>
      )}
      <Grid
        container
        item
        xs={12}
        md={10}
        spacing={2}
        alignItems="center"
        className={classes.container}
      >
        <Grid item xs={12} md={6} className={classes.imgContainer}>
          <LoadImg
            url={isPhone ? CircleInPhone : authImage}
            className={classes.img}
          />
          <Typography
            color="textPrimary"
            className={cx(isPhone && classes.imgPhone, classes.imgText)}
          >
            CircleIn is an all-in-one studying app to connect with classmates
            instantly, take notes, make flashcards and organize all your
            schoolwork and win gift cards for studying!
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
        open={screen === 'walk'}
        className={classes.walkthrough}
        contentClassName={classes.contentClass}
        showHeader={false}
      >
        <WalkThrough setScreen={setScreen} school={school} />
      </Dialog>
      <Dialog
        onCancel={handleClose}
        title={errorMessage.title}
        fullWidth
        maxWidth="sm"
        showActions
        showCancel={errorMessage.action === 'loginFail'}
        cancelTitle="Got it"
        okTitle={errorMessage.action === 'loginFail' ? 'Take me there!' : 'Ok'}
        onOk={onOk}
        open={error}
      >
        <div>
          <Typography className={classes.body}>{errorMessage.body}</Typography>
          {errorMessage.action === 'email' && (
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="on"
              fullWidth
              placeholder="Email"
            />
          )}
        </div>
      </Dialog>
    </main>
  );
};

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
      clearError: signUpActions.clearSignUpError
    },
    dispatch
  );

export default memo(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Auth))
);
