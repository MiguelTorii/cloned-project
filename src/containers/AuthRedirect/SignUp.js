// @flow
import React, { memo, useReducer, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { sendCode, verifyCode } from '../../api/sign-up';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2)
  },
  login: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    margin: theme.spacing(2)
  },
  createButton: {
    marginTop: theme.spacing(2),
    width: 160
  },
  orButton: {
    minWidth: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  }
}));

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: action.loading
      };
    case 'VERIFICATION':
      return {
        ...state,
        isVerification: true,
        error: false
      };
    case 'UPDATE_ERROR':
      return {
        ...state,
        error: true
      };
    case 'UPDATE_SIGNUP':
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
};

const initialState = {
  isVerification: false,
  email: '',
  password: '',
  confirmPassword: '',
  confirmEmail: '',
  firstName: '',
  lastName: '',
  code: '',
  loading: false,
  error: false
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const SignUp = ({ school, updateError, setScreen, signUp }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateSignup = useCallback(
    (key) => (e) => {
      dispatch({ type: 'UPDATE_SIGNUP', key, value: e.target.value });
    },
    []
  );

  const goLogin = useCallback(() => {
    setScreen('login');
  }, [setScreen]);

  const handleSubmit = useCallback(async () => {
    const hasError =
      state.password !== state.confirmPassword ||
      !state.password ||
      !validateEmail(state.email) ||
      state.email !== state.confirmEmail ||
      !state.email ||
      !state.lastName ||
      !state.firstName;

    dispatch({ type: 'LOADING', loading: true });
    if (hasError) { dispatch({ type: 'UPDATE_ERROR' }); } else {
      const result = await sendCode({ email: state.email });

      if (result.error) {
        updateError({
          title: 'Validation Error',
          body: result.error
        });
      } else {
        dispatch({ type: 'VERIFICATION' });
      }
    }
    dispatch({ type: 'LOADING', loading: false });
  }, [
    state.confirmEmail,
    state.confirmPassword,
    state.email,
    state.firstName,
    state.lastName,
    state.password,
    updateError
  ]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  const renderSignUp = useMemo(() => (
      <div className={classes.container}>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            className={classes.textField}
            onChange={updateSignup('firstName')}
            error={state.error && !state.firstName}
            helperText={state.error && !state.firstName && 'Required'}
            value={state.firstName}
            fullWidth
            placeholder="First Name"
          />
          <TextField
            className={classes.textField}
            onChange={updateSignup('lastName')}
            value={state.lastName}
            error={state.error && !state.lastName}
            helperText={state.error && !state.lastName && 'Required'}
            fullWidth
            placeholder="Last Name"
          />
          <TextField
            className={classes.textField}
            onChange={updateSignup('email')}
            error={state.error && !validateEmail(state.email)}
            value={state.email}
            helperText={
              state.error && !validateEmail(state.email) && 'Invalid Email'
            }
            fullWidth
            autoComplete="new=email"
            placeholder="Email"
          />
          <TextField
            className={classes.textField}
            onChange={updateSignup('confirmEmail')}
            error={state.error && state.email !== state.confirmEmail}
            value={state.confirmEmail}
            helperText={
              state.error &&
              state.email !== state.confirmEmail &&
              'Must be equal to email'
            }
            autoComplete="new-email"
            fullWidth
            placeholder="Confirm Email"
          />
          <TextField
            className={classes.textField}
            onChange={updateSignup('password')}
            error={state.error && !state.password}
            helperText={state.error && !state.password && 'Required'}
            value={state.password}
            type="password"
            autoComplete="new-password"
            fullWidth
            placeholder="Password"
          />
          <TextField
            className={classes.textField}
            onChange={updateSignup('confirmPassword')}
            error={state.error && state.password !== state.confirmPassword}
            helperText={
              state.error &&
              state.password !== state.confirmPassword &&
              'Must be equal to password'
            }
            value={state.confirmPassword}
            type="password"
            autoComplete="new-password"
            placeholder="Confirm Password"
            fullWidth
          />
          <Button
            className={classes.createButton}
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            disabled={state.loading}
            color="primary"
          >
            {state.loading ? <CircularProgress size={30} /> : 'Create Account'}
          </Button>
        </form>
        <div className={classes.login}>
          <Typography>Or ,</Typography>
          <Button
            disableElevation
            disableFocusRipple
            onClick={goLogin}
            className={classes.orButton}
            disableRipple
          >
            Login
          </Button>
        </div>
      </div>
    ), [
    classes.container,
    classes.createButton,
    classes.form,
    classes.login,
    classes.orButton,
    classes.textField,
    goLogin,
    handleSubmit,
    onSubmit,
    state.confirmEmail,
    state.confirmPassword,
    state.email,
    state.error,
    state.firstName,
    state.lastName,
    state.loading,
    state.password,
    updateSignup
  ]);

  const handleVerifyCode = useCallback(async () => {
    dispatch({ type: 'LOADING', loading: true });
    try {
      const { email, code, firstName, lastName, password } = state;
      const { id } = school;
      await verifyCode({ email, code });

      await signUp({
        grade: 1,
        school: id,
        firstName,
        lastName,
        password,
        email,
        phone: '',
        segment: 'College',
        referralCode: code
      });
    } catch (err) {
      updateError({
        title: 'Verification Error',
        body: "We couldn't verify your code, please try again."
      });
    }
    dispatch({ type: 'LOADING', loading: false });
  }, [school, signUp, state, updateError]);

  const onSubmitVerification = useCallback(
    (e) => {
      e.preventDefault();
      handleVerifyCode();
    },
    [handleVerifyCode]
  );

  const verification = useMemo(
    () => (
      <form className={classes.container} onSubmit={onSubmitVerification}>
        <Typography>Check your email for a verification code</Typography>
        <TextField
          className={classes.textField}
          placeholder="Verification Code"
          value={state.code}
          onChange={updateSignup('code')}
          fullWidth
        />
        <Button
          className={classes.createButton}
          onClick={handleVerifyCode}
          variant="contained"
          disabled={state.loading}
          color="primary"
        >
          {state.loading ? <CircularProgress size={30} /> : 'Submit Code'}
        </Button>
      </form>
    ),
    [
      classes.container,
      classes.createButton,
      classes.textField,
      handleVerifyCode,
      onSubmitVerification,
      state.code,
      state.loading,
      updateSignup
    ]
  );

  return state.isVerification ? verification : renderSignUp;
};

export default memo(SignUp);
