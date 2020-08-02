// @flow
import React, { Fragment } from 'react';
import Chat from 'twilio-chat';
import { connect } from 'react-redux';
import adapter from 'webrtc-adapter';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { renewTwilioToken } from '../../api/chat';
import Preview from './Preview';
import MeetUp from './MeetUp';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({
  root: {
    position: 'relative'
  },
  loading: {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000
  }
});

type Props = {
  classes: Object,
  roomId: string,
  user: UserState
};

type State = {
  loading: boolean,
  join: boolean,
  selectedaudioinput: string,
  selectedvideoinput: string,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string,
  channel: ?Object
};

class VideoCall extends React.Component<Props, State> {
  state = {
    loading: true,
    join: false,
    selectedaudioinput: '',
    // selectedaudioinput: 'default',
    selectedvideoinput: '',
    // '087b5fabfe22031636162fc11d83471ce2f45316403485a3974ffa9042cd8789',
    errorDialog: false,
    errorTitle: '',
    errorBody: '',
    channel: null
  };

  componentDidMount = () => {
    this.mounted = true;
    if (adapter.browserDetails.browser === 'firefox') {
      adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleJoinRoom = async ({ audioinput, videoinput }) => {
    const {
      user: {
        data: { userId, firstName, lastName }
      },
      roomId
    } = this.props;
    this.setState({ loading: true });
    try {
      const accessToken = await renewTwilioToken({
        userId
      });

      if (!accessToken || (accessToken && accessToken === '')) {
        return;
      }

      const client = await Chat.create(accessToken);
      const channel = await client.getChannelBySid(roomId);
      const messageAttributes = {
        firstName,
        lastName,
        imageKey: '',
        isVideoNotification: true
      };
      channel.sendMessage('Joined Video', messageAttributes);
      this.setState({
        join: true,
        channel,
        selectedaudioinput: audioinput,
        selectedvideoinput: videoinput
      });
      client.on('tokenAboutToExpire', async () => {
        if (!this.mounted) return;
        const newToken = await renewTwilioToken({
          userId
        });
        if (!newToken || (newToken && newToken === '')) {
          return;
        }
        await client.updateToken(newToken);
      });
    } catch (err) {
      this.setState({
        errorDialog: true,
        errorTitle: 'Not Allowed',
        errorBody: 'You are not allowed to access this room'
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLeaveRoom = () => {
    this.setState({
      join: false,
      selectedaudioinput: '',
      selectedvideoinput: ''
    });
  };

  handleUpdateLoading = loading => {
    this.setState({ loading });
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  mounted: boolean;

  renderComponent = () => {
    const {
      roomId,
      user: { data }
    } = this.props;
    const {
      join,
      selectedvideoinput,
      selectedaudioinput,
      channel
    } = this.state;

    if (!join) {
      return (
        <Preview
          user={data}
          roomName={roomId}
          updateLoading={this.handleUpdateLoading}
          onJoin={this.handleJoinRoom}
        />
      );
    }
    return (
      <MeetUp
        user={data}
        videoinput={selectedvideoinput}
        audioinput={selectedaudioinput}
        roomName={roomId}
        channel={channel}
        leaveRoom={this.handleLeaveRoom}
        updateLoading={this.handleUpdateLoading}
      />
    );
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { loading, errorDialog, errorTitle, errorBody } = this.state;
    if (userId === '')
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );

    return (
      <div className={classes.root}>
        <Fragment>
          <ErrorBoundary>
            {loading && (
              <div className={classes.loading}>
                <CircularProgress />
              </div>
            )}
          </ErrorBoundary>
          <ErrorBoundary>{this.renderComponent()}</ErrorBoundary>
          <ErrorBoundary>
            <SimpleErrorDialog
              open={errorDialog}
              title={errorTitle}
              body={errorBody}
              handleClose={this.handleErrorDialogClose}
            />
          </ErrorBoundary>
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(VideoCall));
