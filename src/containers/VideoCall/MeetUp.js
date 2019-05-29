// @flow
import React from 'react';
import Video from 'twilio-video';
import { first } from 'lodash';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import type { User } from '../../types/models';
import { renewTwilioToken } from '../../api/chat';
import MeetUpControls from '../../components/MeetUp/Controls';
import Thumbnails from '../../components/MeetUp/Thumbnails';
import NoParticipants from '../../components/MeetUp/NoParticipants';
import ActiveParticipant from '../../components/MeetUp/ActiveParticipant';
import Whiteboard from '../../components/MeetUp/Whiteboard';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({
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
  updateLoading: Function
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
  pinnedParticipant: ?Object
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
      pinnedParticipant: null
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

    this.setState({
      open: !(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
    });

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
      if (!activeParticipant) this.setState({ activeParticipant: participant });
    });

    videoRoom.on('participantConnected', participant => {
      this.addParticipant(participant);
      const { activeParticipant } = this.state;
      if (!activeParticipant) this.setState({ activeParticipant: participant });
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
  };

  componentWillUnmount = () => {
    const { videoRoom } = this.state;
    if (videoRoom) {
      videoRoom.disconnect();
    }
  };

  handlePin = participant => {
    this.setState(({pinnedParticipant}) => ({pinnedParticipant: pinnedParticipant && pinnedParticipant.sid === participant.sid ? null : participant}))
  }

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

  render() {
    const { classes } = this.props;
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
      pinnedParticipant
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
              key={pinnedParticipant ? pinnedParticipant.sid : activeParticipant.sid}
              participant={pinnedParticipant || activeParticipant}
            />
          )}
          {isWhiteboardEnabled && false && (
            <Whiteboard
              drawData={drawData}
              sendDataMessage={this.sendDataMessage}
            />
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
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(MeetUp);
