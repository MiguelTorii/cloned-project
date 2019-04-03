// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import Layout from '../../containers/layout';
import Feed from '../../containers/feed';
import Share from '../../containers/share';
import TopPosts from '../../containers/top-posts';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

class FeedPage extends React.PureComponent<ProvidedProps & Props> {
  render() {
    const { classes } = this.props;

    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} md={9} className={classes.item}>
              <Feed />
            </Grid>
            <Hidden smDown>
              <Grid item md={3} className={classes.item}>
                <TopPosts />
              </Grid>
            </Hidden>
          </Grid>
          <Share />
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(withWidth()(FeedPage)));
