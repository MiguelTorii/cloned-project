// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import OAuth from '../../containers/OAuthRedirect';

const styles = () => ({});

type Props = {
  classes: Object,
  location: {
    search: string
  }
};

const OAuthPage = ({
  classes,
  location: {
    search
  }
}: Props) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <OAuth search={search} />
    </main>
  );
}

export default withRoot(withStyles(styles)(OAuthPage));
