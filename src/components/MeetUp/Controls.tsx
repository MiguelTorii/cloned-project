import React from 'react';

import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CallEndIcon from '@material-ui/icons/CallEnd';
import FeaturedVideoIcon from '@material-ui/icons/FeaturedVideo';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import { styles } from '../_styles/MeetUp/Controls';

type Props = {
  classes: Record<string, any>;
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharingSupported: boolean;
  isSharing: boolean;
  isSharingData: boolean;
  isVideoSwitching: boolean;
  isAudioSwitching: boolean;
  endCall: (...args: Array<any>) => any;
  disableVideo: (...args: Array<any>) => any;
  disableAudio: (...args: Array<any>) => any;
  dominantToggle: (...args: Array<any>) => any;
  dominantView: boolean;
  shareScreen: (...args: Array<any>) => any;
  localSharing?: boolean;
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
      shareScreen,
      localSharing
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
      </div>
    );
  }
}

export default withStyles(styles as any)(Controls);
