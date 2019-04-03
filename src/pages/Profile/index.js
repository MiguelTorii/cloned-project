// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import Profile from '../../containers/Profile';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      userId: string
    }
  }
};

type State = {
  userId: string
};

class ProfilePage extends React.Component<Props, State> {
  state = {
    userId: ''
  };

  componentDidMount = () => {
    const {
      match: {
        params: { userId = '' }
      }
    } = this.props;
    if (userId !== '') this.setState({ userId: String(userId) });
  };

  render() {
    const { classes } = this.props;
    const { userId } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.item}>
              <Profile userId={userId} />
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(ProfilePage));
