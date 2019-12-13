// @flow

import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import LeaderBoards from '../../containers/LeaderBoards'
import Layout from '../../containers/Layout';
import withRoot from '../../withRoot';

const styles = () => ({
  item: {
    display: 'flex'
  }
});


const LeaderBoard = ({ classes }) => {

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container spacing={0} justify="center">
          <Grid item xs={12} md={9} className={classes.item}>
            <LeaderBoards />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(withWidth()(LeaderBoard)));
