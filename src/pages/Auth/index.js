// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { Auth0Provider } from "@auth0/auth0-react";
import withRoot from '../../withRoot';
import Auth from '../../containers/Auth';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {};

class AuthPage extends React.Component<ProvidedProps & Props, State> {
  componentDidMount = () => {};

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Auth0Provider
          domain="circlein-dev.us.auth0.com"
          clientId="Z9tv8MvsY8JcS2Z8uedkLBPjyyrAnI7K"
          redirectUri={`${window.location.origin }/oauth`}
          audience="https://circlein-dev.us.auth0.com/api/v2/"
          scope="read:current_user"
        >
          <Auth />
        </Auth0Provider>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(AuthPage));
