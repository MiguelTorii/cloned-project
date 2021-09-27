// @flow
import React, { memo, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { recoverPassword } from 'api/sign-in';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2)
  },
  textField: {
    margin: theme.spacing(2)
  },
  loginButton: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
    width: 160
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  subtext: {
    fontSize: 14,
    fontWeight: 400
  },
  endtext: {
    paddingTop: theme.spacing(2)
  }
}));

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const FirstTime = ({ updateError }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email');

  const onChange = useCallback(
    (field) => (e) => {
      if (e?.target) {
        const { value } = e.target;
        if (field === 'email') { setEmail(value); }
      }
    },
    []
  );

  const onSubmitEmail = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const success = await recoverPassword({ email });
        if (success) {
          setStep('code');
        } else {
          updateError({
            title: 'Error Recovering Password',
            body: "We couldn't process your request, please try again"
          });
        }
      } catch (err) {
        updateError({
          title: 'Error Recovering Password',
          body: "We couldn't process your request, please try again"
        });
      } finally {
        setLoading(false);
      }
    },
    [email, updateError]
  );

  if (step === 'email') {
return (
      <div className={classes.container}>
        <form onSubmit={onSubmitEmail} className={classes.form}>
          <Typography
            component="h1"
            variant="h5"
            align="center"
            className={classes.title}
          >
            Activate your Account
          </Typography>
          <Typography align="center" className={classes.subtext}>
            Hi!{' '}
            <span role="img" aria-label="hi">
              👋
            </span>{' '}
            Your school created an account for
          </Typography>
          <Typography align="center" className={classes.subtext}>
            you, we just need to make sure it’s you!
          </Typography>
          <TextField
            id="email-login"
            className={classes.textField}
            value={email}
            onChange={onChange('email')}
            autoComplete="on"
            fullWidth
            placeholder="Enter your school email here"
          />
          <Button
            className={classes.loginButton}
            disabled={!validateEmail(email) || loading}
            variant="contained"
            type="submit"
            onClick={onSubmitEmail}
            color="primary"
          >
            {loading ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              'Set password'
            )}
          </Button>
          <Typography align="center" className={classes.endtext}>
            We’ll send an email to set your password!
          </Typography>
        </form>
      </div>
    );
}

  return (
    <div className={classes.container}>
      <form className={classes.form}>
        <Typography align="center">
          If your email is connected to a account, a reset link was sent to it.
        </Typography>
      </form>
    </div>
  );
};

export default memo(FirstTime);
