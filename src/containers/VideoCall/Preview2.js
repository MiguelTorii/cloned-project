/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary';
import MeetupPreview from '../../components/MeetUpPreview';
import * as utils from './utils';

const styles = () => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewWrapper: {
    width: 200,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  video: {
    height: '100% !important',
    width: 'auto !important'
  }
});

type Props = {
  classes: Object,
  user: User,
  roomName: string,
  updateLoading: Function,
  onJoin: Function
};

type State = {};

class Preview extends React.Component<Props, State> {
  state = {
    videoinput: [],
    audioinput: [],
    audiooutput: [],
    selectedvideoinput: '',
    selectedaudioinput: '',
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
    this.meetupPreview = React.createRef();
  }

  componentDidMount = async () => {
    try {
      navigator.mediaDevices.ondevicechange = this.handleUpdateDeviceSelectionOptions;
      const deviceSelectionOptions = await this.handleUpdateDeviceSelectionOptions();
      for (const kind of ['audioinput', 'audiooutput', 'videoinput']) {
        const kindDeviceInfos = deviceSelectionOptions[kind];
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
      const { updateLoading } = this.props;
      updateLoading(false);
    }
  };

  componentWillUnmount = () => {
    for (const kind of ['audioinput', 'audiooutput', 'videoinput']) {
      const { state } = this;
      if (state[`${kind}track`]) {
        utils.detachTrack(state[`${kind}track`]);
      }
    }
  };

  handleUpdateDeviceSelectionOptions = () => {
    return navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(utils.getDeviceSelectionOptions)
      .catch(err => {
        throw err;
      });
  };

  handleUpdateDeviceSelection = async (kind, deviceId) => {
    this.setState({ [`selected${kind}`]: deviceId });
    let track = null;
    switch (kind) {
      case 'audioinput':
        track = await utils.applyAudioInputDeviceSelection(
          deviceId,
          this.meetupPreview.current.audioinput.current
        );
        this.setState({ [`${kind}track`]: track });
        break;
      case 'videoinput':
        track = await utils.applyVideoInputDeviceSelection(
          deviceId,
          this.meetupPreview.current.videoinput.current
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

  handleJoin = () => {
    const {
      audioinputEnabled,
      videoinputEnabled,
      selectedaudioinput,
      selectedvideoinput
    } = this.state;
    const { onJoin } = this.props;
    onJoin({
      audioinput: audioinputEnabled ? selectedaudioinput : '',
      videoinput: videoinputEnabled ? selectedvideoinput : ''
    });
  };

  render() {
    const {
      classes,
      user: { firstName, lastName, profileImage },
      roomName
    } = this.props;
    const {
      audioinput,
      audiooutput,
      videoinput,
      selectedvideoinput,
      selectedaudioinput,
      selectedaudiooutput,
      videoinputEnabled,
      audioinputEnabled,
      error
    } = this.state;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <MeetupPreview
            innerRef={this.meetupPreview}
            roomName={roomName}
            firstName={firstName}
            lastName={lastName}
            profileImage={profileImage}
            audioinput={audioinput}
            videoinput={videoinput}
            audiooutput={audiooutput}
            selectedvideoinput={selectedvideoinput}
            selectedaudioinput={selectedaudioinput}
            selectedaudiooutput={selectedaudiooutput}
            isVideoEnabled={videoinputEnabled}
            isAudioEnabled={audioinputEnabled}
            error={error}
            onUpdateDeviceSelection={this.handleUpdateDeviceSelection}
            onDisableDevice={this.handleDisableDevice}
            onJoin={this.handleJoin}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(Preview);
