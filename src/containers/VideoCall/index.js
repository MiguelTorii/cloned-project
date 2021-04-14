/* eslint-disable no-restricted-syntax */
// @flow
import React, { Fragment } from 'react';
import Chat from 'twilio-chat';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import adapter from 'webrtc-adapter';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { sendMessage } from 'api/chat'
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { renewTwilioToken } from '../../api/chat';
import Preview from './Preview';
import MeetUp from './MeetUp';
import * as utils from './utils';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import Controls from '../../components/MeetUp/CallControls';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    position: 'relative',
    backgroundColor: theme.circleIn.palette.black
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
    channel: null,
    videoinput: [],
    audioinput: [],
    audiooutput: [],
    selectedaudiooutput: '',
    videoinputtrack: null,
    audioinputtrack: null,
    videoinputEnabled: false,
    audioinputEnabled: false,
    error: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.meetupRef = React.createRef();
  }

  componentDidMount = async () => {
    this.mounted = true;
    if (adapter.browserDetails.browser === 'firefox') {
      adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }

    try {
      if (navigator && navigator.mediaDevices)
        navigator.mediaDevices.ondevicechange = this.handleUpdateDeviceSelectionOptions;
      const deviceSelectionOptions =
        (await this.handleUpdateDeviceSelectionOptions()) || {};
      for (const kind of ['audioinput', 'audiooutput', 'videoinput']) {
        const kindDeviceInfos = deviceSelectionOptions[kind] || [];
        const devices = [];
        kindDeviceInfos.forEach(kindDeviceInfo => {
          const { deviceId } = kindDeviceInfo;
          const label =
            kindDeviceInfo.label ||
            `Device [ id: ${deviceId.substr(0, 5)}... ]`;
          devices.push({ label, value: deviceId });
        });
        this.setState({
          [kind]: devices
        });
        if (devices.length > 0) {
          // eslint-disable-next-line no-await-in-loop
          await this.handleUpdateDeviceSelection(kind, devices[0].value);
          this.setState({ [`${kind}Enabled`]: true });
        }
      }
    } catch (err) {
      this.setState({ error: true });
    } finally {
      this.handleUpdateLoading(false);
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;

    for (const kind of ['audioinput', 'audiooutput', 'videoinput']) {
      const { state } = this;
      if (state[`${kind}track`]) {
        utils.detachTrack(state[`${kind}track`]);
      }
    }
  };

  handleUpdateDeviceSelectionOptions = () => {
    return (
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(utils.getDeviceSelectionOptions)
        .catch(err => {
          throw err;
        })
    );
  };

  handleUpdateDeviceSelection = async (kind, deviceId) => {
    this.setState({ [`selected${kind}`]: deviceId });
    let track = null;
    switch (kind) {
    case 'audioinput':
      console.log('--------here---')
      console.log(this.meetupRef)
      console.log(this.meetupRef.current)
      console.log(this.meetupRef.current.audioinput)
      console.log(this.meetupRef.current.audioinput.current)
      track = await utils.applyAudioInputDeviceSelection(
        deviceId,
        this.meetupRef.current.audioinput.current
      );
      this.setState({ [`${kind}track`]: track });
      break;
    case 'videoinput':
      track = await utils.applyVideoInputDeviceSelection(
        deviceId,
        this.meetupRef.current.videoinput.current
      );
      this.setState({ [`${kind}track`]: track });
      break;
    case 'audiooutput':
    default:
      break;
    }
  };

  handleDisableDevice = async kind => {
    const { state } = this;
    if (state[`${kind}track`]) {
      await utils.detachTrack(state[`${kind}track`]);
      this.setState({ [`${kind}Enabled`]: false, [`${kind}track`]: null });
    } else if (state[`selected${kind}`]) {
      this.handleUpdateDeviceSelection(kind, state[`selected${kind}`]);
      this.setState({ [`${kind}Enabled`]: true });
    }
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
      sendMessage({
        chatId: channel.sid,
        message: 'Joined Video',
        ...messageAttributes
      });
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
      // selectedaudioinput: '',
      // selectedvideoinput: ''
    });
  };

  handleUpdateLoading = loading => {
    this.setState({ loading });
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  renderComponent = () => {
    const {
      roomId,
      user,
      user: { data },
      pushTo
    } = this.props;

    const {
      join,
      selectedvideoinput,
      selectedaudioinput,
      channel,
      audioinput,
      audiooutput,
      videoinput,
      selectedaudiooutput,
      videoinputEnabled,
      audioinputEnabled,
      error
    } = this.state;

    if (!join) {
      return (
        <Preview
          meetupPreview={this.meetupRef}
          pushTo={pushTo}
          user={data}
          roomName={roomId}
          audioinput={audioinput}
          audiooutput={audiooutput}
          videoinput={videoinput}
          selectedvideoinput={selectedvideoinput}
          selectedaudioinput={selectedaudioinput}
          selectedaudiooutput={selectedaudiooutput}
          videoinputEnabled={videoinputEnabled}
          audioinputEnabled={audioinputEnabled}
          error={error}
          onUpdateDeviceSelection={this.handleUpdateDeviceSelection}
          onDisableDevice={this.handleDisableDevice}
          updateLoading={this.handleUpdateLoading}
          onJoin={this.handleJoinRoom}
        />
      );
    }
    return (
      <MeetUp
        user={user}
        innerRef={this.meetupRef}
        selectedvideoinput={selectedvideoinput}
        selectedaudioinput={selectedaudioinput}
        audioinput={audioinput}
        audiooutput={audiooutput}
        videoinput={videoinput}
        roomName={roomId}
        channel={channel}
        selectedaudiooutput={selectedaudiooutput}
        videoinputEnabled={videoinputEnabled}
        audioinputEnabled={audioinputEnabled}
        error={error}
        onUpdateDeviceSelection={this.handleUpdateDeviceSelection}
        onDisableDevice={this.handleDisableDevice}
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
            <Controls />
          </ErrorBoundary>
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

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(VideoCall));
