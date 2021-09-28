// @flow

import React from 'react';
import { Redirect } from 'react-router';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import withRoot from '../../withRoot';
import ResetPassword from '../../containers/ResetPassword/SignIn';

const styles = (theme) => ({
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
});

type ProvidedProps = {
  classes: Object,
  location: {
    search: string
  }
};

type Props = {
  classes: Object
};

type State = {
  email: string,
  resetToken: string,
  redirect: string
};

class ResetPasswordPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    email: '',
    resetToken: '',
    redirect: ''
  };

  componentDidMount = () => {
    const {
      location: { search = {} }
    } = this.props;
    const values = queryString.parse(search);
    const { email = '', reset_token: resetToken = '' } = values;
    if (email === '' || resetToken === '') {
      this.setState({ redirect: '/login' });
    }
    this.setState({ email: email.replace(' ', '+'), resetToken });
  };

  render() {
    const { classes } = this.props;
    const { email, resetToken, redirect } = this.state;
    if (redirect !== '') {
      return <Redirect to={redirect} />;
    }

    if (email === '' || resetToken === '') {
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <ResetPassword email={email} resetToken={resetToken} />
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(ResetPasswordPage));
