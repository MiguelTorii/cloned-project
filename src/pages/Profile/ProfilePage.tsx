import React from 'react';

import queryString from 'query-string';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import Layout from 'containers/Layout/Layout';
import Profile from 'containers/Profile/Profile';
import withRoot from 'withRoot';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Record<string, any>;
  match: {
    params: {
      userId: string;
    };
  };
  history: {
    location: {
      search: string;
    };
  };
};

type State = {
  userId: string;
  edit: boolean;
  source: any;
};

class ProfilePage extends React.Component<Props, State> {
  state = {
    userId: '',
    source: null,
    edit: false
  };

  componentDidMount = () => {
    const {
      match: {
        params: { userId = '' }
      },
      history: {
        location: { search = '' }
      }
    } = this.props;
    const query = queryString.parse(search);

    if (userId !== '') {
      this.setState({
        userId: String(userId),
        source: query.from
      });
    }

    const { edit = false } = query;
    this.setState({
      edit: edit as boolean
    });
  };

  getSnapshotBeforeUpdate = (prevProps) => {
    const {
      match: {
        params: { userId = '' }
      },
      history: {
        location: { search }
      }
    } = this.props;
    const {
      match: {
        params: { userId: prevUserId }
      }
    } = prevProps;

    if (userId !== '' && prevUserId !== '' && userId !== prevUserId) {
      const query = queryString.parse(search);
      this.setState({
        userId: userId,
        source: query.from
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { userId, edit, source } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.item}>
              <Profile key={userId} userId={userId} edit={edit} from={source} />
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles as any)(ProfilePage));
