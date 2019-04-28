// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import Post from '../../containers/Post_DELETE';
import TopPosts from '../../containers/TopPosts';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      feedId: string
    }
  }
};

type State = {
  feedId: ?number
};

class PostPage extends React.Component<Props, State> {
  state = {
    feedId: null
  };

  componentDidMount = () => {
    const {
      match: {
        params: { feedId = '' }
      }
    } = this.props;
    if (feedId !== '') this.setState({ feedId: Number(feedId) });
  };

  render() {
    const { classes } = this.props;
    const { feedId } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} md={9} className={classes.item}>
              <Post feedId={feedId} />
            </Grid>
            <Hidden smDown>
              <Grid item md={3} className={classes.item}>
                <TopPosts />
              </Grid>
            </Hidden>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(PostPage));
