import React, { memo, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Box, Hidden } from '@material-ui/core';
import getappqrcode from '../../assets/img/getappqrcode.png';
import getappandroid from '../../assets/img/getappandroid.png';
import getappios from '../../assets/img/getappios.png';
import LoadImg from '../../components/LoadImg/LoadImg';
import AuthButton from './AuthButton';
import SemiBoldTypography from '../../components/SemiBoldTypography/SemiBoldTypography';
import AuthTextInput from './AuthTextInput';
import AuthTitle from './AuthTitle';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2)
  },
  qr: {
    width: 208,
    maxWidth: '100%',
    margin: theme.spacing(3, 0),
    objectFit: 'scale-down'
  },
  scanText: {
    fontSize: 18,
    textAlign: 'center'
  },
  forgotPassword: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    margin: theme.spacing(1)
  },
  loginButton: {
    marginTop: theme.spacing(2),
    width: 160
  },
  orButton: {
    minWidth: 0,
    fontSize: 16,
    color: theme.circleIn.palette.black
  },
  scanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(3)
  },
  activateButton: {
    textDecoration: 'underline',
    color: theme.circleIn.palette.black,
    marginTop: theme.spacing(2)
  }
}));

const Login = ({ role, setScreen, school, signIn, isLoginAsExternalUser }) => {
  const classes: any = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onLogin = useCallback(() => {
    signIn({
      email,
      password,
      schoolId: school?.id,
      role
    });
  }, [email, password, role, school, signIn]);
  const goFirstTime = useCallback(() => {
    setScreen('firstTime');
  }, [setScreen]);
  const onChange = useCallback(
    (field) => (e) => {
      if (e?.target) {
        const { value } = e.target;

        if (field === 'email') {
          setEmail(value);
        }

        if (field === 'password') {
          setPassword(value);
        }
      }
    },
    []
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onLogin();
    },
    [onLogin]
  );
  const forgotPassword = useCallback(() => {
    setScreen('forgotPassword');
  }, [setScreen]);
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <AuthTitle>Your classmates are waiting for you!</AuthTitle>
      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          <form onSubmit={onSubmit} className={classes.form}>
            <AuthTextInput
              id="email-login"
              className={classes.textField}
              value={email}
              onChange={onChange('email')}
              autoComplete="on"
              fullWidth
              placeholder="School Email Address"
            />
            <AuthTextInput
              id="password-login"
              autoComplete="on"
              value={password}
              type="password"
              onChange={onChange('password')}
              className={classes.textField}
              placeholder="Password"
              fullWidth
            />
            <AuthButton
              className={classes.loginButton}
              variant="contained"
              type="submit"
              onClick={onLogin}
              color="primary"
            >
              Login
            </AuthButton>
          </form>
          {!isLoginAsExternalUser && (
            <Box display="flex" justifyContent="center">
              <Button
                onClick={goFirstTime}
                className={classes.activateButton}
                disableElevation
                disableFocusRipple
                disableRipple
              >
                First time here? Activate your account!
              </Button>
            </Box>
          )}
          <div className={classes.forgotPassword}>
            <Typography>Or, </Typography>
            <Button className={classes.orButton} onClick={forgotPassword}>
              Forgot Password
            </Button>
          </div>
        </Grid>
        <Hidden smDown>
          <Grid item xs={4}>
            {['student', 'tutor'].includes(role) && (
              <div className={classes.scanContainer}>
                <LoadImg url={getappqrcode} className={classes.qr} />
              </div>
            )}
            <Typography className={classes.scanText}>Scan to download the mobile app</Typography>
          </Grid>
        </Hidden>
      </Grid>
    </Box>
  );
};

export default memo(Login);
