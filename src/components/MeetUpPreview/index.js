/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import SettingsIcon from '@material-ui/icons/Settings';
import Box from '@material-ui/core/Box'
import ReplyIcon from '@material-ui/icons/Reply';
import DeviceSettings from '../MeetUp/DeviceSettings';
import Dialog, { dialogStyle } from '../Dialog';

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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 654,
    height: 612,
    minWidth: 240,
  },
  videoWrapper: {
    width: '100%',
    borderRadius: 20,
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
  initials: {
    fontWeight:700,
    fontSize: 150,
    color: '#000000'
  },
  profile: {
    width: '100%',
    height: '100%',
    backgroundColor: '#C4C4C4',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1100
  },
  control: {
    position: 'relative',
    minWidth: 130,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 70,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 40
    }
  },
  controlLabel: {
    position: 'absolute',
    left: 0,
    color: theme.circleIn.palette.secondaryText,
    fontSize: 16,
    fontWeight: 700,
    bottom: -2,
    minWidth: 130,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  video: {
    width: '100% !important',
    objectFit: 'cover',
    borderRadius: 20,
    height: '248px  !important',
    transform: 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)', /* Safari and Chrome */
    '-moz-transform': 'rotateY(180deg)' /* Firefox */
  },
  letsGo: {
    margin: theme.spacing(4, 0),
    minWidth: 340,
    borderRadius: 20,
    color: theme.circleIn.palette.white,
    fontWeight: 700,
    fontSize: 20,
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)'
  },
  ready: {
    textAlign: 'center',
    borderBottom: '1px solid #FFFFFF',
    padding: theme.spacing(),
    fontSize: 24,
    fontWeight: 400,
    margin: theme.spacing(2, 0),
    width: '100%'
  },
  margin: {
    marginTop: theme.spacing(2)
  },
  tada: {
    marginLeft: theme.spacing()
  },
  dialog: {
    ...dialogStyle,
    width: 600,
  },
  rules: {
    fontSize: 16,
    fontWeight: 400
  },
  box: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 2, 1, 2),
    letterSpacing: 0.25,
    width: '100%',
    border: '1px solid #FFFFFF',
    borderRadius: 20,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 0
    }
  },
  icon: {
    fontSize: 50
  },
  avatarImage: {
    objectFit: 'fill'
  }
});

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

  goBack = () => {
    const { pushTo } = this.props
    pushTo('/')
  }

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
            Ready to Join? <span role='img' aria-label='rocket'>🚀</span>
          </Typography>
          <div className={classes.videoWrapper}>
            <audio ref={this.audioinput} id="audioinputpreview" autoPlay />
            <video
              className={classes.video}
              ref={this.videoinput}
              id="videoinputpreview"
              autoPlay
            />
            {!isVideoEnabled && <div className={classes.profile}>
              {profileImage
                ? <Avatar
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
                    borderRadius: 20,
                  }}
                />
                : <Typography
                  className={classes.initials}
                >
                  {initials}
                </Typography>
              }
            </div>}
          </div>
          <Box
            className={classes.box}
            display='flex'
            alignItems='space-between'
            justifyContent='space-between'
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
                {!isVideoEnabled ? <VideocamOffIcon className={classes.icon} /> : <VideocamIcon className={classes.icon} />}
                <Typography className={classes.controlLabel}>Turn {isVideoEnabled ? 'off' : 'on'} camera</Typography>
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
                {!isAudioEnabled ? <MicOffIcon className={classes.icon} /> : <MicIcon className={classes.icon} />}
                <Typography className={classes.controlLabel}>{isAudioEnabled ? 'Mute your' : 'Turn on'} mic</Typography>
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
                <Typography className={classes.controlLabel}>A/V Settings</Typography>
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
            LET'S GO! <span className={classes.tada} role='img' aria-label='tada'> 🎉</span>
          </Button>
          <Typography component="p" className={classes.rules}>
            By joining this call, you agree to abide by and respect CircleIn’s Community Rules
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
          disableBackdropClick
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
