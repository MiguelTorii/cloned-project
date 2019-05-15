/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import Video from 'twilio-video';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import SettingsIcon from '@material-ui/icons/Settings';
import type { User } from '../../types/models';
import { VIDEO_SHARE_URL } from '../../constants/routes';

const styles = theme => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: 0,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 240,
    minHeight: 200
  },
  videoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  mediaDevices: {
    width: '100%',
    position: 'absolute',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white',
    zIndex: 1200
  },
  mediaControls: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200
  },
  profile: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1100
  },
  fab: {
    margin: theme.spacing.unit * 2
  },
  video: {
    width: '320px    !important',
    height: 'auto   !important'
  },
  margin: {
    marginTop: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: User,
  selectedaudioinput: string,
  selectedvideoinput: string,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  roomName: string,
  updateMediaInput: Function,
  updateMediaState: Function,
  joinRoom: Function,
  updateLoading: Function
};

type State = {
  audioinput: Array<Object>,
  videoinput: Array<Object>,
  open: boolean
};

class Preview extends React.Component<Props, State> {
  state = {
    audioinput: [],
    videoinput: [],
    open: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.audioinput = React.createRef();
    // $FlowIgnore
    this.videoinput = React.createRef();
    this.previewVideo = null;
    this.previewAudio = null;
  }

  componentDidMount = async () => {
    const { updateLoading, updateMediaInput } = this.props;
    updateLoading(true);
    const deviceOptions = await this.getDeviceSelectionOptions();
    const keys = Object.keys(deviceOptions);

    for (const key of keys) {
      this.setState({ [key]: deviceOptions[key] });
      const device = deviceOptions[key].find(
        item => item.deviceId === 'default'
      );
      if (device) {
        updateMediaInput(`selected${device.kind}`, device.deviceId);
      } else if (deviceOptions[key].length > 0) {
        const selectedDevice = deviceOptions[key][0];
        updateMediaInput(
          `selected${selectedDevice.kind}`,
          selectedDevice.deviceId
        );
      }
    }

    updateLoading(false);
  };

  componentDidUpdate = prevProps => {
    const { selectedaudioinput, selectedvideoinput } = this.props;
    if (
      selectedvideoinput !== '' &&
      prevProps.selectedvideoinput !== selectedvideoinput
    ) {
      if (this.previewVideo) {
        this.detachTrack(this.previewVideo);
      }

      this.applyVideoInputDeviceSelection(
        selectedvideoinput,
        this.videoinput.current
      );
    }

    if (
      selectedaudioinput !== '' &&
      prevProps.selectedaudioinput !== selectedaudioinput
    ) {
      if (this.previewAudio) {
        this.detachTrack(this.previewAudio);
      }

      this.applyAudioInputDeviceSelection(
        selectedaudioinput,
        this.audioinput.current
      );
    }
  };

  componentWillUnmount = () => {
    if (this.previewVideo) {
      this.detachTrack(this.previewVideo);
    }

    if (this.previewAudio) {
      this.detachTrack(this.previewAudio);
    }
  };

  handleChange = kind => event => {
    const { updateMediaInput } = this.props;
    updateMediaInput(kind, event.target.value);
  };

  getDeviceSelectionOptions = () => {
    return (
      (navigator &&
        navigator.mediaDevices &&
        navigator.mediaDevices
          .enumerateDevices()
          .then((deviceInfos: Array<Object>) => {
            const kinds = ['audioinput', 'videoinput'];
            return kinds.reduce(
              (deviceSelectionOptions: Object, kind: string) => {
                // eslint-disable-next-line no-param-reassign
                deviceSelectionOptions[kind] = this.getDevicesOfKind(
                  deviceInfos,
                  kind
                );
                return deviceSelectionOptions;
              },
              {}
            );
          })) ||
      {}
    );
  };

  getDevicesOfKind = (deviceInfos: Array<Object>, kind: string) => {
    // $FlowIgnore
    return deviceInfos.filter((deviceInfo: Object) => {
      return deviceInfo.kind === kind;
    });
  };

  applyAudioInputDeviceSelection = async (deviceId, audio) => {
    const localTrack = await Video.createLocalAudioTrack({
      deviceId
    });
    this.previewAudio = localTrack;
    localTrack.attach(audio);
  };

  applyVideoInputDeviceSelection = async (deviceId, video) => {
    const localTrack = await Video.createLocalVideoTrack({
      deviceId
    });
    this.previewVideo = localTrack;
    localTrack.attach(video);
  };

  disableCamera = () => {
    if (this.previewVideo) {
      const { updateMediaState } = this.props;
      const newState = !this.previewVideo.isEnabled;
      this.previewVideo.enable(newState);
      updateMediaState('isVideoEnabled', newState);
    }
  };

  disableAudio = () => {
    if (this.previewAudio) {
      const { updateMediaState } = this.props;
      const newState = !this.previewAudio.isEnabled;
      this.previewAudio.enable(newState);
      updateMediaState('isAudioEnabled', newState);
    }
  };

  openSettings = () => {
    this.setState({ open: true });
  };

  closeSettings = () => {
    this.setState({ open: false });
  };

  detachTrack = track => {
    track.detach().forEach(detachedElement => {
      detachedElement.remove();
    });
    track.stop();
  };

  audioinput: Object;

  videoinput: Object;

  previewAudio: Object | null;

  previewVideo: Object | null;

  render() {
    const {
      classes,
      selectedaudioinput,
      selectedvideoinput,
      isVideoEnabled,
      isAudioEnabled,
      roomName,
      joinRoom,
      user: { firstName, lastName, profileImage }
    } = this.props;
    const { audioinput, videoinput, open } = this.state;
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          <div className={classes.videoWrapper}>
            <audio ref={this.audioinput} id="audioinputpreview" autoPlay />
            <video
              className={classes.video}
              ref={this.videoinput}
              id="videoinputpreview"
              autoPlay
            />
            <div className={classes.mediaDevices}>
              <Fab
                color="primary"
                className={classes.fab}
                aria-label="Settings"
                onClick={this.openSettings}
                size="small"
              >
                <SettingsIcon />
              </Fab>
            </div>
            <div className={classes.mediaControls}>
              <Fab
                color={isVideoEnabled ? 'primary' : 'default'}
                aria-label="disable-video"
                onClick={this.disableCamera}
                className={classes.fab}
                size="small"
              >
                {!isVideoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
              </Fab>
              <Fab
                color={isAudioEnabled ? 'primary' : 'default'}
                aria-label="disable-audio"
                onClick={this.disableAudio}
                className={classes.fab}
                size="small"
              >
                {!isAudioEnabled ? <MicOffIcon /> : <MicIcon />}
              </Fab>
            </div>
            {!isVideoEnabled && (
              <div className={classes.profile}>
                <Avatar
                  alt={initials}
                  src={profileImage !== '' && profileImage}
                  style={{ width: 60, height: 60 }}
                >
                  {initials}
                </Avatar>
                {firstName !== '' && (
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >{`${firstName} ${lastName}`}</Typography>
                )}
              </div>
            )}
          </div>
          <Typography component="p" variant="h4" className={classes.margin}>
            Ready to Join?
          </Typography>
          <Typography component="p" variant="h5" className={classes.margin}>
            First, share the link to invite others to join you
          </Typography>
          <Typography component="p" variant="h6" className={classes.margin}>
            {`${VIDEO_SHARE_URL}/${roomName}`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={joinRoom}
          >
            Join Meet up
          </Button>
        </Paper>
        <Dialog
          open={open}
          onClose={this.closeSettings}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">General</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <InputLabel htmlFor="videoinput-native-helper">Video</InputLabel>
              <NativeSelect
                value={selectedvideoinput}
                onChange={this.handleChange('selectedvideoinput')}
                input={
                  <Input name="videoinput" id="videoinput-native-helper" />
                }
              >
                {videoinput.map(item => (
                  <option key={item.deviceId} value={item.deviceId}>
                    {item.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="audioinput-native-helper">Mic</InputLabel>
              <NativeSelect
                value={selectedaudioinput}
                onChange={this.handleChange('selectedaudioinput')}
                input={
                  <Input name="audioinput" id="audioinput-native-helper" />
                }
              >
                {audioinput.map(item => (
                  <option key={item.deviceId} value={item.deviceId}>
                    {item.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeSettings} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Preview);
