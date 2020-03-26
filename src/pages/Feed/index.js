// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router';
import FeedResources from 'containers/FeedResources'
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import Feed from '../../containers/Feed';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  location: {
    search: string
  },
};


const FeedPage = ({classes, location}: Props) => {
  const {
    feedId, classId, sectionId, from
  } = queryString.parse(location.search)

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container justify="center">
          <Grid item xs={12} md={9} className={classes.item}>
            <Feed
              feedId={feedId}
              classId={classId}
              sectionId={sectionId}
              from={from}
            />
          </Grid>
          <FeedResources />
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(withWidth()(withRouter(FeedPage))));
