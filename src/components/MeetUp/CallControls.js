// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CallEndIcon from '@material-ui/icons/CallEnd';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Badge from '@material-ui/core/Badge';

import { ReactComponent as ChatIcon } from 'assets/svg/chat.svg';
// import { ReactComponent as ParticipantIcon } from 'assets/svg/participants.svg';
import { ReactComponent as ShareScreenIcon } from 'assets/svg/share-screen.svg';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1400,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  mainControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disalbedRoot: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 0,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    opacity: 0.85
  },
  fab: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  controlButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  controlIcons: {
    height: 40,
    width: 40,
    color: theme.circleIn.palette.white,
    [theme.breakpoints.down('sm')]: {
      height: 30,
      width: 30,
    }
  },
  controlLabel: {
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    color: theme.circleIn.palette.white
  },
  hangup: {
    background: theme.circleIn.palette.dangerBackground,
    border: `1px solid ${theme.circleIn.palette.dangerBackground}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    margin: theme.spacing(2, 3),
    color: theme.circleIn.palette.white,
    '&:hover': {
      background: theme.circleIn.palette.dangerBackground,
      color: theme.circleIn.palette.white,
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 1),
    }
  },
  disableControl: {
    color: `${theme.circleIn.palette.white} !important`,
    backgroundColor: `${theme.circleIn.palette.danger} !important`
  },
  meetingDetailShow: {
    color: theme.circleIn.palette.brand
  },
  meetingDetail: {
    backgroundColor: theme.circleIn.palette.appBar,
    border: `1px solid ${theme.circleIn.palette.appBar}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    margin: theme.spacing(2, 3),
    color: theme.circleIn.palette.white,
    '&:hover': {
      background: theme.circleIn.palette.appBar,
      color: theme.circleIn.palette.white,
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 1),
    }
  },
  tooltip: {
    fontSize: 14,
  },
  badge: {
    top: 10,
    right: 15,
    zIndex: 1700
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
  isVideoSwitching: boolean,
  isAudioSwitching: boolean,
  isOpenMeetingDetails: boolean,
  endCall: Function,
  disableVideo: Function,
  disableAudio: Function,
  shareScreen: Function,
  openMeetingDetails: Function,
  localSharing: number,
  unreadMessageCount: ?number
  // shareData: Function
};

type State = {};

class Controls extends React.PureComponent<Props, State> {
  constructor(props){
    super(props)

    this.state = {
      windowWidth: window.innerWidth
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth })
  }

  renderControls = () => {
    const {
      classes,
      isConnected,
      isVideoEnabled,
      isAudioEnabled,
      isScreenSharingSupported,
      isSharing,
      isSharingData,
      toggleChat,
      isVideoSwitching,
      isAudioSwitching,
      disableVideo,
      disableAudio,
      localSharing,
      unreadMessageCount,
      shareScreen,
    } = this.props
    const { windowWidth } = this.state

    return (
      <div className={classes.mainControls}>
        <Button
          size='small'
          color='default'
          aria-label='disable-audio'
          className={classes.fab}
          onClick={disableAudio}
          disabled={!isConnected || isAudioSwitching}
        >
          {!isAudioEnabled
            ? <div className={classes.controlButtons}>
              <MicOffIcon className={classes.controlIcons} />
              {windowWidth > 720 && <span className={classes.controlLabel}>
                Turn on Mic
              </span>}
            </div>
            : <div className={classes.controlButtons}>
              <MicIcon className={classes.controlIcons} />
              {windowWidth > 720 && <span className={classes.controlLabel}>
                Turn off Mic
              </span>}
            </div>}
        </Button>

        <Button
          size='small'
          color='default'
          aria-label='disable-video'
          onClick={disableVideo}
          className={classes.fab}
          disabled={!isConnected || isVideoSwitching}
        >
          {!isVideoEnabled
            ? <div className={classes.controlButtons}>
              <VideocamOffIcon className={classes.controlIcons}/>
              {windowWidth > 720 && <span className={classes.controlLabel}>
                  Stop Camera
              </span>}
            </div>
            : <div className={classes.controlButtons}>
              <VideocamIcon className={classes.controlIcons}/>
              {windowWidth > 720 && <span className={classes.controlLabel}>
                  Start Camera
              </span>}
            </div>}
        </Button>
        {windowWidth > 720 && <Button
          size='small'
          color='default'
          aria-label='share-screen'
          className={classes.fab}
          disabled={!isScreenSharingSupported || isSharingData || !isConnected}
          onClick={shareScreen}
        >
          {localSharing !== 2
            ? <div className={classes.controlButtons}>
              <ShareScreenIcon className={classes.controlIcons}/>
              {windowWidth > 720 && <span className={classes.controlLabel}>
                  Sharing Screen
              </span>}
            </div>
            : <div className={classes.controlButtons}>
              <StopScreenShareIcon className={classes.controlIcons}/>
              {windowWidth > 720 && <span className={classes.controlLabel}>
                  Stop Sharing
              </span>}
            </div>}
        </Button>}

        {/* <Button
          size='small'
          color='default'
          aria-label='share-screen'
          className={classes.fab}
          disabled={!isScreenSharingSupported || isSharingData || !isConnected}
          onClick={shareScreen}
        >
          {!isSharing
            ? <div className={classes.controlButtons}>
              <ParticipantIcon className={classes.controlIcons}/>
              <span className={classes.controlLabel}>
                  Participant
              </span>
            </div>
            : <div className={classes.controlButtons}>
              <ParticipantIcon className={classes.controlIcons}/>
              <span className={classes.controlLabel}>
                  Participant
              </span>
            </div>}
        </Button> */}

        <Badge
          badgeContent={unreadMessageCount}
          color="error"
          classes={{
            badge: classes.badge
          }}
        >
          <Button
            size='small'
            color="default"
            aria-label='share-screen'
            className={classes.fab}
            disabled={!isConnected}
            onClick={toggleChat}
          >
            {!isSharing
              ? <div className={classes.controlButtons}>
                <ChatIcon className={classes.controlIcons}/>
                {windowWidth > 720 && <span className={classes.controlLabel}>
                Chat
                </span>}
              </div>
              : <div className={classes.controlButtons}>
                <ChatIcon className={classes.controlIcons}/>
                {windowWidth > 720 && <span className={classes.controlLabel}>
                  Chat
                </span>}
              </div>}
          </Button>
        </Badge>
      </div>
    )
  }

  render() {
    const {
      classes,
      isConnected,
      isOpenMeetingDetails,
      endCall,
      openMeetingDetails
    } = this.props

    const { windowWidth } = this.state

    return (
      <div className={!isConnected ? classes.disalbedRoot : classes.root}>
        <div className={classes.meetingDetails}>
          <Button
            variant="contained"
            color="secondary"
            aria-label='meeting-details'
            className={classes.meetingDetail}
            onClick={openMeetingDetails}
            endIcon={isOpenMeetingDetails
              ? <ArrowDropDownIcon className={classes.meetingDetailShow} />
              : <ArrowDropUpIcon className={classes.meetingDetailShow} />
            }
          >
            {windowWidth > 720 ?  'Study Room Details' : <AddCircleIcon />}
          </Button>
        </div>
        {this.renderControls()}
        <div className={classes.endMeeting}>
          <Button
            variant="contained"
            color="secondary"
            aria-label='call-end'
            className={classes.hangup}
            classes={{
              disabled: classes.disableControl
            }}
            onClick={endCall}
            disabled={!isConnected}
          >
            {windowWidth > 720 ? 'Exit Study Room' : <CallEndIcon />}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Controls);
