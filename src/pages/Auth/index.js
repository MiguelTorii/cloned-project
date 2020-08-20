// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { Auth0Provider } from "@auth0/auth0-react"
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
      <Auth0Provider
        domain="circlein-dev.us.auth0.com"
        clientId="Bps2iaRf3iIxDeTVJa9zOQI20937s7Dj"
        redirectUri={`${window.location.origin}/saml`}
      >
        <main className={classes.main}>
          <CssBaseline />
          <Auth />
        </main>
      </Auth0Provider>
    );
  }
}

export default withRoot(withStyles(styles)(AuthPage));
