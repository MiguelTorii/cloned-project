// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import ViewShareLink from '../../containers/ViewShareLink';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      sharelinkId: string
    }
  }
};

type State = {
  sharelinkId: ?number
};

class ShareLinkPage extends React.Component<Props, State> {
  state = {
    sharelinkId: null
  };

  componentDidMount = () => {
    const {
      match: {
        params: { sharelinkId }
      }
    } = this.props;
    this.setState({ sharelinkId: Number(sharelinkId) });
  };

  render() {
    const { classes } = this.props;
    const { sharelinkId } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.item}>
              {sharelinkId && <ViewShareLink sharelinkId={sharelinkId} />}
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(ShareLinkPage));
