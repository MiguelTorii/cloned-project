import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { any } from 'prop-types';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import Chat from '../../containers/MainChat/MainChat';

const useStyles = makeStyles((theme: any) => ({
  item: {
    display: 'flex'
  },
  container: {
    height: (props: any) => `calc(100vh - ${68 + (props.bannerHeight || 0)}px)`,
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 116px)',
      marginBottom: -64
    }
  }
}));

const ChatPage = () => {
  const bannerHeight = useSelector((state: any) => state.user.bannerHeight);
  const classes: any = useStyles({
    bannerHeight
  });
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
