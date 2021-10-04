import React, { memo, useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LoadImg from "components/LoadImg/LoadImg";
import getappqrcode from "assets/img/getappqrcode.png";
import getappandroid from "assets/img/getappandroid.png";
import getappios from "assets/img/getappios.png";
import TextField from "@material-ui/core/TextField";
const useStyles = makeStyles(theme => ({
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
    margin: theme.spacing(3, 0),
    objectFit: 'scale-down'
  },
  scanText: {
    fontWeight: 800,
    fontSize: 12,
    textAlign: 'center'
  },
  forgotPassword: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    margin: theme.spacing(2)
  },
  loginButton: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
    width: 160
  },
  orButton: {
    minWidth: 0
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
    width: '100%'
  },
  activateButton: {
    color: theme.circleIn.palette.brand,
    textDecoration: 'underline',
    marginTop: theme.spacing(2)
  }
}));

const Login = ({
  role,
  setScreen,
  school,
  signIn,
  isLoginAsExternalUser
}) => {
  const classes = useStyles();
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
  const onChange = useCallback(field => e => {
    if (e?.target) {
      const {
        value
      } = e.target;

      if (field === 'email') {
        setEmail(value);
      }

      if (field === 'password') {
        setPassword(value);
      }
    }
  }, []);
  const onSubmit = useCallback(e => {
    e.preventDefault();
    onLogin();
  }, [onLogin]);
  const forgotPassword = useCallback(() => {
    setScreen('forgotPassword');
  }, [setScreen]);
  return <div className={classes.container}>
      <form onSubmit={onSubmit} className={classes.form}>
        <TextField id="email-login" className={classes.textField} value={email} onChange={onChange('email')} autoComplete="on" fullWidth placeholder="Email" />
        <TextField id="password-login" autoComplete="on" value={password} type="password" onChange={onChange('password')} className={classes.textField} placeholder="Password" fullWidth />
        <Button className={classes.loginButton} variant="contained" type="submit" onClick={onLogin} color="primary">
          Login
        </Button>
      </form>
      {!isLoginAsExternalUser && <Button onClick={goFirstTime} className={classes.activateButton} disableElevation disableFocusRipple disableRipple>
          First time here? Activate your account!
        </Button>}
      <div className={classes.forgotPassword}>
        <Typography>Or, </Typography>
        <Button className={classes.orButton} onClick={forgotPassword}>
          Forgot Password
        </Button>
      </div>
      {['student', 'tutor'].includes(role) && <div className={classes.scanContainer}>
          <LoadImg url={getappqrcode} className={classes.qr} />
          <Grid container justifyContent="space-around">
            <a href="https://apps.apple.com/us/app/circlein-circle-in-daily/id969803973">
              <LoadImg url={getappios} className={classes.image} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.circlein.android&hl=en_US">
              <LoadImg url={getappandroid} className={classes.image} />
            </a>
          </Grid>
        </div>}
      <Typography className={classes.scanText}>
        Scan to download CircleIn Mobile - great for studyin on-the-go!
      </Typography>
    </div>;
};

export default memo(Login);