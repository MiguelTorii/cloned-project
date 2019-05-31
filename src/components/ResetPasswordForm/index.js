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
import logo from '../../assets/svg/circlein_logo_beta.svg';

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
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
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
    alignItems: 'flex-end'
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  password: string,
  loading: boolean,
  onChange: Function,
  onSubmit: Function
};

type State = {};

class ResetPasswordForm extends React.PureComponent<
  ProvidedProps & Props,
  State
> {
  render() {
    const { classes, password, loading, onSubmit, onChange } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <img src={logo} alt="Logo" className={classes.logo} />
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <ValidatorForm
            instantValidate={false}
            onSubmit={onSubmit}
            className={classes.form}
          >
            <TextValidator
              label="Password"
              margin="normal"
              onChange={onChange('password')}
              name="password"
              autoComplete="current-password"
              fullWidth
              type="password"
              value={password}
              disabled={loading}
              validators={['required']}
              errorMessages={['password is required']}
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
                Reset
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

export default withStyles(styles)(ResetPasswordForm);
