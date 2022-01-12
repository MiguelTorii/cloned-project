import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Badge from '@material-ui/core/Badge';
import Tooltip from '../../containers/Tooltip/Tooltip';
import { ReactComponent as ChatIcon } from '../../assets/svg/chat.svg';
import { ReactComponent as ParticipantIcon } from '../../assets/svg/participants.svg';
import { ReactComponent as ShareScreenIcon } from '../../assets/svg/share-screen.svg';
import { ReactComponent as SharedScreenIcon } from '../../assets/svg/shared-screen.svg';
import { styles } from '../_styles/MeetUp/CallControls';

type Props = {
  classes?: Record<string, any>;
  isConnected?: boolean;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  isScreenSharingSupported?: boolean;
  isSharing?: boolean;
  isVideoSwitching?: boolean;
  isAudioSwitching?: boolean;
  isOpenMeetingDetails?: boolean;
  endCall?: (...args: Array<any>) => any;
  disableVideo?: (...args: Array<any>) => any;
  disableAudio?: (...args: Array<any>) => any;
  shareScreen?: (...args: Array<any>) => any;
  openMeetingDetails?: (...args: Array<any>) => any;
  localSharing?: number;
  unreadMessageCount?: number | null | undefined;
  toggleChat?: any;
  dominantToggle?: any;
  dominantView?: any;
};

type State = {
  windowWidth: any;
};

class Controls extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth
    });
  };

  handleOpen = (value) => {
    const { toggleChat } = this.props;
    toggleChat(value);
  };

  renderControls = () => {
    const {
      classes,
      isConnected,
      isVideoEnabled,
      isAudioEnabled,
      isScreenSharingSupported,
      isSharing,
      isVideoSwitching,
      isAudioSwitching,
      disableVideo,
      disableAudio,
      localSharing,
      unreadMessageCount,
      shareScreen
    } = this.props;
    const { windowWidth } = this.state;
    return (
      <div className={classes.mainControls}>
        <Button
          size="small"
          color="default"
          aria-label="disable-audio"
          className={classes.fab}
          onClick={disableAudio}
          disabled={!isConnected || isAudioSwitching}
        >
          {!isAudioEnabled ? (
            <div className={classes.controlButtons}>
              <MicOffIcon className={cx(classes.controlIcons, classes.nonEffect)} />
              {windowWidth > 720 && <span className={classes.controlLabel}>Turn on Mic</span>}
            </div>
          ) : (
            <div className={classes.controlButtons}>
              <MicIcon className={classes.controlIcons} />
              {windowWidth > 720 && <span className={classes.controlLabel}>Turn off Mic</span>}
            </div>
          )}
        </Button>

        <Button
          size="small"
          color="default"
          aria-label="disable-video"
          onClick={disableVideo}
          className={classes.fab}
          disabled={!isConnected || isVideoSwitching}
        >
          {!isVideoEnabled ? (
            <div className={classes.controlButtons}>
              <VideocamOffIcon className={cx(classes.controlIcons, classes.nonEffect)} />
              {windowWidth > 720 && <span className={classes.controlLabel}>Start Camera</span>}
            </div>
          ) : (
            <div className={classes.controlButtons}>
              <VideocamIcon className={classes.controlIcons} />
              {windowWidth > 720 && <span className={classes.controlLabel}>Stop Camera</span>}
            </div>
          )}
        </Button>
        {windowWidth > 720 && (
          <Button
            size="small"
            color="default"
            aria-label="share-screen"
            className={classes.fab}
            disabled={!isScreenSharingSupported || !isConnected}
            onClick={shareScreen}
          >
            {!localSharing ? (
              <div className={classes.controlButtons}>
                <ShareScreenIcon className={classes.controlIcons} />
                {windowWidth > 720 && <span className={classes.controlLabel}>Sharing Screen</span>}
              </div>
            ) : (
              <div className={cx(classes.controlButtons, isSharing && classes.sharingBtn)}>
                <SharedScreenIcon className={classes.controlIcons} />
                {windowWidth > 720 && (
                  <span
                    className={cx(classes.controlLabel, localSharing === 2 && classes.sharingBtn)}
                  >
                    Sharing
                  </span>
                )}
              </div>
            )}
          </Button>
        )}

        <Tooltip
          id={9062}
          placement="top"
          text="Open a chat with study room participants and see a list of participants and invitees. 🎉"
          totalSteps={4}
          okButton="Nice!"
          completedSteps={2}
        >
          {windowWidth > 720 && (
            <Button
              size="small"
              color="default"
              aria-label="participant"
              className={classes.fab}
              disabled={!isScreenSharingSupported || !isConnected}
              onClick={() => this.handleOpen(0)}
            >
              <div className={classes.controlButtons}>
                <ParticipantIcon className={classes.controlIcons} />
                {windowWidth > 720 && <span className={classes.controlLabel}>Participant</span>}
              </div>
            </Button>
          )}
          <Badge
            badgeContent={unreadMessageCount}
            color="error"
            classes={{
              badge: classes.badge
            }}
          >
            <Button
              size="small"
              color="default"
              aria-label="chat"
              className={classes.fab}
              disabled={!isConnected}
              onClick={() => this.handleOpen(1)}
            >
              {!isSharing ? (
                <div className={classes.controlButtons}>
                  <ChatIcon className={classes.controlIcons} />
                  {windowWidth > 720 && <span className={classes.controlLabel}>Chat</span>}
                </div>
              ) : (
                <div className={classes.controlButtons}>
                  <ChatIcon className={classes.controlIcons} />
                  {windowWidth > 720 && <span className={classes.controlLabel}>Chat</span>}
                </div>
              )}
            </Button>
          </Badge>
        </Tooltip>
      </div>
    );
  };

  render() {
    const { classes, isConnected, isOpenMeetingDetails, endCall, openMeetingDetails } = this.props;
    const { windowWidth } = this.state;
    return (
      <div className={!isConnected ? classes.disalbedRoot : classes.root}>
        <div className={classes.meetingDetails}>
          <Button
            variant="contained"
            color="secondary"
            aria-label="meeting-details"
            className={classes.meetingDetail}
            onClick={openMeetingDetails}
            endIcon={
              isOpenMeetingDetails ? (
                <ArrowDropDownIcon className={classes.meetingDetailShow} />
              ) : (
                <ArrowDropUpIcon className={classes.meetingDetailShow} />
              )
            }
          >
            {windowWidth > 720 ? 'Study Room Details' : <AddCircleIcon />}
          </Button>
        </div>
        {this.renderControls()}
        <div className={classes.endMeeting}>
          <Button
            variant="contained"
            color="secondary"
            aria-label="call-end"
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

export default withStyles(styles as any)(Controls);
