/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import SettingsIcon from '@material-ui/icons/Settings';
import DialogTitle from '../DialogTitle';
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
    height: 180,
    width: 320,
    backgroundColor: 'black',
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
    width: 'auto    !important',
    maxWidth: '320px !important',
    height: '100%   !important'
  },
  margin: {
    marginTop: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  roomName: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  selectedaudioinput: string,
  selectedvideoinput: string,
  audioinput: Array<Object>,
  videoinput: Array<Object>,
  error: boolean,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  onUpdateDeviceSelection: Function,
  onDisableDevice: Function,
  onJoin: Function
};

type State = {
  open: boolean
};

class Preview extends React.Component<Props, State> {
  state = {
    open: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.audioinput = React.createRef();
    // $FlowIgnore
    this.videoinput = React.createRef();
  }

  handleChange = kind => event => {
    const { onUpdateDeviceSelection } = this.props;
    onUpdateDeviceSelection(kind, event.target.value);
  };

  disableCamera = () => {
    const { onDisableDevice } = this.props;
    onDisableDevice('videoinput');
  };

  disableAudio = () => {
    const { onDisableDevice } = this.props;
    onDisableDevice('audioinput');
  };

  openSettings = () => {
    this.setState({ open: true });
  };

  closeSettings = () => {
    this.setState({ open: false });
  };

  audioinput: Object;

  videoinput: Object;

  previewAudio: Object | null;

  previewVideo: Object | null;

  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      selectedaudioinput,
      selectedvideoinput,
      isVideoEnabled,
      isAudioEnabled,
      roomName,
      audioinput,
      videoinput,
      error,
      onJoin
    } = this.props;
    const { open } = this.state;
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
                disabled={selectedvideoinput === ''}
                onClick={this.disableCamera}
                className={classes.fab}
                size="small"
              >
                {!isVideoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
              </Fab>
              <Fab
                color={isAudioEnabled ? 'primary' : 'default'}
                aria-label="disable-audio"
                disabled={selectedaudioinput === ''}
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
                  src={profileImage !== '' ? profileImage : ''}
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
            onClick={onJoin}
            disabled={error}
          >
            Join Meet up
          </Button>
        </Paper>
        <Dialog
          open={open}
          onClose={this.closeSettings}
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" onClose={this.closeSettings}>
            General
          </DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <InputLabel htmlFor="videoinput-native-helper">Video</InputLabel>
              <NativeSelect
                value={selectedvideoinput}
                onChange={this.handleChange('videoinput')}
                input={
                  <Input name="videoinput" id="videoinput-native-helper" />
                }
              >
                {videoinput.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="audioinput-native-helper">Mic</InputLabel>
              <NativeSelect
                value={selectedaudioinput}
                onChange={this.handleChange('audioinput')}
                input={
                  <Input name="audioinput" id="audioinput-native-helper" />
                }
              >
                {audioinput.map(item => (
                  <option key={item.value} value={item.value}>
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
        <Dialog
          open={error}
          disableEscapeKeyDown
          disableBackdropClick
          fullWidth
          aria-labelledby="permissions-dialog-title"
        >
          <DialogTitle id="permissions-dialog-title" onClose={null}>
            Permissions Not Granted
          </DialogTitle>
          <DialogContent>
            <DialogContentText color="textPrimary" paragraph>
              To access this feature you need to grant permissions to use your
              media devices.
            </DialogContentText>
            <DialogContentText color="textPrimary">
              Refresh the page after you have granted permissions.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Preview);
