// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import VideoCall from '../../containers/VideoCall';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  match: {
    params: {
      roomId: string
    }
  }
};

type State = {
  roomId: string
};

class VideoCallPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    roomId: ''
  };

  componentDidMount = () => {
    const {
      match: {
        params: { roomId = '' }
      }
    } = this.props;
    if (roomId !== '') this.setState({ roomId });
  };

  render() {
    const { classes } = this.props;
    const { roomId } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Layout isNaked>
          {roomId !== '' && <VideoCall roomId={roomId} />}
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(VideoCallPage));
