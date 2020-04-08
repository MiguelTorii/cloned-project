// @flow
import React, { Fragment } from 'react';
import Video from 'twilio-video';
import first from 'lodash/first';
import debounce from 'lodash/debounce';
import update from 'immutability-helper';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import type { User } from '../../types/models';
import { renewTwilioToken } from '../../api/chat';
import {
  checkVideoSession,
  setVideoInitiator,
  postVideoPoints
} from '../../api/video';
import MeetUpControls from '../../components/MeetUp/Controls';
import Thumbnails from '../../components/MeetUp/Thumbnails';
import NoParticipants from '../../components/MeetUp/NoParticipants';
import ActiveParticipant from '../../components/MeetUp/ActiveParticipant';
import Whiteboard from '../../components/MeetUp/Whiteboard';
import WhiteboardControls from '../../components/MeetUp/WhiteboardControls';
import VideoPointsDialog from '../../components/VideoPointsDialog';
import Dialog from '../../components/Dialog';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    width: '100vw',
    maxWidth: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    position: 'relative',
    // backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  points: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2),
    zIndex: 9999
  },
  pointsButton: {
    animation:
      'points 1s infinite, createBox 0.5s, vibrate 0.3s linear infinite both'
  },
  '@keyframes points': {
    '0%': {
      '-moz-box-shadow': '0 0 0 0 rgba(73, 175, 217, 0.4)',
      'box-shadow': '0 0 0 0 rgba(73, 175, 217, 0.4)'
    },
    '70%': {
      '-moz-box-shadow': '0 0 0 20px rgba(73, 175, 217, 0)',
      'box-shadow': '0 0 0 20px rgba(73, 175, 217, 0)'
    },
    '100%': {
      '-moz-box-shadow': '0 0 0 0 rgba(73, 175, 217, 0)',
      'box-shadow': '0 0 0 0 rgba(73, 175, 217, 0)'
    }
  },
  canvasWrapper: {
    backgroundColor: 'white',
    padding: theme.spacing(),
    minHeight: 100
  },
  canvasImg: {
    width: '300px !important',
    height: 'auto !important'
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: User,
  videoinput: string,
  audioinput: string,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  roomName: string,
  leaveRoom: Function,
  updateLoading: Function,
  enqueueSnackbar: Function
};

type State = {
  videoRoom: ?Object,
  localVideoTrack: ?Object,
  localAudioTrack: ?Object,
  screenTrack: ?Object,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  activeParticipant: ?Object,
  participants: Array<Object>,
  drawData: string,
  dataTrack: ?Object,
  isWhiteboardEnabled: boolean,
  open: boolean,
  pinnedParticipant: ?Object,
  points: boolean,
  noPointsAllowed: boolean,
  earned: boolean,
  openVideoPoints: boolean,
  postingPoints: boolean,
  lineWidth: number,
  color: string,
  canvasImg: string,
  isText: boolean,
  eraser: boolean
};

class MeetUp extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    // $FlowIgnore
    this.whiteboard = React.createRef();
    this.state = {
      videoRoom: null,
      isVideoEnabled: props.isVideoEnabled,
      isAudioEnabled: props.isAudioEnabled,
      localVideoTrack: null,
      localAudioTrack: null,
      screenTrack: null,
      activeParticipant: null,
      participants: [],
      drawData: '',
      dataTrack: null,
      isWhiteboardEnabled: false,
      open: false,
      pinnedParticipant: null,
      points: false,
      noPointsAllowed: false,
      earned: false,
      openVideoPoints: false,
      postingPoints: false,
      lineWidth: 1,
      color: 'black',
      canvasImg: '',
      isText: false,
      eraser: false
    };
  }

  componentDidMount = async () => {
    const {
      user: { userId },
      videoinput,
      audioinput,
      isVideoEnabled,
      isAudioEnabled,
      roomName,
      updateLoading
    } = this.props;
    this.notInitiator = false;
    this.initiator = false;
    this.pointsStarted = false;
    try {
      this.handleSession = debounce(this.handleSession, 1000);
      this.started = new Date().getTime();

      this.setState({
        open: !(
          navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
        )
      });

      const noPointsAllowed = await checkVideoSession({ userId });
      this.setState({ noPointsAllowed });

      updateLoading(true);
      const tracks = []

      if (isVideoEnabled && videoinput !== '') {
        const localVideoTrack = await Video.createLocalVideoTrack({
          deviceId: videoinput
        });
        this.setState({ localVideoTrack });
        tracks.push(localVideoTrack);
      }

      if(isAudioEnabled && audioinput !== '') {
        const localAudioTrack = await Video.createLocalAudioTrack({
          deviceId: audioinput
        });
        localAudioTrack.enable(isAudioEnabled);
        this.setState({ localAudioTrack });
        tracks.push(localAudioTrack)
      }

      const localDataTrack = new Video.LocalDataTrack();
      this.setState({
        dataTrack: localDataTrack
      });

      tracks.push(localDataTrack)      

      const accessToken = await renewTwilioToken({
        userId
      });

      const videoRoom = await Video.connect(accessToken, {
        name: roomName,
        tracks,
        dominantSpeaker: true,
        insights: false,
        video: isVideoEnabled && videoinput !== '',
        audio: isAudioEnabled && audioinput !== ''
      });
      const { localParticipant } = videoRoom;
      this.setState(prevState => ({
        participants: [
          ...prevState.participants,
          { type: 'local', participant: localParticipant }
        ]
      }));

      videoRoom.participants.forEach(participant => {
        this.addParticipant(participant);
        const { activeParticipant } = this.state;
        if (!activeParticipant)
          this.setState({ activeParticipant: participant });
        if (!this.initiator) this.notInitiator = true;
      });

      videoRoom.on('participantConnected', async participant => {
        this.addParticipant(participant);
        const { activeParticipant } = this.state;
        if (!activeParticipant)
          this.setState({ activeParticipant: participant });

        if (!this.notInitiator && !this.initiator) {
          this.initiator = true;
          const { sid } = videoRoom;
          const success = await setVideoInitiator({
            userId,
            sid
          });
          if (success) {
            const { enqueueSnackbar, classes } = this.props;
            enqueueSnackbar(
              'Congratulations, you have just earned some points because you initiated a Video meet-up. Good Work!',
              {
                variant: 'success',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                autoHideDuration: 5000,
                ContentProps: {
                  classes: {
                    root: classes.stackbar
                  }
                }
              }
            );
          }
        }
      });

      videoRoom.on('participantDisconnected', participant => {
        this.removeParticipant(participant);
        const { activeParticipant, participants } = this.state;
        if (activeParticipant && activeParticipant.sid === participant.sid) {
          const newActiveParticipant = participants.find(
            item =>
              item.participant.sid !== participant.sid && item.type !== 'local'
          );
          if (newActiveParticipant) {
            this.setState({ activeParticipant: newActiveParticipant });
          } else this.setState({ activeParticipant: null });
        }
      });

      videoRoom.on('dominantSpeakerChanged', participant => {
        if (participant) this.setState({ activeParticipant: participant });
      });

      videoRoom.on('disconnected', () => {
        this.stopVideoTrack();
        this.stopAudioTrack();
        this.stopScreenTrack();
        videoRoom.removeAllListeners();
        this.setState({
          videoRoom: null
        });
      });
      this.setState({ videoRoom });
      updateLoading(false);
    } catch (err) {
      updateLoading(false);
      this.leaveRoom();
    }
  };

  componentDidUpdate = () => {
    const { participants } = this.state;
    if (participants.length > 1 && !this.pointsStarted) {
      this.pointsStarted = true;
      this.handleSession();
    } else if (participants.length <= 1) this.pointsStarted = false;
  };

  componentWillUnmount = () => {
    const { videoRoom } = this.state;
    if (videoRoom) {
      videoRoom.disconnect();
    }

    if (
      this.handleSession.cancel &&
      typeof this.handleSession.cancel === 'function'
    )
      this.handleSession.cancel();
  };

  handleSession = () => {
    const { earned, points, noPointsAllowed } = this.state;
    if (this.pointsStarted && !earned && !points && !noPointsAllowed) {
      const elapsed = Number((new Date().getTime() - this.started) / 1000);

      if (elapsed > 300) {
        this.setState({ points: true });
      }
    }
    if (this.pointsStarted) this.handleSession();
  };

  handlePin = participant => {
    this.setState(({ pinnedParticipant }) => ({
      pinnedParticipant:
        pinnedParticipant && pinnedParticipant.sid === participant.sid
          ? null
          : participant
    }));
  };

  addParticipant = participant => {
    const newState = update(this.state, {
      participants: {
        $apply: b => {
          const index = b.findIndex(
            item => item.participant.identity === participant.identity
          );
          if (index === -1) {
            return [...b, { participant, type: 'remote' }];
          }

          return b;
        }
      }
    });

    this.setState(newState);
  };

  removeParticipant = participant => {
    const newState = update(this.state, {
      participants: {
        $apply: b => {
          return b.filter(
            item => item.participant.identity !== participant.identity
          );
        }
      }
    });
    this.setState(newState);
  };

  stopTrack = trackName => {
    // eslint-disable-next-line react/destructuring-assignment
    const track = this.state[trackName];

    if (track) {
      track.stop();
      this.setState({ [trackName]: null });
    }
  };

  stopScreenTrack = () => this.detachTrack('screenTrack');

  stopVideoTrack = () => this.detachTrack('localVideoTrack');

  stopAudioTrack = () => this.detachTrack('localAudioTrack');

  leaveRoom = async () => {
    const { videoRoom } = this.state;
    const { leaveRoom } = this.props;
    if (videoRoom) {
      await videoRoom.disconnect();
    }
    leaveRoom();
  };

  disableVideo = async () => {
    const { videoinput } = this.props;
    const { videoRoom, localVideoTrack, isVideoEnabled } = this.state;
    if (localVideoTrack && isVideoEnabled) {
      
      // localVideoTrack.enable(false);
      localVideoTrack.stop();
      if (videoRoom && videoRoom.localParticipant) {
        videoRoom.localParticipant.unpublishTrack(localVideoTrack);
      }
      this.setState({ isVideoEnabled: false });
    } else {
      const newLocalVideoTrack = await Video.createLocalVideoTrack({
        deviceId: videoinput
      });

      if (videoRoom && videoRoom.localParticipant) {
        videoRoom.localParticipant.publishTrack(newLocalVideoTrack);
      }

      this.setState({ localVideoTrack: newLocalVideoTrack });
      this.setState({ isVideoEnabled: true });
    }
  };

  disableAudio = () => {
    const { localAudioTrack } = this.state;
    if (localAudioTrack) {
      const isEnabled = localAudioTrack ? !localAudioTrack.isEnabled : false;
      localAudioTrack.enable(!localAudioTrack.isEnabled);
      this.setState({ isAudioEnabled: isEnabled });
    }
  };

  shareScreen = async () => {
    const { videoRoom, localVideoTrack, screenTrack } = this.state;

    if (!screenTrack && navigator && navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      const newScreenTrack = first(stream.getVideoTracks());

      newScreenTrack.addEventListener('ended', () => {
        this.shareScreen();
      });

      this.setState({
        screenTrack: new Video.LocalVideoTrack(newScreenTrack)
      });

      if (videoRoom && videoRoom.localParticipant) {
        videoRoom.localParticipant.publishTrack(newScreenTrack);
        if(localVideoTrack) videoRoom.localParticipant.unpublishTrack(localVideoTrack);
      }
    } else if (videoRoom && videoRoom.localParticipant) {
      videoRoom.localParticipant.unpublishTrack(screenTrack);
      if(localVideoTrack) videoRoom.localParticipant.publishTrack(localVideoTrack);
      this.stopScreenTrack();
    }
  };

  shareData = () => {
    const { isWhiteboardEnabled, dataTrack } = this.state;
    this.setState({ isWhiteboardEnabled: !isWhiteboardEnabled });
    if (dataTrack) {
      const message = {
        type: isWhiteboardEnabled ? 'stop_whiteboard' : 'start_whiteboard'
      };
      dataTrack.send(JSON.stringify(message));
    }
  };

  sendDataMessage = data => {
    const { dataTrack } = this.state;
    if (dataTrack) {
      dataTrack.send(data);
    }
  };

  dataReceived = drawData => {
    this.setState({ drawData });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpenClaimPoints = () => {
    this.setState({ openVideoPoints: true });
  };

  handleVideoPointsClose = () => {
    this.setState({ openVideoPoints: false });
  };

  handlePointsSubmit = async ({
    purpose,
    classId,
    sectionId,
    meeting,
    selectedDate,
    help
  }: {
    purpose: string,
    classId: number,
    sectionId?: number,
    meeting: boolean,
    selectedDate: Object,
    help: string
  }) => {
    try {
      this.setState({ postingPoints: true });
      const {
        user: { userId }
      } = this.props;
      const { videoRoom, participants } = this.state;
      if (videoRoom && this.started) {
        const { sid } = videoRoom;
        const length = Number(
          Number((new Date().getTime() - this.started) / 1000).toFixed(0)
        );

        const participantsForPoints = participants
          .map(item => Number(item.participant.identity))
          .filter(item => item !== Number(userId));

        await postVideoPoints({
          userId,
          sid,
          length,
          purposeId: Number(purpose),
          scheduledTime: meeting ? selectedDate.valueOf() : 0,
          openAnswer: help,
          participants: participantsForPoints,
          classId,
          sectionId
        });
      }

      this.setState({
        points: false,
        earned: true,
        openVideoPoints: false,
        postingPoints: false
      });
    } catch (err) {
      this.setState({ postingPoints: false });
    }
  };

  handlePencilChange = size => {
    this.setState({ lineWidth: size, isText: false, eraser: false });
  };

  handleTextChange = () => {
    this.setState({ isText: true, eraser: false });
  };

  handleColorChange = color => {
    this.setState({ color });
  };

  handleErase = size => {
    this.setState({ lineWidth: size, isText: false, eraser: true });
  };

  handleSave = () => {
    const { current } = this.whiteboard;
    if (current) {
      const { canvas } = current;
      if (canvas) {
        const { current: currentCanvas } = canvas;
        if (currentCanvas) {
          const canvasImg = currentCanvas.toDataURL('image/png');
          this.setState({ canvasImg });
        }
      }
    }
  };

  handleCanvasClose = () => {
    this.setState({ canvasImg: '' });
  };

  handleClear = () => {
    const { current } = this.whiteboard;
    if (current) {
      const { canvas } = current;
      if (canvas) {
        const { current: currentCanvas } = canvas;
        if (currentCanvas) {
          const context = currentCanvas.getContext('2d');
          context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
        }
      }
    }
  };

  detachTrack(trackName) {
    // eslint-disable-next-line react/destructuring-assignment
    const track = this.state[trackName];
    if (track) {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
      track.stop();
      if (trackName === 'screenTrack') {
        this.setState({ screenTrack: null });
      }
    }
  }

  whiteboard: Object;

  notInitiator: boolean;

  initiator: boolean;

  pointsStarted: boolean;

  started: number;

  render() {
    const {
      classes,
      user: { userId, firstName, lastName }
    } = this.props;
    const {
      videoRoom,
      isVideoEnabled,
      isAudioEnabled,
      participants,
      screenTrack,
      isWhiteboardEnabled,
      activeParticipant,
      drawData,
      open,
      pinnedParticipant,
      points,
      openVideoPoints,
      postingPoints,
      lineWidth,
      color,
      canvasImg,
      isText,
      eraser
    } = this.state;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          {participants.length < 2 && !isWhiteboardEnabled && (
            <NoParticipants />
          )}
          <MeetUpControls
            isConnected={Boolean(videoRoom)}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            isScreenSharingSupported={Boolean(
              navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
            )}
            isSharing={Boolean(screenTrack)}
            isSharingData={isWhiteboardEnabled}
            endCall={this.leaveRoom}
            disableVideo={this.disableVideo}
            disableAudio={this.disableAudio}
            shareScreen={this.shareScreen}
            shareData={this.shareData}
          />
          <Thumbnails
            participants={participants}
            isSharing={Boolean(screenTrack)}
            isSharingData={isWhiteboardEnabled}
            dataReceived={this.dataReceived}
            pinnedParticipant={pinnedParticipant}
            onPin={this.handlePin}
          />
          {activeParticipant && !isWhiteboardEnabled && (
            <ActiveParticipant
              key={
                pinnedParticipant
                  ? pinnedParticipant.sid
                  : activeParticipant.sid
              }
              participant={pinnedParticipant || activeParticipant}
            />
          )}
          {isWhiteboardEnabled && (
            <Fragment>
              <Whiteboard
                innerRef={this.whiteboard}
                userId={userId}
                name={`${firstName} ${lastName}`}
                drawData={drawData}
                lineWidth={lineWidth}
                color={color}
                isText={isText}
                eraser={eraser}
                sendDataMessage={this.sendDataMessage}
              />
              <WhiteboardControls
                onPencilChange={this.handlePencilChange}
                onColorChange={this.handleColorChange}
                onErase={this.handleErase}
                onText={this.handleTextChange}
                onSave={this.handleSave}
                onClear={this.handleClear}
              />
            </Fragment>
          )}
          <Dialog
            ariaDescribedBy="alert-dialog-description"
            onCancel={this.handleClose}
            open={open}
            title="Screen Sharing Not Supported"
          >
            <Typography
              id="alert-dialog-description"
              color="textPrimary"
            >
              Your current browser doesn't support screen sharing, consider using Chrome or Firefox
            </Typography>
          </Dialog>
          <Dialog
            onCancel={this.handleClose}
            open={Boolean(canvasImg !== '')}
            title="Whiteboard Screenshot"
          >
            <div className={classes.canvasWrapper}>
              {canvasImg !== '' && (
                <img
                  src={canvasImg}
                  className={classes.canvasImg}
                  alt="Canvas screenshot"
                />
              )}
            </div>
          </Dialog>
          {points && (
            <div className={classes.points}>
              <Fab
                variant="extended"
                color="primary"
                aria-label="Claim"
                className={classes.pointsButton}
                onClick={this.handleOpenClaimPoints}
              >
                Claim Your Points
              </Fab>
            </div>
          )}
        </div>
        <VideoPointsDialog
          open={openVideoPoints}
          loading={postingPoints}
          onClose={this.handleVideoPointsClose}
          onSubmit={this.handlePointsSubmit}
        />
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(withSnackbar(MeetUp));
