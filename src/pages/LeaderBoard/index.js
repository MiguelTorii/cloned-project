// @flow

import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import queryString from 'query-string'
import LeaderBoards from '../../containers/LeaderBoards'
import Layout from '../../containers/Layout';
import withRoot from '../../withRoot';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  location: {
    search: string
  }
};


const LeaderBoard = ({ classes, location }: Props) => {
  const {
    sectionId
  } = queryString.parse(location.search)

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container spacing={0} justify="center">
          <Grid item xs={12} md={9} className={classes.item}>
            <LeaderBoards
              sectionId={sectionId}
            />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(withWidth()(withRouter(LeaderBoard))));
