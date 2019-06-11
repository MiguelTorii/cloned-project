// @flow
import React, { Fragment } from 'react';
import Video from 'twilio-video';
import first from 'lodash/first';
import debounce from 'lodash/debounce';
import update from 'immutability-helper';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
    padding: theme.spacing.unit * 2,
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
    padding: theme.spacing.unit
  },
  canvasImg: {
    width: '300px !important',
    height: 'auto !important'
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
  isText: boolean
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
      isText: false
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
      const localVideoTrack = await Video.createLocalVideoTrack({
        deviceId: videoinput
      });
      this.setState({ localVideoTrack });
      const localAudioTrack = await Video.createLocalAudioTrack({
        deviceId: audioinput
      });
      this.setState({ localAudioTrack });
      const localDataTrack = new Video.LocalDataTrack();
      this.setState({
        dataTrack: localDataTrack
      });

      localVideoTrack.enable(isVideoEnabled);
      localAudioTrack.enable(isAudioEnabled);

      const accessToken = await renewTwilioToken({
        userId
      });
      const videoRoom = await Video.connect(accessToken, {
        name: roomName,
        tracks: [localVideoTrack, localAudioTrack, localDataTrack],
        dominantSpeaker: true,
        insights: false
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
            const { enqueueSnackbar } = this.props;
            enqueueSnackbar(
              'Congratulations, you have just earned some points because you initiated a Video meet-up. Good Work!',
              {
                variant: 'success',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                autoHideDuration: 5000
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
      console.log(err);
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
      leaveRoom();
    }
  };

  disableVideo = () => {
    const { localVideoTrack } = this.state;
    if (localVideoTrack) {
      const isEnabled = !localVideoTrack.isEnabled;
      localVideoTrack.enable(isEnabled);
      this.setState({ isVideoEnabled: isEnabled });
    }
  };

  disableAudio = () => {
    const { localAudioTrack } = this.state;
    if (localAudioTrack) {
      const isEnabled = !localAudioTrack.isEnabled;
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

      this.setState({
        screenTrack: new Video.LocalVideoTrack(newScreenTrack)
      });

      if (videoRoom && videoRoom.localParticipant) {
        videoRoom.localParticipant.publishTrack(newScreenTrack);
        videoRoom.localParticipant.unpublishTrack(localVideoTrack);
      }
    } else if (videoRoom && videoRoom.localParticipant) {
      videoRoom.localParticipant.unpublishTrack(screenTrack);
      videoRoom.localParticipant.publishTrack(localVideoTrack);
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
    // const { videoRoom, dataTrack } = this.state;
    // if (!dataTrack) {
    //   const newDataTrack = new Video.LocalDataTrack();
    //   this.setState({
    //     dataTrack: newDataTrack
    //   });
    //   videoRoom.localParticipant.publishTrack(newDataTrack);
    // } else {
    //   videoRoom.localParticipant.unpublishTrack(dataTrack);
    //   this.setState({ dataTrack: null });
    // }
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
      console.log(err);
      this.setState({ postingPoints: false });
    }
  };

  handlePencilChange = size => {
    this.setState({lineWidth: size, isText: false})
  }

  handleTextChange = () => {
    this.setState({isText: true})
  }

  handleColorChange = color => {
    this.setState({color})
  }

  handleErase = () => {
    this.setState({lineWidth: 20, color: 'white'})
  }

  handleSave = () => {
    const {current} = this.whiteboard;
    if(current) {
      const {canvas} = current;
      if(canvas) {
        const {current: currentCanvas} = canvas;
        if(currentCanvas) {
          const canvasImg = currentCanvas.toDataURL("image/png");
          this.setState({canvasImg})
          // document.write(`<a href="${img}" download="download" >Download as jpeg</a>`);
  //         img.style.display = 'block';
  //  img.style.width= "200px";
  //  img.style.height="200px";
  //  var url=img.getAttribute('src');
  //  window.open(img,'Image','width=img.stylewidth,height=img.style.height,resizable=1');
        }
      }
    }
  }

  handleCanvasClose = () => {
    this.setState({canvasImg: ''})
  }

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
    const { classes, user: {userId, firstName, lastName} } = this.props;
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
      isText
    } = this.state;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          {false && participants.length < 2 && !isWhiteboardEnabled && (
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
            <Fragment><Whiteboard
            innerRef={this.whiteboard}
            userId={userId}
            name={`${firstName} ${lastName}`}
              drawData={drawData}
              lineWidth={lineWidth}
              color={color}
              isText={isText}
              sendDataMessage={this.sendDataMessage}
            />
            <WhiteboardControls onPencilChange={this.handlePencilChange} onColorChange={this.handleColorChange} onErase={this.handleErase} onText={this.handleTextChange} onSave={this.handleSave} />
            </Fragment>
          )}
          <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Screen Sharing Not Supported
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                color="textPrimary"
              >
                {
                  "Your current browser doesn't support screen sharing, consider using Chrome or Firefox"
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={Boolean(canvasImg !== '')}
            onClose={this.handleClose}
            aria-labelledby="canvas-img-dialog-title"
            aria-describedby="canvas-img-dialog-description"
          >
            <DialogTitle id="canvas-img-dialog-title">
              Whiteboard Screenshot
            </DialogTitle>
            <DialogContent className={classes.canvasWrapper}>
              <img src={canvasImg} className={classes.canvasImg} alt="Canvas screenshot"/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCanvasClose} color="primary">
                Ok
              </Button>
            </DialogActions>
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
