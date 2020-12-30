// @flow

import React, { useRef } from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router';
import FeedResources from 'containers/FeedResources'
import { decypherClass } from 'utils/crypto'
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
  }
};


const FeedPage = ({ classes, location }: Props) => {
  const {
    feedId, from
  } = queryString.parse(location.search)
  const gridRef = useRef(null)

  const { classId, sectionId } = decypherClass()
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
          <Grid item xs={12} md={3} ref={gridRef}>
            <FeedResources gridRef={gridRef} />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(withWidth()(withRouter(FeedPage))));
