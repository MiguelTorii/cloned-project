import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import Auth from 'containers/Auth/Auth';
import withRoot from 'withRoot';

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
};

const AuthPage = ({ classes }: Props) => (
  <main className={classes.main}>
    <CssBaseline />
    <Auth />
  </main>
);

export default withRoot(withStyles(styles as any)(AuthPage));
