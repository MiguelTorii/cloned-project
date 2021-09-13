// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Auth from '../../containers/Auth/Auth';

const styles = () => ({});

type Props = {
  classes: Object
};

const AuthPage = ({ classes }: Props) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Auth />
    </main>
  );
};

export default withRoot(withStyles(styles)(AuthPage));
