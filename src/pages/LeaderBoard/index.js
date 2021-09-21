// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import LeaderBoards from '../../containers/LeaderBoards/LeaderBoards';
import Layout from '../../containers/Layout/Layout';
import withRoot from '../../withRoot';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object
};

const LeaderBoard = ({ classes }: Props) => (
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

export default withRoot(
  withStyles(styles)(withWidth()(withRouter(LeaderBoard)))
);
