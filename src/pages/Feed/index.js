// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import Feed from '../../containers/Feed';
// import TopPosts from '../../containers/TopPosts';

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

type State = {
  feedId: ?number
};

class FeedPage extends React.PureComponent<Props, State> {
  state = {
    feedId: null
  };

  componentDidMount = () => {
    const {
      location: { search = '' }
    } = this.props;
    const { id = null } = queryString.parse(search);
    this.setState({ feedId: id ? Number(id) : null });
  };

  render() {
    const { classes } = this.props;
    const { feedId } = this.state;

    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0} justify="center">
            <Grid item xs={12} md={9} className={classes.item}>
              <Feed feedId={feedId} />
            </Grid>
            {/* <Hidden smDown>
              <Grid item md={3} className={classes.item}>
                <TopPosts />
              </Grid>
            </Hidden> */}
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(withWidth()(FeedPage)));
