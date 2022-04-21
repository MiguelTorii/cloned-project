/* eslint-disable no-restricted-syntax */
import type { RefObject } from 'react';
import React from 'react';

import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from 'store';
import adapter from 'webrtc-adapter';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import { STORAGE_KEYS } from 'constants/app';

import { sendMessage } from 'api/chat';
import SimpleErrorDialog from 'components/SimpleErrorDialog/SimpleErrorDialog';
import { ChatClientContext } from 'features/chat';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import MeetUp from './MeetUp';
import Preview from './Preview';
import * as utils from './utils';

import type { Client } from '@twilio/conversations';
import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

const styles = (theme) => ({
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
  classes?: Record<string, any>;
  roomId: string;
  user?: UserState;
  pushTo?: any;
};
type State = {
  loading: boolean;
  join: boolean;
  selectedaudioinput: string;
  selectedvideoinput: string;
  errorDialog: boolean;
  errorTitle: string;
  errorBody: string;
  channel: Record<string, any> | null | undefined;
  videoinput: any[];
  audioinput: any[];
  audiooutput: any[];
  selectedaudiooutput: string;
  videoinputtrack: any;
  audioinputtrack: any;
  videoinputEnabled: boolean;
  audioinputEnabled: boolean;
  error: boolean;
};

class VideoCall extends React.Component<Props, State> {
  static contextType = ChatClientContext;

  mounted: boolean;

  meetupRef: RefObject<any>;

  state: State = {
    loading: true,
    join: false,
    selectedaudioinput: store.get(STORAGE_KEYS.SAVED_AUDIO_INPUT) || '',
    selectedvideoinput: store.get(STORAGE_KEYS.SAVED_VIDEO_INPUT) || '',
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
    this.meetupRef = React.createRef();
  }

  componentDidMount = async () => {
    this.mounted = true;

    if (adapter.browserDetails.browser === 'firefox') {
      (adapter as any).browserShim.shimGetDisplayMedia(window, 'screen');
    }

    await this.initialDevices();
  };

  componentWillUnmount = () => {
    this.mounted = false;
    this.handleDetachtracks();
  };

  initialDevices = async () => {
    try {
      if (navigator && navigator.mediaDevices) {
        navigator.mediaDevices.ondevicechange = this.handleUpdateDeviceSelectionOptions;
      }

      const deviceSelectionOptions = (await this.handleUpdateDeviceSelectionOptions()) || {};

      for (const kind of ['audioinput', 'audiooutput', 'videoinput']) {
        const kindDeviceInfos = deviceSelectionOptions[kind] || [];
        const devices = [];
        kindDeviceInfos.forEach((kindDeviceInfo) => {
          const { deviceId } = kindDeviceInfo;
          const label = kindDeviceInfo.label || `Device [ id: ${deviceId.substr(0, 5)}... ]`;
          devices.push({
            label,
            value: deviceId
          });
        });
        this.setState({
          [kind]: devices
        } as any);

        if (devices.length > 0) {
          // eslint-disable-next-line react/destructuring-assignment
          const selectedDevice = this.state[`selected${kind}`];
          const matchedDeviceId = devices.findIndex((device) => device.value === selectedDevice);
          // eslint-disable-next-line no-await-in-loop
          await this.handleUpdateDeviceSelection(
            kind,
            devices[matchedDeviceId < 0 ? 0 : matchedDeviceId].value
          );
          this.setState({
            [`${kind}Enabled`]: true
          } as any);
        }
      }
    } catch (err) {
      this.setState({
        error: true
      });
    } finally {
      this.handleUpdateLoading(false);
    }
  };

  handleDetachtracks = () => {
    for (const kind of ['audioinput', 'audiooutput', 'videoinput']) {
      const { state } = this;

      if (state[`${kind}track`]) {
        utils.detachTrack(state[`${kind}track`]);
      }
    }
  };

  handleUpdateDeviceSelectionOptions = () =>
    navigator &&
    navigator.mediaDevices &&
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true
      })
      .then(utils.getDeviceSelectionOptions)
      .catch((err) => {
        throw err;
      });

  handleUpdateDeviceSelection = async (kind, deviceId) => {
    this.setState({
      [`selected${kind}`]: deviceId
    } as any);
    let track = null;

    switch (kind) {
      case 'audioinput':
        track = await utils.applyAudioInputDeviceSelection(
          deviceId,
          this.meetupRef.current.audioinput.current
        );
        this.setState({
          [`${kind}track`]: track
        } as any);
        break;

      case 'videoinput':
        track = await utils.applyVideoInputDeviceSelection(
          deviceId,
          this.meetupRef.current.videoinput.current
        );
        this.setState({
          [`${kind}track`]: track
        } as any);
        break;

      case 'audiooutput':
      default:
        break;
    }
  };

  handleDisableDevice = async (kind) => {
    const { state } = this;

    if (state[`${kind}track`]) {
      await utils.detachTrack(state[`${kind}track`]);
      this.setState({
        [`${kind}Enabled`]: false,
        [`${kind}track`]: null
      } as any);
    } else if (state[`selected${kind}`]) {
      this.handleUpdateDeviceSelection(kind, state[`selected${kind}`]);
      this.setState({
        [`${kind}Enabled`]: true
      } as any);
    }
  };

  handleJoinRoom = async ({ audioinput, videoinput }) => {
    const {
      user: {
        data: { userId, firstName, lastName }
      },
      roomId
    } = this.props;
    this.setState({
      loading: true
    });

    try {
      const client = this.context as Client;
      const channel = await client.getConversationBySid(roomId);
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
    } catch (err) {
      this.setState({
        errorDialog: true,
        errorTitle: 'Not Allowed',
        errorBody: 'You are not allowed to access this room'
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  handleUpdateLoading = (loading) => {
    this.setState({
      loading
    });
  };

  handleErrorDialogClose = () => {
    this.setState({
      errorDialog: false,
      errorTitle: '',
      errorBody: ''
    });
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

    console.log(roomId);

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
        meetupRef={this.meetupRef}
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
        updateLoading={this.handleUpdateLoading}
        initialDevices={this.initialDevices}
        handleDetachtracks={this.handleDetachtracks}
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

    if (userId === '') {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <>
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
        </>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(VideoCall));
