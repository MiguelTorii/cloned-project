// @flow

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import green from '@material-ui/core/colors/green';
import withStyles from '@material-ui/core/styles/withStyles';

const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    marginBottom: theme.spacing.unit * 4
  },
  paper: {
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  links: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    width: '100%'
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  email: string,
  password: string,
  isVerified: boolean,
  loading: boolean,
  handleChange: Function,
  handleSubmit: Function,
  onChangeSchool: Function
};

type State = {};

class SignInForm extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const {
      classes,
      email,
      password,
      isVerified,
      loading,
      handleSubmit,
      handleChange,
      onChangeSchool
    } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <ValidatorForm
            instantValidate={false}
            onSubmit={handleSubmit}
            className={classes.form}
          >
            {!isVerified ? (
              <TextValidator
                label="Email Address"
                margin="normal"
                onChange={handleChange('email')}
                name="email"
                autoComplete="email"
                autoFocus
                fullWidth
                value={email}
                disabled={loading}
                validators={['required', 'isEmail']}
                errorMessages={['email is required', 'email is not valid']}
              />
            ) : (
              <TextValidator
                label="Password"
                margin="normal"
                onChange={handleChange('password')}
                name="password"
                autoComplete="current-password"
                fullWidth
                type="password"
                value={password}
                disabled={loading}
                validators={['required']}
                errorMessages={['password is required']}
              />
            )}
            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submit}
              >
                {!isVerified ? 'Next' : 'Sign In'}
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </ValidatorForm>
          <div className={classes.links}>
            {/* <Typography variant="subtitle1" gutterBottom>
              {"Don't have an account? "}
              <Link
                component={MyLink}
                link="/signup"
                href="/signup"
                className={classes.link}
                disabled={loading}
              >
                Sign Up
              </Link>
            </Typography> */}
            {isVerified && (
              <Typography variant="subtitle1" gutterBottom>
                <Link
                  component={MyLink}
                  link="/forgot_password"
                  href="/forgot_password"
                  className={classes.link}
                  disabled={loading}
                >
                  Forgot Password
                </Link>
              </Typography>
            )}
            <Button color="primary" onClick={onChangeSchool}>
              Select a Different School
            </Button>
          </div>
          <Divider className={classes.divider} />
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(SignInForm);
