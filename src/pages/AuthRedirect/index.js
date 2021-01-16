// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import withRoot from '../../withRoot';
import Auth from '../../containers/AuthRedirect';

const styles = () => ({});

type Props = {
  classes: Object,
  location: {
    state: Object,
    pathname: string,
    search: string
  }
};

const AuthPage = ({
  classes,
  location : {
    search,
    state,
    pathname
  }
}: Props) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Auth
        state={state}
        search={search}
        pathname={pathname}
      />
    </main>
  );
}

export default withRouter(
  withRoot(withStyles(styles)(AuthPage))
);
