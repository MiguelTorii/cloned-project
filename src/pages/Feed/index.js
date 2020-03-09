// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router';
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

type State = {
  feedId: ?number,
  classId: number,
  sectionId: number,
  bookmarks: boolean
};

class FeedPage extends React.PureComponent<Props, State> {
  state = {
    feedId: null,
    classId: -1,
    sectionId: -1,
    bookmarks: false
  };

  componentDidMount = () => {
    const {
      location: { search = '' }
    } = this.props;
    const {
      id = null,
      classId = -1,
      sectionId = -1,
      bookmarks = false
    } = queryString.parse(search);

    this.setState({
      feedId: id ? Number(id) : null,
      classId: Number(classId),
      sectionId: Number(sectionId),
      bookmarks: bookmarks === 'true'
    });
  };

  render() {
    const { classes } = this.props;
    const { feedId, classId, sectionId, bookmarks } = this.state;

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
                bookmarks={bookmarks}
              />
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(withWidth()(withRouter(FeedPage))));
