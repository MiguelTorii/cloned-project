import React from 'react';

import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import withStyles from '@material-ui/core/styles/withStyles';

import Layout from 'containers/Layout/Layout';
import StudyCircle from 'containers/Study/Study';
import withRoot from 'withRoot';

const styles = () => ({
  root: {
    padding: 0
  }
});

const StudyCirclePage = ({ classes }) => (
  <main className={classes.main}>
    <CssBaseline />
    <Layout>
      <Box p={3}>
        <Grid container className={classes.root} spacing={3}>
          <Grid item xl={6} lg={8} sm={12}>
            <StudyCircle />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  </main>
);

export default withRoot(withStyles(styles)(StudyCirclePage));
