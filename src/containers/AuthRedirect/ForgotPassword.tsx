import React, { memo, useCallback, useState } from 'react';

import { Box, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { recoverPassword } from 'api/sign-in';

import AuthButton from './AuthButton';
import AuthTextInput from './AuthTextInput';
import AuthTitle from './AuthTitle';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    margin: theme.spacing(2)
  },
  loginButton: {
    marginTop: theme.spacing(2),
    width: 160
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  }
}));

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const STEPS = {
  EMAIL: 'email',
  CODE: 'code'
};

const ForgotPassword = ({ updateError, setScreen }) => {
  const classes: any = useStyles();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(STEPS.EMAIL);
  const onChange = useCallback(
    (field) => (e) => {
      if (e?.target) {
        const { value } = e.target;

        if (field === 'email') {
          setEmail(value);
        }
      }
    },
    []
  );
  const onSubmitEmail = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        await recoverPassword({
          email
        });
      } finally {
        setLoading(false);
        setStep(STEPS.CODE);
      }
    },
    [email, updateError]
  );

  if (step === STEPS.EMAIL) {
    return (
      <div className={classes.container}>
        <form onSubmit={onSubmitEmail} className={classes.form}>
          <AuthTitle paragraph>Reset your password</AuthTitle>
          <Typography paragraph variant="h6" align="center">
            Enter your school email below to reset your password
          </Typography>
          <AuthTextInput
            id="email-login"
            className={classes.textField}
            value={email}
            onChange={onChange('email')}
            autoComplete="on"
            fullWidth
            placeholder="Email"
          />
          <AuthButton
            className={classes.loginButton}
            disabled={!validateEmail(email) || loading}
            variant="contained"
            type="submit"
            onClick={onSubmitEmail}
            color="primary"
          >
            {loading ? <CircularProgress size={20} color="secondary" /> : 'Submit'}
          </AuthButton>
          <Box mt={5}>
            <Typography align="center">Check your inbox for the password reset link</Typography>
          </Box>
        </form>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <AuthTitle paragraph>Reset your password</AuthTitle>
      <Typography variant="h6" align="center">
        Thanks for providing your email, we sent a link to reset your password. We can't wait to get you back in here!
      </Typography>
    </div>
  );
};

export default memo(ForgotPassword);
