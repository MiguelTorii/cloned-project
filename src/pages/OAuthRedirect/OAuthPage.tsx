import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import OAuth from 'containers/OAuthRedirect/OAuthRedirect';
import withRoot from 'withRoot';

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
  history: {
    location: {
      search: string;
    };
  };
};

const OAuthPage = ({ classes, history: { location } }: Props) => (
  <main className={classes.main}>
    <CssBaseline />
    <OAuth search={location.search} />
  </main>
);

export default withRoot(withStyles(styles as any)(OAuthPage));
