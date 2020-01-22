// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 900
  },
  fab: {
    margin: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  isConnected: boolean,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  isScreenSharingSupported: boolean,
  isSharing: boolean,
  isSharingData: boolean,
  endCall: Function,
  disableVideo: Function,
  disableAudio: Function,
  shareScreen: Function,
  shareData: Function
};

type State = {};

class Controls extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      isConnected,
      isVideoEnabled,
      isAudioEnabled,
      isScreenSharingSupported,
      isSharing,
      isSharingData,
      disableVideo,
      disableAudio,
      endCall,
      shareScreen,
      shareData
    } = this.props;

    return (
      <div className={classes.root}>
        <Fab
          color={isVideoEnabled ? 'primary' : 'default'}
          aria-label="disable-video"
          onClick={disableVideo}
          className={classes.fab}
          disabled={!isConnected}
        >
          {!isVideoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
        </Fab>
        <Fab
          color={isAudioEnabled ? 'primary' : 'default'}
          aria-label="disable-audio"
          className={classes.fab}
          onClick={disableAudio}
          disabled={!isConnected}
        >
          {!isAudioEnabled ? <MicOffIcon /> : <MicIcon />}
        </Fab>
        <Fab
          color={!isSharing ? 'primary' : 'default'}
          aria-label="share-screen"
          className={classes.fab}
          disabled={!isScreenSharingSupported || isSharingData || !isConnected}
          onClick={shareScreen}
        >
          {!isSharing ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        </Fab>
        <Fab
          color={!isSharingData ? 'primary' : 'default'}
          aria-label="share-data"
          className={classes.fab}
          disabled={isSharing || !isConnected}
          onClick={shareData}
        >
          <CastForEducationIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="call-end"
          className={classes.fab}
          onClick={endCall}
          disabled={!isConnected}
        >
          <CallEndIcon />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(Controls);
