/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// @flow
import React from 'react';
import Video from 'twilio-video';
import first from 'lodash/first';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary';
import VideoChatChannel from './VideoChatChannel';
import Controls from '../../components/MeetUp2/Controls';
import LeftPanel from '../../components/MeetUp2/LeftPanel';
import Thumbnails from '../../components/MeetUp2/Thumbnails';
import LocalThumbnail from '../../components/MeetUp2/LocalThumbnail';
import VideoGrid from '../../components/MeetUp2/VideoGrid';
import SharingScreenControl from '../../components/MeetUp2/SharingScreenControl';
import { renewTwilioToken } from '../../api/chat';
import { getUserProfile } from '../../api/user';
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
  channel: ?Object,
  leaveRoom: Function,
  updateLoading: Function
};

type State = {
  lockedParticipant: string,
  participants: Array<Object>,
  videoRoom: ?Object,
  isVideoSharing: boolean,
  sharingTrackId: string,
  screenTrack: ?Object,
  dominantSpeaker: string,
  profiles: Object,
  isVideoSwitching: boolean,
  isAudioSwitching: boolean,
  type: string,
  unread: number
};

class MeetUp extends React.Component<Props, State> {
  state = {
    lockedParticipant: '',
    participants: [],
    videoRoom: null,
    isVideoSharing: false,
    sharingTrackId: '',
    screenTrack: null,
    dominantSpeaker: '',
    profiles: {},
    isVideoSwitching: false,
    isAudioSwitching: false,
    type: '',
    unread: 0
  };

  componentDidMount = () => {
    const {
      user: { userId, firstName, lastName, profileImage }
    } = this.props;
    this.setState({
      profiles: {
        [userId]: { firstName, lastName, userProfileUrl: profileImage }
      }
    });
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

  handleAddParticipant = (participant, track, local = false) => {
    const newState = utils.addParticipant(
      this.state,
      participant,
      track,
      local
    );
    this.setState(newState);
    this.handleLoadProfile(participant);
  };

  handleRemoveParticipant = participant => {
    const newState = utils.removeParticipant(this.state, participant);
    this.setState(newState);
  };

  handleRemoveTrack = (participant, track, local = false) => {
    const newState = utils.removeTrack(this.state, participant, track, local);
    this.setState(newState);
  };

  handleLoadProfile = async participant => {
    const { profiles } = this.state;

    if (participant && !profiles[participant.identity]) {
      const { userProfile } = await getUserProfile({
        userId: participant.identity
      });
      const { firstName, lastName, userProfileUrl } = userProfile;
      const newState = utils.addProfile(this.state, {
        userId: participant.identity,
        firstName,
        lastName,
        userProfileUrl
      });
      this.setState(newState);
    }
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
    try {
      const { videoinput } = this.props;
      const { videoRoom, participants } = this.state;
      this.setState({ isVideoSwitching: true });
      const localPartcipant = participants.find(item => item.type === 'local');
      if (localPartcipant) {
        const { video = [] } = localPartcipant;
        const tracks = video.filter(track => track.name !== 'localPartcipant');
        if (tracks.length === 0) {
          const newLocalVideoTrack = await Video.createLocalVideoTrack({
            deviceId: videoinput
          });

          if (videoRoom && videoRoom.localParticipant) {
            await videoRoom.localParticipant.publishTrack(newLocalVideoTrack);
            await this.handleAddParticipant(
              videoRoom.localParticipant,
              newLocalVideoTrack,
              true
            );
          }
        } else {
          for (const track of tracks) {
            await track.stop();
            if (videoRoom) {
              await videoRoom.localParticipant.unpublishTrack(track);
              await this.handleRemoveTrack(
                videoRoom.localParticipant,
                track,
                true
              );
            }
          }
        }
      }
    } finally {
      this.setState({ isVideoSwitching: false });
    }
  };

  handleDisableAudio = async () => {
    try {
      const { audioinput } = this.props;
      const { videoRoom, participants } = this.state;
      this.setState({ isAudioSwitching: true });
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
              newLocalAudioTrack,
              true
            );
          }
        } else {
          for (const track of audio) {
            track.stop();
            if (videoRoom) {
              videoRoom.localParticipant.unpublishTrack(track);
              this.handleRemoveTrack(videoRoom.localParticipant, track, true);
            }
          }
        }
      }
    } finally {
      this.setState({ isAudioSwitching: false });
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

      const localScreenTrack = await new Video.LocalVideoTrack(newScreenTrack);

      this.setState({
        screenTrack: localScreenTrack
      });

      if (videoRoom && videoRoom.localParticipant) {
        this.handleAddParticipant(
          videoRoom.localParticipant,
          localScreenTrack,
          true
        );
        this.setState({ sharingTrackId: localScreenTrack.id });
        videoRoom.localParticipant.publishTrack(newScreenTrack, {
          name: 'screenSharing'
        });
      }
    } else if (videoRoom && videoRoom.localParticipant) {
      if (screenTrack) {
        this.handleRemoveTrack(videoRoom.localParticipant, screenTrack, true);
        screenTrack.stop();
        videoRoom.localParticipant.unpublishTrack(screenTrack);
      }
      this.setState({ screenTrack: null, sharingTrackId: '' });
    }
  };

  handleShareData = () => {};

  handleTabChange = type => {
    this.setState({type})
  }

  handleUnreadUpdate = count => {
    if(!count) this.setState({unread: 0})
    else this.setState(({unread}) => ({unread: unread + count}))
  }

  render() {
    const {
      classes,
      user,
      channel
    } = this.props;
    const {profileImage} = user;
    const {
      videoRoom,
      lockedParticipant,
      participants,
      isVideoSharing,
      dominantSpeaker,
      sharingTrackId,
      profiles,
      isVideoSwitching,
      isAudioSwitching,
      screenTrack,
      type,
      unread
    } = this.state;
    const localPartcipant = participants.find(item => item.type === 'local');

    const isVideoEnabled = localPartcipant && localPartcipant.video.length > 0;
    const isAudioEnabled = localPartcipant && localPartcipant.audio.length > 0;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <LeftPanel
            participants={participants.length}
            localParticipant={
              <LocalThumbnail
              key={localPartcipant && localPartcipant.video.length > 0 ? localPartcipant.video[0].id : 'LocalParticipant' }
                  profileImage={profileImage}
                  video={localPartcipant && localPartcipant.video.length > 0 && localPartcipant.video[0]}
                  isVideo={isVideoEnabled}
                  isMic={isAudioEnabled}
                />
            }
            thumbnails={
              <Thumbnails
                participants={participants}
                profiles={profiles}
                lockedParticipant={lockedParticipant}
                onLockParticipant={this.handleLockParticipant}
              />
            }
            chat={channel && <VideoChatChannel open={type === 'chat'} user={user} channel={channel} onUnreadUpdate={this.handleUnreadUpdate} />}
            unread={unread}
            onTabChange={this.handleTabChange}
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
            isVideoSwitching={isVideoSwitching}
            isAudioSwitching={isAudioSwitching}
            endCall={this.handleEndCall}
            disableVideo={this.handleDisableVideo}
            disableAudio={this.handleDisableAudio}
            shareScreen={this.handleShareScreen}
            shareData={this.handleShareData}
          />
          <SharingScreenControl
            isSharing={Boolean(screenTrack)}
            onStopSharing={this.handleShareScreen}
          />
          <VideoGrid
            participants={participants}
            profiles={profiles}
            lockedParticipant={lockedParticipant}
            dominantSpeaker={dominantSpeaker}
            sharingTrackId={sharingTrackId}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(withSnackbar(MeetUp));
