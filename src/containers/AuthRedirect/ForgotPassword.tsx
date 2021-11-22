import React, { memo, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box } from '@material-ui/core';
import { recoverPassword } from '../../api/sign-in';
import AuthTitle from './AuthTitle';
import SemiBoldTypography from '../../components/SemiBoldTypography/SemiBoldTypography';
import AuthTextInput from './AuthTextInput';
import AuthButton from './AuthButton';

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
    fontWeight: 'bold',
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

const ForgotPassword = ({ updateError, setScreen }) => {
  const classes: any = useStyles();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email');
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
        const success = await recoverPassword({
          email
        });

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
          <AuthTitle paragraph>Reset your password</AuthTitle>
          <SemiBoldTypography paragraph variant="h6" align="center">
            Enter your school email below to reset your password
          </SemiBoldTypography>
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
            <SemiBoldTypography align="center">
              Check your inbox for the password reset link
            </SemiBoldTypography>
          </Box>
        </form>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <form className={classes.form}>
        <SemiBoldTypography variant="h6">
          If your email is connected to a account, a reset link was sent to it.
        </SemiBoldTypography>
      </form>
    </div>
  );
};

export default memo(ForgotPassword);
