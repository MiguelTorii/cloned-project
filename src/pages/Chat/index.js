// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import withRoot from 'withRoot';
import Layout from 'containers/Layout';
import Chat from 'containers/MainChat';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex'
  },
  container: {
    height: 'calc(100vh - 68px)',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 116px)',
      marginBottom: -64
    }
  }
}));

const ChatPage = () => {
  const classes = useStyles();

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container justifyContent="center" className={classes.container}>
          <Chat />
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(withRouter(ChatPage));
