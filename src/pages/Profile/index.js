// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import Profile from '../../containers/Profile/Profile';

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
  },
  history: {
    location: {
      search: string
    }
  }
};

type State = {
  userId: string,
  edit: boolean
};

class ProfilePage extends React.Component<Props, State> {
  state = {
    userId: '',
    edit: false
  };

  componentDidMount = () => {
    const {
      match: {
        params: { userId = '' }
      },
      history: {
        location: { search = {} }
      }
    } = this.props;
    if (userId !== '') {
      this.setState({ userId: String(userId) });
    }

    const values = queryString.parse(search);
    const { edit = false } = values;
    this.setState({ edit });
  };

  componentDidUpdate = (prevProps) => {
    const {
      match: {
        params: { userId = '' }
      }
    } = this.props;
    const {
      match: {
        params: { userId: prevUserId }
      }
    } = prevProps;
    if (userId !== '' && prevUserId !== '' && userId !== prevUserId) {
      this.setState({ userId: String(userId) });
    }
  };

  render() {
    const { classes } = this.props;
    const { userId, edit } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.item}>
              <Profile key={userId} userId={userId} edit={edit} />
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(ProfilePage));
