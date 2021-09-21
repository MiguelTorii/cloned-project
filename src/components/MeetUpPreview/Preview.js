/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import SettingsIcon from '@material-ui/icons/Settings';
import Box from '@material-ui/core/Box';
import ReplyIcon from '@material-ui/icons/Reply';
import DeviceSettings from '../MeetUp/DeviceSettings';
import Dialog from '../Dialog/Dialog';

import { styles } from '../_styles/MeetUpPreview';

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  selectedaudioinput: string,
  selectedvideoinput: string,
  audioinput: Array<Object>,
  videoinput: Array<Object>,
  error: boolean,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  onUpdateDeviceSelection: Function,
  onDisableDevice: Function,
  pushTo: Function,
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

  handleChange = (kind) => (event) => {
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

  goBack = () => {
    const { pushTo } = this.props;
    pushTo('/');
  };

  render() {
    const {
      classes,
      firstName,
      lastName,
      selectedaudioinput,
      selectedvideoinput,
      isVideoEnabled,
      isAudioEnabled,
      audioinput,
      videoinput,
      error,
      profileImage,
      onJoin
    } = this.props;
    const { open } = this.state;
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          <Typography component="p" variant="h4" className={classes.ready}>
            Ready to Join?{' '}
            <span role="img" aria-label="rocket">
              🚀
            </span>
          </Typography>
          <div className={classes.videoWrapper}>
            <audio ref={this.audioinput} id="audioinputpreview" autoPlay />
            <video
              className={classes.video}
              ref={this.videoinput}
              id="videoinputpreview"
              autoPlay
            />
            {!isVideoEnabled && (
              <div className={classes.profile}>
                {profileImage ? (
                  <Avatar
                    alt={initials}
                    variant="square"
                    src={profileImage}
                    classes={{
                      img: classes.avatarImage
                    }}
                    className={classes.profileImage}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 20
                    }}
                  />
                ) : (
                  <Typography className={classes.initials}>
                    {initials}
                  </Typography>
                )}
              </div>
            )}
          </div>
          <Box
            className={classes.box}
            display="flex"
            alignItems="space-between"
            justifyContent="space-between"
          >
            <Button
              color="default"
              aria-label="disable-video"
              disabled={selectedvideoinput === ''}
              onClick={this.disableCamera}
              className={classes.control}
              size="small"
            >
              <Box>
                {!isVideoEnabled ? (
                  <VideocamOffIcon className={classes.icon} />
                ) : (
                  <VideocamIcon className={classes.icon} />
                )}
                <Typography className={classes.controlLabel}>
                  Turn {isVideoEnabled ? 'off' : 'on'} camera
                </Typography>
              </Box>
            </Button>
            <Button
              color="default"
              aria-label="disable-audio"
              disabled={selectedaudioinput === ''}
              onClick={this.disableAudio}
              className={classes.control}
              size="small"
            >
              <Box>
                {!isAudioEnabled ? (
                  <MicOffIcon className={classes.icon} />
                ) : (
                  <MicIcon className={classes.icon} />
                )}
                <Typography className={classes.controlLabel}>
                  {isAudioEnabled ? 'Mute your' : 'Turn on'} mic
                </Typography>
              </Box>
            </Button>
            <Button
              color="default"
              className={classes.control}
              aria-label="Settings"
              onClick={this.openSettings}
              size="small"
            >
              <Box>
                <SettingsIcon className={classes.icon} />
                <Typography className={classes.controlLabel}>
                  A/V Settings
                </Typography>
              </Box>
            </Button>
            <Button
              color="default"
              className={classes.control}
              aria-label="Settings"
              onClick={this.goBack}
              size="small"
            >
              <Box>
                <ReplyIcon className={classes.icon} />
                <Typography className={classes.controlLabel}>Back</Typography>
              </Box>
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            className={classes.letsGo}
            onClick={onJoin}
            disabled={error}
          >
            LET'S GO!{' '}
            <span className={classes.tada} role="img" aria-label="tada">
              {' '}
              🎉
            </span>
          </Button>
          <Typography component="p" className={classes.rules}>
            By joining this call, you agree to abide by and respect CircleIn’s
            Community Rules
          </Typography>
        </Paper>
        <DeviceSettings
          closeSettings={this.closeSettings}
          handleChange={this.handleChange}
          videoinput={videoinput}
          audioinput={audioinput}
          selectedvideoinput={selectedvideoinput}
          selectedaudioinput={selectedaudioinput}
          openSettings={open}
        />
        <Dialog
          className={classes.dialog}
          disableEscapeKeyDown
          title="Permissions Not Granted"
          open={error}
          showHeader={false}
        >
          <Typography color="textPrimary" paragraph>
            To access this feature you need to grant permissions to use your
            media devices.
          </Typography>
          <Typography color="textPrimary">
            Refresh the page after you have granted permissions.
          </Typography>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Preview);
