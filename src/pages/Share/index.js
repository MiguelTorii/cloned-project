// @flow

import React from 'react';
import { Redirect } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import { getPostInfo } from '../../api/posts';
import { logEvent } from '../../api/analytics';

const styles = theme => ({
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      code: string
    }
  }
};

type State = {
  redirect: string,
  error: boolean
};

class SharePage extends React.PureComponent<Props, State> {
  state = {
    redirect: '',
    error: false
  };

  componentDidMount = async () => {
    const {
      match: {
        params: { code }
      }
    } = this.props;
    try {
      const {
        typeId,
        postInfo: { postId, feedId }
      } = await getPostInfo({ hid: code });
      switch (typeId) {
        case 3:
          this.setState({ redirect: `/flashcards/${postId}` });
          break;
        case 4:
          this.setState({ redirect: `/notes/${postId}` });
          break;
        case 5:
          this.setState({ redirect: `/sharelink/${postId}` });
          break;
        case 6:
          this.setState({ redirect: `/question/${postId}` });
          break;
        default:
          break;
      }
      logEvent({
        event: 'User- Opened Generated Link',
        props: { 'Internal ID': feedId }
      });
    } catch (err) {
      this.setState({ error: true });
    }
  };

  render() {
    const { classes } = this.props;
    const { redirect, error } = this.state;

    if (redirect !== '') {
      return <Redirect to={redirect} />;
    }

    if (error) {
      return <Redirect to="/" />;
    }

    return (
      <main>
        <CssBaseline />
        <Layout>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SharePage));
