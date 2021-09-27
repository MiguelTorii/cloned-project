// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Tooltip from '@material-ui/core/Tooltip';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import FeaturedVideoIcon from '@material-ui/icons/FeaturedVideo';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
// import CastForEducationIcon from '@material-ui/icons/CastForEducation';

import { styles } from '../_styles/MeetUp/Controls';

type Props = {
  classes: Object,
  isConnected: boolean,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  isScreenSharingSupported: boolean,
  isSharing: boolean,
  isSharingData: boolean,
  isVideoSwitching: boolean,
  isAudioSwitching: boolean,
  endCall: Function,
  disableVideo: Function,
  disableAudio: Function,
  dominantToggle: Function,
  dominantView: boolean,
  shareScreen: Function
  // shareData: Function
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
      dominantToggle,
      dominantView,
      isVideoSwitching,
      isAudioSwitching,
      disableVideo,
      disableAudio,
      endCall,
      shareScreen
    } = this.props;

    return (
      <div className={classes.root}>
        <Tooltip
          arrow
          classes={{
            tooltip: classes.tooltip
          }}
          placement="bottom"
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          <div>
            <Fab
              size="small"
              color={isVideoEnabled ? 'primary' : 'default'}
              aria-label="disable-video"
              onClick={disableVideo}
              className={classes.fab}
              disabled={!isConnected || isVideoSwitching}
            >
              {!isVideoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
            </Fab>
          </div>
        </Tooltip>
        <Tooltip
          arrow
          classes={{
            tooltip: classes.tooltip
          }}
          placement="bottom"
          title={isAudioEnabled ? 'Turn off microphone' : 'Turn on microphone'}
        >
          <div>
            <Fab
              size="small"
              color={isAudioEnabled ? 'primary' : 'default'}
              aria-label="disable-audio"
              className={classes.fab}
              onClick={disableAudio}
              disabled={!isConnected || isAudioSwitching}
            >
              {!isAudioEnabled ? <MicOffIcon /> : <MicIcon />}
            </Fab>
          </div>
        </Tooltip>
        <Tooltip
          arrow
          classes={{
            tooltip: classes.tooltip
          }}
          placement="bottom"
          title="Leave call"
        >
          <div>
            <Fab
              color="secondary"
              aria-label="call-end"
              className={classes.hangup}
              onClick={endCall}
              disabled={!isConnected}
            >
              <CallEndIcon />
            </Fab>
          </div>
        </Tooltip>
        <Tooltip
          arrow
          classes={{
            tooltip: classes.tooltip
          }}
          placement="bottom"
          title={isSharing ? 'Stop presenting' : 'Present your screen'}
        >
          <div>
            <Fab
              size="small"
              color={!isSharing ? 'primary' : 'default'}
              aria-label="share-screen"
              className={classes.fab}
              disabled={!isScreenSharingSupported || isSharingData || !isConnected}
              onClick={shareScreen}
            >
              {!isSharing ? <ScreenShareIcon /> : <StopScreenShareIcon />}
            </Fab>
          </div>
        </Tooltip>
        <Tooltip
          arrow
          classes={{
            tooltip: classes.tooltip
          }}
          placement="bottom"
          title={!dominantView ? 'Speaker View' : 'Gallery View'}
        >
          <div>
            <Fab
              size="small"
              color="primary"
              aria-label="share-screen"
              className={classes.fab}
              disabled={!isConnected}
              onClick={dominantToggle}
            >
              {!dominantView ? <FeaturedVideoIcon /> : <ViewModuleIcon />}
            </Fab>
          </div>
        </Tooltip>
        {/* <Fab
          size='small'
          color={!isSharingData ? 'primary' : 'default'}
          aria-label='share-data'
          className={classes.fab}
          disabled={isSharing || !isConnected}
          onClick={shareData}
        >
          <CastForEducationIcon />
        </Fab> */}
      </div>
    );
  }
}

export default withStyles(styles)(Controls);
