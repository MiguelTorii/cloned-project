/* eslint-disable no-restricted-syntax */
// @flow
import React from 'react';
import Video from 'twilio-video';
import first from 'lodash/first';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary';
import Controls from '../../components/MeetUp2/Controls';
import LeftPanel from '../../components/MeetUp2/LeftPanel';
import Thumbnails from '../../components/MeetUp2/Thumbnails';
import VideoGrid from '../../components/MeetUp2/VideoGrid';
import { renewTwilioToken } from '../../api/chat';
import * as utils from './utils';

const styles = () => ({
  root: {
    width: '100vw',
    maxWidth: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    position: 'relative',
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
  roomName: string,
  leaveRoom: Function,
  updateLoading: Function
};

type State = {
  lockedParticipant: string,
  // localVideoTrack: ?Object,
  // localAudioTrack: ?Object,
  participants: Array<Object>,
  videoRoom: ?Object,
  isVideoSharing: boolean,
  screenTrack: ?Object,
  dominantSpeaker: string
};

class MeetUp extends React.Component<Props, State> {
  state = {
    lockedParticipant: '',
    // localVideoTrack: null,
    // localAudioTrack: null,
    participants: [],
    videoRoom: null,
    isVideoSharing: false,
    sharingTrackId: '',
    screenTrack: null,
    dominantSpeaker: ''
  };

  componentDidMount = () => {
    this.handleStartCall();
  };

  componentWillUnmount = () => {
    const { videoRoom } = this.state;
    if (videoRoom) {
      videoRoom.disconnect();
      this.setState({ videoRoom: null });
    }
  };

  handleStartCall = async () => {
    try {
      const {
        user: { userId },
        videoinput,
        audioinput,
        roomName,
        updateLoading
      } = this.props;
      const tracks = [];

      if (videoinput !== '') {
        const localVideoTrack = await Video.createLocalVideoTrack({
          deviceId: videoinput
        });
        tracks.push(localVideoTrack);
      }

      if (audioinput !== '') {
        const localAudioTrack = await Video.createLocalAudioTrack({
          deviceId: audioinput
        });
        tracks.push(localAudioTrack);
      }

      const accessToken = await renewTwilioToken({
        userId
      });

      const videoRoom = await Video.connect(accessToken, {
        name: roomName,
        tracks,
        dominantSpeaker: true,
        insights: false,
        video: videoinput !== '',
        audio: audioinput !== ''
      });

      this.setState({ videoRoom });

      const { localParticipant } = videoRoom;
      this.setState(prevState => ({
        participants: [
          ...prevState.participants,
          {
            type: 'local',
            participant: localParticipant,
            audio: tracks.filter(item => item.kind === 'audio'),
            video: tracks.filter(item => item.kind === 'video')
          }
        ]
      }));

      videoRoom.participants.forEach(participant => {
        this.handleAddParticipant(participant);
      });

      videoRoom.on('participantConnected', async participant => {
        this.handleAddParticipant(participant);
        participant.tracks.forEach(publication => {
          const { track } = publication;
          this.handleAddParticipant(participant, track);
          const { name = '', sid = '' } = track || {};
          if (name === 'screenSharing') {
            this.setState({ isVideoSharing: true, sharingTrackId: sid });
          }
        });
      });

      videoRoom.on('participantDisconnected', participant => {
        this.handleRemoveParticipant(participant);
      });

      videoRoom.on('trackSubscribed', (track, publication, participant) => {
        this.handleAddParticipant(participant, track);
        const { name = '', sid = '' } = track;
        if (name === 'screenSharing') {
          this.setState({ isVideoSharing: true, sharingTrackId: sid });
        }
      });

      videoRoom.on('trackUnsubscribed', (track, publication, participant) => {
        this.handleRemoveTrack(participant, track);
        const { name = '' } = track;
        if (name === 'screenSharing') {
          this.setState({ isVideoSharing: false, sharingTrackId: '' });
        }
      });

      videoRoom.on('dominantSpeakerChanged', participant => {
        if (participant) this.setState({ dominantSpeaker: participant.sid });
        else this.setState({ dominantSpeaker: '' });
      });

      videoRoom.on('disconnected', () => {
        console.log('disconnected');
      });

      updateLoading(false);
    } catch (err) {
      this.handleEndCall();
    }
  };

  handleAddParticipant = (participant, track) => {
    const newState = utils.addParticipant(this.state, participant, track);
    this.setState(newState);
  };

  handleRemoveParticipant = participant => {
    const newState = utils.removeParticipant(this.state, participant);
    this.setState(newState);
  };

  handleRemoveTrack = (participant, track) => {
    const newState = utils.removeTrack(this.state, participant, track);
    this.setState(newState);
  };

  handleEndCall = () => {
    // const { videoRoom } = this.state;
    const { leaveRoom } = this.props;
    // if (videoRoom) {
    //   await videoRoom.disconnect();
    // }
    leaveRoom();
  };

  handleLockParticipant = sid => {
    this.setState(({ lockedParticipant }) => ({
      lockedParticipant: lockedParticipant === sid ? '' : sid
    }));
  };

  handleDisableVideo = async () => {
    const { videoinput } = this.props;
    const { videoRoom, participants } = this.state;
    const localPartcipant = participants.find(item => item.type === 'local');
    if (localPartcipant) {
      const { video = [] } = localPartcipant;
      const tracks = video.filter(track => track.name !== 'localPartcipant');
      if (tracks.length === 0) {
        const newLocalVideoTrack = await Video.createLocalVideoTrack({
          deviceId: videoinput
        });

        if (videoRoom && videoRoom.localParticipant) {
          videoRoom.localParticipant.publishTrack(newLocalVideoTrack);
          this.handleAddParticipant(
            videoRoom.localParticipant,
            newLocalVideoTrack
          );
        }
      } else {
        for (const track of tracks) {
          track.stop();
          if (videoRoom) {
            videoRoom.localParticipant.unpublishTrack(track);
            this.handleRemoveTrack(videoRoom.localParticipant, track);
          }
        }
      }
    }
  };

  handleDisableAudio = async () => {
    const { audioinput } = this.props;
    const { videoRoom, participants } = this.state;
    const localPartcipant = participants.find(item => item.type === 'local');
    if (localPartcipant) {
      const { audio = [] } = localPartcipant;
      if (audio.length === 0) {
        const newLocalAudioTrack = await Video.createLocalAudioTrack({
          deviceId: audioinput
        });

        if (videoRoom && videoRoom.localParticipant) {
          videoRoom.localParticipant.publishTrack(newLocalAudioTrack);
          this.handleAddParticipant(
            videoRoom.localParticipant,
            newLocalAudioTrack
          );
        }
      } else {
        for (const track of audio) {
          track.stop();
          if (videoRoom) {
            videoRoom.localParticipant.unpublishTrack(track);
            this.handleRemoveTrack(videoRoom.localParticipant, track);
          }
        }
      }
    }
  };

  handleShareScreen = async () => {
    const { videoRoom, screenTrack } = this.state;

    if (!screenTrack && navigator && navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      const newScreenTrack = first(stream.getVideoTracks());

      newScreenTrack.addEventListener('ended', () => {
        this.handleShareScreen();
      });

      this.setState({
        screenTrack: new Video.LocalVideoTrack(newScreenTrack)
      });

      if (videoRoom && videoRoom.localParticipant) {
        videoRoom.localParticipant.publishTrack(newScreenTrack, {
          name: 'screenSharing'
        });
      }
    } else if (videoRoom && videoRoom.localParticipant) {
      screenTrack.stop();
      videoRoom.localParticipant.unpublishTrack(screenTrack);
      this.setState({ screenTrack: null });
    }
  };

  handleShareData = () => {};

  render() {
    const { classes } = this.props;
    const {
      videoRoom,
      lockedParticipant,
      participants,
      isVideoSharing,
      dominantSpeaker,
      sharingTrackId
    } = this.state;
    const localPartcipant = participants.find(item => item.type === 'local');

    const isVideoEnabled = localPartcipant && localPartcipant.video.length > 0;
    const isAudioEnabled = localPartcipant && localPartcipant.audio.length > 0;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <LeftPanel
            participants={participants.length}
            thumbnails={
              <Thumbnails
                participants={participants}
                lockedParticipant={lockedParticipant}
                onLockParticipant={this.handleLockParticipant}
              />
            }
          />
          <Controls
            isConnected={Boolean(videoRoom)}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            isScreenSharingSupported={Boolean(
              navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
            )}
            isSharing={isVideoSharing}
            isSharingData={false}
            endCall={this.handleEndCall}
            disableVideo={this.handleDisableVideo}
            disableAudio={this.handleDisableAudio}
            shareScreen={this.handleShareScreen}
            shareData={this.handleShareData}
          />
          <VideoGrid participants={participants} lockedParticipant={lockedParticipant} dominantSpeaker={dominantSpeaker} sharingTrackId={sharingTrackId} />
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(withSnackbar(MeetUp));
