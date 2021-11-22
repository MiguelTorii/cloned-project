import React, { useMemo, memo, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import queryString from 'query-string';
import { FormControl, FormHelperText } from '@material-ui/core';
import { changePassword } from '../../api/sign-in';
import AuthTitle from './AuthTitle';
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
    margin: theme.spacing(1.5)
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

const ForgotPassword = ({ updateError, signIn, search }) => {
  const classes: any = useStyles();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { email, reset_token: resetToken } = useMemo(() => queryString.parse(search), [search]);
  const onChange = useCallback(
    (field) => (e) => {
      if (e?.target) {
        const { value } = e.target;

        if (field === 'password') {
          setPassword(value);
        }

        if (field === 'confirm') {
          setConfirm(value);
        }
      }
    },
    []
  );
  const match = useMemo(() => password === confirm, [confirm, password]);
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        const success = await changePassword({
          email: (email as string).replace(' ', '+'),
          password,
          resetToken
        });

        if (success) {
          signIn({
            email: (email as string).replace(' ', '+'),
            password
          });
        } else {
          updateError({
            title: 'Error Reseting Password',
            body: "We couldn't process your request, please try again"
          });
        }
      } catch (err) {
        updateError({
          title: 'Error Reseting Password',
          body: "We couldn't process your request, please try again"
        });
      } finally {
        setLoading(false);
      }
    },
    [email, password, resetToken, signIn, updateError]
  );
  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit} className={classes.form}>
        <AuthTitle paragraph>Set New Password</AuthTitle>
        <AuthTextInput
          id="password-login"
          className={classes.textField}
          value={password}
          onChange={onChange('password')}
          autoComplete="on"
          fullWidth
          type="password"
          placeholder="New Password"
        />
        <AuthTextInput
          id="confirm-login"
          className={classes.textField}
          value={confirm}
          onChange={onChange('confirm')}
          autoComplete="on"
          error={!match}
          type="password"
          fullWidth
          placeholder="Re-type Password"
        />
        {!match && <FormHelperText>password mismatch</FormHelperText>}
        <AuthButton
          className={classes.loginButton}
          variant="contained"
          type="submit"
          onClick={onSubmit}
          disabled={!match || !password || loading}
          color="primary"
        >
          {loading ? <CircularProgress size={20} color="secondary" /> : 'Set Password'}
        </AuthButton>
      </form>
    </div>
  );
};

export default memo(ForgotPassword);
