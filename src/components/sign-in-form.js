// @flow

import React from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';

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
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  email: String,
  password: String,
  handleChange: Function,
  handleSubmit: Function
};

type State = {};

class SignInForm extends React.Component<ProvidedProps & Props, State> {
  componentDidMount = () => {};

  render() {
    const { classes, email, password, handleSubmit, handleChange } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
            <TextValidator
              label="Email Address"
              margin="normal"
              onChange={handleChange('email')}
              name="email"
              autoComplete="email"
              autoFocus
              fullWidth
              value={email}
              validators={['required', 'isEmail']}
              errorMessages={['email is required', 'email is not valid']}
            />
            <TextValidator
              label="Password"
              margin="normal"
              onChange={handleChange('password')}
              name="password"
              autoComplete="current-password"
              fullWidth
              type="password"
              value={password}
              validators={['required']}
              errorMessages={['password is required']}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
          </ValidatorForm>
        </Paper>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignInForm));
