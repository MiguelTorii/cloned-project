import React from 'react';

import { isMobile } from 'react-device-detect';

import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import OpenApp from 'components/OpenApp/OpenApp';
import Layout from 'containers/Layout/Layout';
import VideoCall from 'containers/VideoCall/VideoCall';
import withRoot from 'withRoot';

const styles = () => ({});

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
  match: {
    params: {
      roomId: string;
    };
  };
};
type State = {
  roomId: string;
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

    if (roomId !== '') {
      this.setState({
        roomId
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { roomId } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        {roomId !== '' && !isMobile && (
          <Layout isNaked>
            <VideoCall roomId={roomId} />
          </Layout>
        )}
        {isMobile && (
          <Layout>
            <OpenApp />
          </Layout>
        )}
      </main>
    );
  }
}

export default withRoot(withStyles(styles as any)(VideoCallPage));
