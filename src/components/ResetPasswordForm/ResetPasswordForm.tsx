import React from 'react';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { ReactComponent as AppLogo } from 'assets/svg/circlein_logo.svg';

import { styles } from '../_styles/ResetPasswordForm';

const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
  password: string;
  loading: boolean;
  onChange: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
};
type State = {};

class ResetPasswordForm extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const { classes, password, loading, onSubmit, onChange } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <AppLogo
            style={{
              maxHeight: 100,
              maxWidth: 200
            }}
          />
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <ValidatorForm instantValidate={false} onSubmit={onSubmit} className={classes.form}>
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
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
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

export default withStyles(styles as any)(ResetPasswordForm);
