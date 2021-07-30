// @flow

import React, { useRef } from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router';
import FeedResources from 'containers/FeedResources';
import { decypherClass } from 'utils/crypto';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import Feed from '../../containers/Feed';
import Recommendations from '../../containers/Recommendations';
import { Hidden } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const styles = () => ({
  item: {
    display: 'flex'
  },
  resources: {}
});

type Props = {
  classes: Object,
  location: {
    search: string
  }
};

const FeedPage = ({ classes, location }: Props) => {
  const { feedId, from } = queryString.parse(location.search);
  const gridRef = useRef(null);

  const { classId, sectionId } = decypherClass();
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container spacing={2}>
          <Hidden lgUp>
            <Grid item xs={12}>
              <Box padding={1}>
                <Recommendations />
              </Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} lg={9} className={classes.item}>
            <Feed
              feedId={feedId}
              classId={classId}
              sectionId={sectionId}
              from={from}
            />
          </Grid>
          <Grid item xs={12} lg={3} className={classes.resources} ref={gridRef}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <FeedResources gridRef={gridRef} />
              </Grid>
              <Hidden mdDown>
                <Grid item xs={12}>
                  <Recommendations />
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(withStyles(styles)(withWidth()(withRouter(FeedPage))));
