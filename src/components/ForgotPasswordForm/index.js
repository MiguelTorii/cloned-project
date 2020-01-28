// @flow

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import green from '@material-ui/core/colors/green';
import withStyles from '@material-ui/core/styles/withStyles';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';

const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3*2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
      .spacing(3)}px`
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing()
  },
  wrapper: {
    margin: theme.spacing(),
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
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  email: string,
  loading: boolean,
  onChange: Function,
  onSubmit: Function
};

type State = {};

class ForgotPasswordForm extends React.PureComponent<
  ProvidedProps & Props,
  State
> {
  render() {
    const { classes, email, loading, onSubmit, onChange } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
          <Typography component="h1" variant="h5">
            Recover Password
          </Typography>
          <ValidatorForm
            instantValidate={false}
            onSubmit={onSubmit}
            className={classes.form}
          >
            <TextValidator
              label="Email Address"
              margin="normal"
              onChange={onChange('email')}
              name="email"
              autoComplete="email"
              autoFocus
              fullWidth
              value={email}
              disabled={loading}
              validators={['required', 'isEmail']}
              errorMessages={['email is required', 'email is not valid']}
            />
            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submit}
              >
                Recover
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
            <Typography variant="subtitle1" gutterBottom>
              {'Already have an account? '}
              <Link component={MyLink} link="/login" href="/login">
                Sign in
              </Link>
            </Typography>
          </div>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(ForgotPasswordForm);
