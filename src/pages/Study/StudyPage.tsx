import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import StudyCircle from '../../containers/Study/Study';

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
