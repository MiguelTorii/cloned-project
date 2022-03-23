import React from 'react';

import queryString from 'query-string';
import { Redirect } from 'react-router';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import SignIn from 'containers/ResetPassword/SignIn';
import withRoot from 'withRoot';

const styles = (theme) => ({
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
});

type ProvidedProps = {
  classes: Record<string, any>;
  location: {
    search: string;
  };
};
type Props = {
  classes: Record<string, any>;
};
type State = {
  email: string;
  resetToken: string;
  redirect: string;
};

class ResetPasswordPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    email: '',
    resetToken: '',
    redirect: ''
  };

  componentDidMount = () => {
    const {
      location: { search = '' }
    } = this.props;
    const values = queryString.parse(search);
    const { email = '', reset_token: resetToken = '' } = values;

    if (email === '' || resetToken === '') {
      this.setState({
        redirect: '/login'
      });
    }

    this.setState({
      email: (email as string).replace(' ', '+'),
      resetToken: resetToken as string
    });
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
        <SignIn email={email} resetToken={resetToken} />
      </main>
    );
  }
}

export default withRoot(withStyles(styles as any)(ResetPasswordPage));
