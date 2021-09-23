// @flow
import React, { useMemo, memo, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { changePassword } from 'api/sign-in';
import CircularProgress from '@material-ui/core/CircularProgress';
import queryString from 'query-string';

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
  }
}));

const ForgotPassword = ({ updateError, signIn, search }) => {
  const classes = useStyles();
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
          email: email.replace(' ', '+'),
          password,
          resetToken
        });
        if (success) {
          signIn({
            email: email.replace(' ', '+'),
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
        <Typography component="h1" variant="h5" align="center">
          Set New Password
        </Typography>
        <TextField
          id="password-login"
          className={classes.textField}
          value={password}
          onChange={onChange('password')}
          autoComplete="on"
          fullWidth
          type="password"
          placeholder="New Password"
        />
        <TextField
          id="confirm-login"
          className={classes.textField}
          value={confirm}
          onChange={onChange('confirm')}
          autoComplete="on"
          error={!match}
          type="password"
          helperText={!match && 'password mismatch'}
          fullWidth
          placeholder="Re-type Password"
        />
        <Button
          className={classes.loginButton}
          variant="contained"
          type="submit"
          onClick={onSubmit}
          disabled={!match || !password || loading}
          color="primary"
        >
          {loading ? <CircularProgress size={20} color="secondary" /> : 'Set Password'}
        </Button>
      </form>
    </div>
  );
};

export default memo(ForgotPassword);
