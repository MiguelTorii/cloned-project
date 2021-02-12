// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import OAuth from '../../containers/OAuthRedirect';

const styles = () => ({});

type Props = {
  classes: Object,
  history: {
    locatoin: Object
  }
};

const OAuthPage = ({
  classes,
  history: {
    location
  }
}: Props) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <OAuth search={location.search} />
    </main>
  );
}

export default withRoot(withStyles(styles)(OAuthPage));
