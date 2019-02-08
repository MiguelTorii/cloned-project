// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';
import Layout from '../containers/layout';
import Feed from '../containers/feed';
import Share from '../containers/share';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {
  feedId?: number
};

class FeedPage extends React.Component<ProvidedProps & Props, State> {
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
      <main className={classes.main}>
        <CssBaseline />
        <Layout>
          <Feed />
          <Share />
          {feedId && 'Show feed'}
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(FeedPage));
