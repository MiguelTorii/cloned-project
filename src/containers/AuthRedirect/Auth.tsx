import React, { useEffect, memo, useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import TextField from '@material-ui/core/TextField';
import { Box, Hidden } from '@material-ui/core';
import ImageBackgroundDesktop from '../../assets/img/auth-ui-bg-desktop.png';
import ImageBackgroundMobile from '../../assets/img/auth-ui-bg-mobile.png';
import ImageContentLeft from '../../assets/img/auth-ui-content-people-left.png';
import ImageContentRight from '../../assets/img/auth-ui-content-people-right.png';
import ImageLogoText from '../../assets/img/logo-text.png';
import ImageLogoIcon from '../../assets/img/logo-icon.png';
import SelectSchool from './SelectSchool';
import Login from './Login';
import SignUp from './SignUp';
import WalkThrough from './WalkThrough';
import ForgotPassword from './ForgotPassword';
import FirstTime from './FirstTime';
import NewPassword from './NewPassword';
import Dialog from '../../components/Dialog/Dialog';
import { emailRequest, getSchool } from '../../api/sign-in';
import * as signInActions from '../../actions/sign-in';
import * as authActions from '../../actions/auth';
import * as signUpActions from '../../actions/sign-up';
import { deepLinkCheck } from '../../utils/helpers';
import type { State as StoreState } from '../../types/state';

const styles = (theme) => ({
  main: {
    minHeight: '100vh',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: 'white',
    backgroundImage: `url(${ImageBackgroundDesktop})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: '1440px auto',
    [theme.breakpoints.down('xs')]: {
      backgroundImage: `url(${ImageBackgroundMobile})`,
      backgroundSize: '450px auto'
    }
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
  logoText: {
    width: 225,
    [theme.breakpoints.down('sm')]: {
      width: 125,
      marginTop: 10
    }
  },
  logoIcon: {
    width: 37
  },
  popupContainer: {
    marginTop: 100,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 40
    }
  },
  paper: {
    position: 'relative',
    backgroundColor: theme.circleIn.palette.errorPopupBackground,
    color: 'black',
    width: 740,
    height: 511,
    maxWidth: 'calc(100% - 40px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 30,
    padding: theme.spacing(7, 10),
    marginTop: 60,
    boxShadow: '10px 10px 40px rgba(0, 0, 0, 0.2)',
    [theme.breakpoints.down('sm')]: {
      marginTop: 80
    }
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
    left: 30,
    top: 60,
    '& svg': {
      color: 'black'
    },
    [theme.breakpoints.down('sm')]: {
      top: 55
    }
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
  },
  imageLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '80%'
  },
  imageRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: '80%',
    userSelect: 'none'
  },
  screenContainer: {
    width: '100%',
    height: '100%',
    zIndex: 2
  }
});

type Props = {
  classes?: Record<string, any>;
  auth?: Record<string, any>;
  signIn?: (...args: Array<any>) => any;
  signUp?: (...args: Array<any>) => any;
  clearError?: (...args: Array<any>) => any;
  updateError?: (...args: Array<any>) => any;
  state?: Record<string, any>;
  search?: string;
  pathname?: string;
  user?: any;
  updateSchool?: any;
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
  const [screen, setScreen] = useState(pathname === '/reset_password' ? 'newPassword' : 'school');
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
        const school = await getSchool({
          schoolId: pathname.split('/')[2]
        });
        setSchool(school);
      } catch (err) {}
    };

    if (schoolId) {
      loadSchoolById();
    }
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
          <SignUp school={school} updateError={updateError} setScreen={setScreen} signUp={signUp} />
        );

      case 'firstTime':
        return <FirstTime setScreen={setScreen} updateError={updateError} />;

      case 'forgotPassword':
        return <ForgotPassword setScreen={setScreen} updateError={updateError} />;

      case 'newPassword':
        return <NewPassword updateError={updateError} signIn={signIn} search={search} />;

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
    if (isDeepLink) {
      setSchool({});
    }

    if (screen === 'login') {
      setLoginAsExternalUser(false);
      setScreen('school');
    }

    if (screen === 'signup') {
      setScreen('role');
    }

    if (screen === 'forgotPassword') {
      setScreen('login');
    }

    if (screen === 'firstTime') {
      setScreen('login');
    }
  }, [screen, isDeepLink]);
  const isPhone = useMemo(
    () => ['login', 'signup', 'forgotPassword', 'firstTime', 'newPassword'].includes(screen),
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
      <Box className={classes.popupContainer}>
        <Hidden mdUp>
          <img src={ImageLogoIcon} alt="Logo Icon" className={classes.logoIcon} />
        </Hidden>
        <img src={ImageLogoText} alt="Logo Text" className={classes.logoText} />
        <Paper className={classes.paper} elevation={0}>
          <img className={classes.imageLeft} src={ImageContentLeft} alt="background on left" />
          <img className={classes.imageRight} src={ImageContentRight} alt="background on right" />
          {renderBack}
          <Box className={classes.screenContainer}>{renderScreen}</Box>
        </Paper>
      </Box>
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

const mapDispatchToProps = (dispatch: any): {} =>
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
  connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(Auth))
);
