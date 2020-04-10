// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import withRoot from 'withRoot';
import Layout from 'containers/Layout';
import Chat from 'containers/Chat';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object
};


const FeedPage = ({classes}: Props) => {

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container justify="center">
          <Chat />
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(withRouter(FeedPage)))
