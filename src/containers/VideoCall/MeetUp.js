/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import Video from 'twilio-video';
import moment from 'moment';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { decypherClass } from 'utils/crypto';
import first from 'lodash/first';
import debounce from 'lodash/debounce';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import StudyRoomChat from 'containers/StudyRoomChat';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import get from 'lodash/get';
import Tooltip from 'containers/Tooltip';
import GalleryViewMode from './GalleryView';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary';
import Controls from '../../components/MeetUp/CallControls';
import DeviceSettings from '../../components/MeetUp/DeviceSettings';
import Thumbnails from '../../components/MeetUp/Thumbnails';
import VideoGrid from '../../components/MeetUp/VideoGrid';
import MeetingDetails from '../../components/MeetUp/MeetingDetails';
import Whiteboard from '../../components/MeetUp/Whiteboard';
import WhiteboardControls from '../../components/MeetUp/WhiteboardControls';
import Dialog from '../../components/Dialog';
import ClassmatesDialog from '../../components/ClassmatesDialog';
import VideoPointsDialog from '../../components/VideoPointsDialog';
import { renewTwilioToken } from '../../api/chat';
import { getUserProfile } from '../../api/user';
import {
  checkVideoSession,
  setVideoInitiator,
  postVideoPoints
} from '../../api/video';
// import VideoChatChannel from './VideoChatChannel'
// import LocalThumbnail from '../../components/MeetUp/LocalThumbnail'
// import LeftPanel from '../../components/MeetUp/LeftPanel'
// import SharingScreenControl from '../../components/MeetUp/SharingScreenControl'
import { logEvent } from '../../api/analytics';
import * as utils from './utils';
import { VIDEO_SHARE_URL } from '../../constants/routes';

const styles = (theme) => ({
  root: {
    width: '100vw',
    maxWidth: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  speakerViewThumbnails: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 'calc(100% - 400px)',
    top: 50
  },
  sideBySideViewThumbnail: {
    top: 'auto',
    right: 10,
    width: 200,
    height: 'calc(100% - 200px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: theme.spacing(3),
    position: 'absolute'
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(3, 3, 0, 3)
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
  settings: {
    zIndex: 9999,
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(3)
  },
  settingBtn: {
    backgroundColor: theme.circleIn.palette.appBar,
    color: theme.circleIn.palette.white,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
    borderRadius: 10
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
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
  }
});

type Props = {
  classes: Object,
  user: User,
  selectedvideoinput: string,
  selectedaudioinput: string,
  roomName: string,
  // channel: ?Object,
  chat: Object,
  updateLoading: Function,
  enqueueSnackbar: Function
};

type State = {
  lockedParticipant: string,
  participants: Array<Object>,
  videoRoom: ?Object,
  isVideoSharing: boolean,
  sharingTrackIds: array,
  screenTrack: ?Object,
  dominantSpeaker: string,
  profiles: Object,
  isVideoSwitching: boolean,
  isAudioSwitching: boolean,
  type: string,
  unread: number,
  dataTrack: ?Object,
  drawData: string,
  lineWidth: number,
  color: string,
  canvasImg: string,
  isText: boolean,
  eraser: boolean,
  points: boolean,
  openVideoPoints: boolean,
  postingPoints: boolean,
  noPointsAllowed: boolean,
  earned: boolean,
  isOpenMeetingDetails: boolean,
  openSettings: boolean,
  openClassmates: string,
  viewMode: string,
  selectedScreenShareId: string,
  selectedTab: number,
  localSharing: boolean,
  hover: boolean
};

class MeetUp extends React.Component<Props, State> {
  state = {
    lockedParticipant: '',
    participants: [],
    videoRoom: null,
    isVideoSharing: false,
    sharingTrackIds: [],
    screenTrack: null,
    dominantSpeaker: '',
    profiles: {},
    isVideoSwitching: false,
    isAudioSwitching: false,
    type: '',
    unread: 0,
    dataTrack: null,
    drawData: '',
    lineWidth: 1,
    color: 'black',
    canvasImg: '',
    isText: false,
    eraser: false,
    points: false,
    openVideoPoints: false,
    postingPoints: false,
    noPointsAllowed: false,
    dominantView: false,
    earned: false,
    isOpenMeetingDetails: false,
    currentClassList: [],
    openClassmates: '',
    chatOpen: false,
    openSettings: false,
    viewMode: 'gallery-view',
    selectedScreenShareId: '',
    selectedTab: 1,
    localSharing: false,
    hover: false
  };

  meetingUriRef: Object;

  whiteboard: Object;

  notInitiator: boolean;

  initiator: boolean;

  pointsStarted: boolean;

  started: number;

  startTime: Object;

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.whiteboard = React.createRef();
    this.meetingUriRef = React.createRef();
  }

  componentDidMount = async () => {
    const {
      user: {
        userClasses: { classList }
      }
    } = this.props;
    this.notInitiator = false;
    this.initiator = false;
    this.pointsStarted = false;

    this.handleSession = debounce(this.handleSession, 1000);
    this.started = new Date().getTime();

    const {
      user: {
        data: { userId, firstName, lastName, profileImage }
      }
    } = this.props;

    const noPointsAllowed = await checkVideoSession({ userId });

    const newClassList = {};
    classList.forEach((cl) => {
      if (cl.section && cl.section.length > 0 && cl.className && cl.bgColor)
        cl.section.forEach((s) => {
          newClassList[s.sectionId] = cl;
        });
    });

    const currentClassList = Object.keys(newClassList).map((sectionId) => {
      return {
        ...newClassList[sectionId],
        sectionId: Number(sectionId)
      };
    });

    this.setState({
      profiles: {
        [userId]: { firstName, lastName, userProfileUrl: profileImage }
      },
      currentClassList,
      noPointsAllowed
    });
    this.handleStartCall();
  };

  componentDidUpdate = () => {
    const { participants } = this.state;
    if (participants.length > 1 && !this.pointsStarted) {
      this.pointsStarted = true;
      this.handleSession();
    } else if (participants.length <= 1) this.pointsStarted = false;
  };

  handleWindowClose = (ev) => {
    if (ev) ev.preventDefault();
    const { videoRoom } = this.state;
    if (videoRoom?.name) {
      logEvent({
        event: 'Video- End Video',
        props: {
          channelName: videoRoom.name,
          start_time: this.startTime,
          end_time: moment().format('YYYY-MM-DD hh:mm:ss'),
          type: 'Ended',
          'Channel SID': videoRoom.sid
        }
      });
    }
    this.startTime = null;
  };

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.handleWindowClose);
    const { videoRoom } = this.state;
    if (videoRoom) {
      videoRoom.disconnect();
      this.setState({ videoRoom: null });
    }

    if (
      this.handleSession.cancel &&
      typeof this.handleSession.cancel === 'function'
    )
      this.handleSession.cancel();
  };

  handleChangeView = (viewMode) => {
    this.setState({ viewMode });
  };

  handleStartCall = async () => {
    try {
      const {
        user: {
          data: { userId }
        },
        selectedvideoinput,
        selectedaudioinput,
        roomName,
        updateLoading
      } = this.props;
      const tracks = [];

      if (selectedvideoinput !== '') {
        const localVideoTrack = await Video.createLocalVideoTrack({
          deviceId: selectedvideoinput
        });
        tracks.push(localVideoTrack);
      }

      if (selectedaudioinput !== '') {
        const localAudioTrack = await Video.createLocalAudioTrack({
          deviceId: selectedaudioinput
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
        video: selectedvideoinput !== '',
        audio: selectedaudioinput !== ''
      });

      window.addEventListener('beforeunload', this.handleWindowClose);
      logEvent({
        event: 'Video- Start Video',
        props: {
          channelName: videoRoom.name,
          start_time: moment().format('YYYY-MM-DD hh:mm:ss'),
          type: 'Started',
          'Channel SID': videoRoom.sid
        }
      });
      this.setState({ videoRoom });

      const { localParticipant } = videoRoom;
      this.setState((prevState) => ({
        participants: [
          ...prevState.participants,
          {
            type: 'local',
            participant: localParticipant,
            audio: tracks.filter((item) => item.kind === 'audio'),
            video: tracks.filter((item) => item.kind === 'video'),
            data: []
          }
        ]
      }));

      videoRoom.participants.forEach((participant) => {
        this.handleAddParticipant(participant);
        if (!this.initiator) this.notInitiator = true;
      });

      videoRoom.on('participantConnected', async (participant) => {
        const { sharingTrackIds } = this.state;
        this.handleAddParticipant(participant);
        participant.tracks.forEach((publication) => {
          const { track } = publication;
          this.handleAddParticipant(participant, track);
          const { name = '', sid = '', kind = '' } = track || {};
          if (name === 'screenSharing') {
            const screenSharingIds = [...sharingTrackIds];
            screenSharingIds.push(sid);
            this.setState({
              isVideoSharing: true,
              sharingTrackIds: screenSharingIds
            });
          } else if (kind === 'data') {
            track.on('message', (data) => {
              const message = JSON.parse(data);
              const { type = '' } = message;
              if (type === 'drawing') this.handleDataReceived(data);
              else if (type === 'texting') this.handleDataReceived(data);
              else if (type === 'cursor') this.handleDataReceived(data);
            });
          }
        });
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

      videoRoom.on('participantDisconnected', (participant) => {
        this.handleRemoveParticipant(participant);
      });

      videoRoom.on('trackSubscribed', (track, publication, participant) => {
        this.handleAddParticipant(participant, track);
        const { name = '', sid = '', kind = '' } = track;
        if (name === 'screenSharing') {
          const { sharingTrackIds } = this.state;
          const screenSharingIds = [...sharingTrackIds];
          screenSharingIds.push(sid);
          this.setState({
            isVideoSharing: true,
            sharingTrackIds: screenSharingIds
          });
        } else if (kind === 'data') {
          track.on('message', (data) => {
            const message = JSON.parse(data);
            const { type = '' } = message;
            if (type === 'drawing') this.handleDataReceived(data);
            else if (type === 'texting') this.handleDataReceived(data);
            else if (type === 'cursor') this.handleDataReceived(data);
          });
        }
      });

      videoRoom.on('trackUnsubscribed', (track, publication, participant) => {
        this.handleRemoveTrack(participant, track);
        const { name = '', sid } = track;
        if (name === 'screenSharing') {
          const { sharingTrackIds } = this.state;
          const screenSharingIds = [...sharingTrackIds];
          const index = screenSharingIds.indexOf(sid);
          screenSharingIds.splice(index, 1);
          this.setState({
            isVideoSharing: false,
            sharingTrackIds: screenSharingIds
          });
        }
      });

      videoRoom.on('dominantSpeakerChanged', (participant) => {
        if (participant) this.setState({ dominantSpeaker: participant.sid });
        else this.setState({ dominantSpeaker: '' });
      });

      videoRoom.on('disconnected', () => {
        this.pointsStarted = false;
        this.handleWindowClose();
        window.removeEventListener('beforeunload', this.handleWindowClose);
        this.started = 0;
      });

      updateLoading(false);
    } catch (err) {
      this.handleEndCall();
    }
  };

  handleAddParticipant = (participant, track, local = false) => {
    const { participants } = this.state;
    if (participants.length === 1 && !this.startTime) {
      this.startTime = moment().format('YYYY-MM-DD hh:mm:ss');
    }
    const newState = utils.addParticipant(
      this.state,
      participant,
      track,
      local
    );
    this.setState(newState);
    this.handleLoadProfile(participant);
  };

  handleRemoveParticipant = (participant) => {
    const { participants } = this.state;
    if (participants.length === 2) {
      const { videoRoom } = this.state;
      if (videoRoom?.name) {
        logEvent({
          event: 'Video- End Video',
          props: {
            channelName: videoRoom.name,
            start_time: this.startTime,
            end_time: moment().format('YYYY-MM-DD hh:mm:ss'),
            type: 'Ended',
            'Channel SID': videoRoom.sid
          }
        });
      }
      this.startTime = null;
    }
    const newState = utils.removeParticipant(this.state, participant);
    this.setState(newState);
  };

  handleRemoveTrack = (participant, track, local = false) => {
    const newState = utils.removeTrack(this.state, participant, track, local);
    this.setState(newState);
  };

  handleLoadProfile = async (participant) => {
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

  handleEndCall = async () => {
    const { videoRoom, screenTrack } = this.state;
    if (videoRoom) {
      if (screenTrack) {
        await screenTrack.stop();
        await videoRoom.localParticipant.unpublishTrack(screenTrack);
      }
      await videoRoom.disconnect();
    }
    await window.location.reload();
  };

  handleLockParticipant = (sid) => {
    this.setState(({ lockedParticipant }) => ({
      lockedParticipant: lockedParticipant === sid ? '' : sid
    }));
  };

  handleDisableVideo = async () => {
    try {
      const { selectedvideoinput, onDisableDevice } = this.props;
      const { videoRoom, participants, sharingTrackIds } = this.state;
      const localPartcipant = participants.find(
        (item) => item.type === 'local'
      );

      this.setState({ isVideoSwitching: true });

      if (localPartcipant) {
        const { video = [] } = localPartcipant;
        const tracks = video.filter(
          (track) => track.name !== 'localPartcipant'
        );

        if (tracks.length === 0) {
          const newLocalVideoTrack = await Video.createLocalVideoTrack({
            deviceId: selectedvideoinput
          });

          if (videoRoom && videoRoom.localParticipant && newLocalVideoTrack) {
            await videoRoom.localParticipant.publishTrack(newLocalVideoTrack);
            await this.handleAddParticipant(
              videoRoom.localParticipant,
              newLocalVideoTrack,
              true
            );
          }
        } else if (
          tracks.length === 1 &&
          sharingTrackIds.indexOf(tracks[0].id) > -1
        ) {
          const newLocalVideoTrack = await Video.createLocalVideoTrack({
            deviceId: selectedvideoinput
          });
          if (videoRoom && videoRoom.localParticipant && newLocalVideoTrack) {
            await videoRoom.localParticipant.publishTrack(newLocalVideoTrack);
            await this.handleAddParticipant(
              videoRoom.localParticipant,
              newLocalVideoTrack,
              true
            );
          }
        } else {
          for (const track of tracks) {
            if (sharingTrackIds.indexOf(track.name) === -1) {
              onDisableDevice('videoinput');
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
      }
    } finally {
      this.setState({ isVideoSwitching: false });
    }
  };

  handleDisableAudio = async () => {
    try {
      const { selectedaudioinput } = this.props;
      const { videoRoom, participants } = this.state;
      this.setState({ isAudioSwitching: true });
      const localPartcipant = participants.find(
        (item) => item.type === 'local'
      );
      if (localPartcipant) {
        const { audio = [] } = localPartcipant;
        if (audio.length === 0) {
          const newLocalAudioTrack = await Video.createLocalAudioTrack({
            deviceId: selectedaudioinput
          });

          if (videoRoom && videoRoom.localParticipant && newLocalAudioTrack) {
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
    const { videoRoom, screenTrack, sharingTrackIds } = this.state;

    if (!screenTrack && navigator && navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      const newScreenTrack = first(stream.getVideoTracks());

      newScreenTrack.addEventListener('ended', () => {
        this.handleShareScreen();
      });

      const localScreenTrack = await new Video.LocalVideoTrack(newScreenTrack);
      const screenSharingIds = [...sharingTrackIds];
      screenSharingIds.push(localScreenTrack.id);

      this.setState({
        screenTrack: localScreenTrack,
        localSharing: true,
        sharingTrackIds: screenSharingIds
      });

      if (videoRoom && videoRoom.localParticipant) {
        this.handleAddParticipant(
          videoRoom.localParticipant,
          localScreenTrack,
          true
        );
        videoRoom.localParticipant.publishTrack(newScreenTrack, {
          name: 'screenSharing'
        });
      }
    } else if (videoRoom && videoRoom.localParticipant) {
      const screenSharingIds = [...sharingTrackIds];
      if (screenTrack) {
        const index = screenSharingIds.indexOf(screenTrack.id);
        screenSharingIds.splice(index, 1);
        this.handleRemoveTrack(videoRoom.localParticipant, screenTrack, true);
        screenTrack.stop();
        videoRoom.localParticipant.unpublishTrack(screenTrack);
      }
      this.setState({
        screenTrack: null,
        sharingTrackIds: screenSharingIds,
        localSharing: false
      });
    }
  };

  handleShareData = async () => {
    const { videoRoom, dataTrack } = this.state;
    if (!dataTrack) {
      const localDataTrack = await new Video.LocalDataTrack();
      this.setState({
        dataTrack: localDataTrack
      });
      if (videoRoom && videoRoom.localParticipant) {
        this.handleAddParticipant(
          videoRoom.localParticipant,
          localDataTrack,
          true
        );

        videoRoom.localParticipant.publishTrack(localDataTrack, {
          name: 'whiteBoard'
        });
      }
    } else if (videoRoom && videoRoom.localParticipant) {
      if (dataTrack) {
        this.handleRemoveTrack(videoRoom.localParticipant, dataTrack, true);
        videoRoom.localParticipant.unpublishTrack(dataTrack);
      }
      this.setState({ dataTrack: null });
    }
  };

  handleTabChange = (type) => {
    this.setState({ type });
  };

  handleUnreadUpdate = (count) => {
    if (!count) this.setState({ unread: 0 });
    else this.setState(({ unread }) => ({ unread: unread + count }));
  };

  handleDataReceived = (drawData) => {
    this.setState({ drawData });
  };

  handlePencilChange = (size) => {
    this.setState({ lineWidth: size, isText: false, eraser: false });
  };

  handleTextChange = () => {
    this.setState({ isText: true, eraser: false });
  };

  handleColorChange = (color) => {
    this.setState({ color });
  };

  handleErase = (size) => {
    this.setState({ lineWidth: size, isText: false, eraser: true });
  };

  handleMeetingDetails = () => {
    const { isOpenMeetingDetails } = this.state;
    this.setState({ isOpenMeetingDetails: !isOpenMeetingDetails });
  };

  setMeetingUriRef = (ref) => {
    this.meetingUriRef = ref;
  };

  handleCopyMeetingUri = () => {
    const el = this.meetingUriRef;
    el.select();
    document.execCommand('copy');
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

  handleSendDataMessage = (data) => {
    const { dataTrack } = this.state;
    if (dataTrack) {
      dataTrack.send(data);
    }
  };

  handleSession = () => {
    const { earned, points, noPointsAllowed } = this.state;
    if (this.pointsStarted && !earned && !points && !noPointsAllowed) {
      const elapsed = Number((new Date().getTime() - this.started) / 1000);

      if (elapsed > 600) {
        this.setState({ points: true });
      }
    }
    if (this.pointsStarted) this.handleSession();
  };

  handleOpenClaimPoints = () => {
    this.setState({ openVideoPoints: true });
  };

  handleVideoPointsClose = () => {
    this.setState({ openVideoPoints: false });
  };

  handleSelectedScreenSharing = (value) => {
    if (value) this.setState({ selectedScreenShareId: value });
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
        user: {
          data: { userId }
        }
      } = this.props;
      const { videoRoom, participants } = this.state;
      if (videoRoom && this.started) {
        const { sid } = videoRoom;
        const length = Number(
          Number((new Date().getTime() - this.started) / 1000).toFixed(0)
        );

        const participantsForPoints = participants
          .map((item) => Number(item.participant.identity))
          .filter((item) => item !== Number(userId));

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

  dominantToggle = () => {
    const { dominantView } = this.state;
    this.setState({ dominantView: !dominantView });
  };

  handleChange = (kind) => (event) => {
    const { onUpdateDeviceSelection } = this.props;
    onUpdateDeviceSelection(kind, event.target.value);
  };

  onMouseOver = () => {
    this.setState({ hover: true });
  };

  onMouseOut = () => {
    this.setState({ hover: false });
  };

  openSettings = () => {
    this.setState({ openSettings: true });
  };

  closeSettings = async () => {
    this.setState({ openSettings: false });

    const { selectedaudioinput } = this.props;
    const { videoRoom, participants } = this.state;
    this.setState({ isAudioSwitching: false });
    const localPartcipant = participants.find((item) => item.type === 'local');
    if (localPartcipant) {
      const { audio = [] } = localPartcipant;
      for (const track of audio) {
        track.stop();
        if (videoRoom) {
          videoRoom.localParticipant.unpublishTrack(track);

          const newLocalAudioTrack = await Video.createLocalAudioTrack({
            deviceId: selectedaudioinput
          });

          videoRoom.localParticipant.publishTrack(newLocalAudioTrack);
          this.handleAddParticipant(
            videoRoom.localParticipant,
            newLocalAudioTrack,
            true
          );
        }
      }
    }
  };

  openClassmatesDialog = () => {
    const {
      user: { expertMode }
    } = this.props;
    this.setState({
      openClassmates: expertMode ? 'student' : 'classmate',
      isOpenMeetingDetails: false
    });
  };

  closeClassmatesDialog = () => {
    this.setState({ openClassmates: '' });
  };

  courseDisplayName = () => {
    const {
      user: { userClasses },
      router: {
        location: { search }
      }
    } = this.props;
    const query = queryString.parse(search);

    if (query.class && userClasses?.classList) {
      const { classId } = decypherClass(query.class);
      const selectedCourse = userClasses.classList.find(
        (cl) => cl.classId === Number(classId)
      );
      if (selectedCourse) return selectedCourse.courseDisplayName;
    }
    return '';
  };

  openChat = (value) => {
    this.setState({ chatOpen: true, selectedTab: value });
  };

  closeChat = () => {
    this.setState({ chatOpen: false });
  };

  render() {
    const {
      classes,
      currentUser: {
        data: { userId: currentUserId }
      },
      user,
      channel,
      roomName,
      selectedvideoinput,
      videoinput,
      selectedaudioinput,
      audioinput,
      chat,
      meetupRef
    } = this.props;
    const {
      data: {
        userId,
        firstName,
        lastName
        // profileImage,
      },
      expertMode
    } = user;
    const {
      currentClassList,
      videoRoom,
      lockedParticipant,
      participants,
      isVideoSharing,
      dominantSpeaker,
      sharingTrackIds,
      profiles,
      isVideoSwitching,
      isAudioSwitching,
      selectedTab,
      // screenTrack,
      // type,
      // unread,
      dataTrack,
      drawData,
      lineWidth,
      color,
      isText,
      eraser,
      canvasImg,
      // points,
      openVideoPoints,
      dominantView,
      postingPoints,
      openSettings,
      isOpenMeetingDetails,
      chatOpen,
      openClassmates,
      viewMode,
      selectedScreenShareId,
      localSharing,
      hover
    } = this.state;

    const localPartcipant = participants.find((item) => item.type === 'local');

    const videoExists =
      localPartcipant &&
      localPartcipant.video.length > 0 &&
      localPartcipant.video.find(
        (track) => sharingTrackIds.indexOf(track.id) === -1
      );
    const isAudioEnabled = localPartcipant && localPartcipant.audio.length > 0;

    const unreadMessageCount = get(chat, `data.local.${channel.sid}.unread`);

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <StudyRoomChat
              participants={participants}
              open={chatOpen}
              handleClose={this.closeChat}
              selectedTab={selectedTab}
            />
            <div className={classes.header}>
              <Tooltip
                id={9064}
                placement="bottom-start"
                text="You can change your audio/visual settings or report an issue here. Happy studying!"
                totalSteps={4}
                completedSteps={3}
                okButton="Yay! 🎉"
              >
                {hover ? (
                  <Button
                    variant="contained"
                    onMouseOut={() => this.onMouseOut()}
                    color="secondary"
                    className={classes.settingBtn}
                    startIcon={<SettingsIcon />}
                    onClick={this.openSettings}
                  >
                    Settings
                  </Button>
                ) : (
                  <IconButton
                    onMouseOver={() => this.onMouseOver()}
                    variant="contained"
                    color="secondary"
                    className={classes.settingBtn}
                    aria-label="settings"
                    size="small"
                    onClick={this.openSettings}
                  >
                    <SettingsIcon />
                  </IconButton>
                )}
              </Tooltip>
              <GalleryViewMode
                isSharing={!!sharingTrackIds.length}
                currentView={viewMode}
                onChange={this.handleChangeView}
              />
            </div>
            {['speaker-view', 'side-by-side'].indexOf(viewMode) > -1 && (
              <div
                className={cx(
                  viewMode === 'speaker-view' && classes.speakerViewThumbnails,
                  viewMode === 'side-by-side' && classes.sideBySideViewThumbnail
                )}
              >
                <Thumbnails
                  meetupRef={meetupRef}
                  participants={participants}
                  currentUserId={currentUserId}
                  profiles={profiles}
                  viewMode={viewMode}
                  isSharing={isVideoSharing}
                  lockedParticipant={lockedParticipant}
                  sharingTrackIds={sharingTrackIds}
                  selectedScreenShareId={selectedScreenShareId}
                  dominantSpeaker={dominantSpeaker}
                  onLockParticipant={this.handleLockParticipant}
                />
              </div>
            )}
            {/* {participants.length > 1 &&  <LeftPanel
              participants={participants.length}
              localParticipant={
                <LocalThumbnail
                  key={
                    localPartcipant && localPartcipant.video.length > 0
                      ? localPartcipant.video[0].id
                      : 'LocalParticipant'
                  }
                  profileImage={profileImage}
                  video={
                    localPartcipant &&
                    localPartcipant.video.length > 0 &&
                    localPartcipant.video[0]
                  }
                  isVideo={isVideoEnabled}
                  isMic={isAudioEnabled}
                />
              }
              thumbnails={
                <Thumbnails
                  participants={participants}
                  profiles={profiles}
                  lockedParticipant={lockedParticipant}
                  sharingTrackIds={sharingTrackIds}
                  onLockParticipant={this.handleLockParticipant}
                />
              }
              chat={
                channel && (
                  <VideoChatChannel
                    open={type === 'chat'}
                    user={user.data}
                    channel={channel}
                    onUnreadUpdate={this.handleUnreadUpdate}
                  />
                )
              }
              unread={unread}
              onTabChange={this.handleTabChange}
            />} */}
            <Controls
              isConnected={Boolean(videoRoom)}
              dominantToggle={this.dominantToggle}
              toggleChat={this.openChat}
              dominantView={dominantView}
              localSharing={localSharing}
              isVideoEnabled={!!videoExists}
              isAudioEnabled={isAudioEnabled}
              isScreenSharingSupported={Boolean(
                navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
              )}
              isSharing={isVideoSharing}
              isSharingData={Boolean(dataTrack)}
              isVideoSwitching={isVideoSwitching}
              isAudioSwitching={isAudioSwitching}
              isOpenMeetingDetails={isOpenMeetingDetails}
              openMeetingDetails={this.handleMeetingDetails}
              endCall={this.handleEndCall}
              disableVideo={this.handleDisableVideo}
              disableAudio={this.handleDisableAudio}
              shareScreen={this.handleShareScreen}
              shareData={this.handleShareData}
              unreadMessageCount={unreadMessageCount}
            />
            {/* <SharingScreenControl
              isSharing={Boolean(screenTrack)}
              onStopSharing={this.handleShareScreen}
            /> */}
            <VideoGrid
              participants={participants}
              meetupRef={meetupRef}
              dominantView={dominantView}
              profiles={profiles}
              lockedParticipant={lockedParticipant}
              dominantSpeaker={dominantSpeaker}
              sharingTrackIds={sharingTrackIds}
              isSharing={isVideoSharing}
              localSharing={localSharing}
              isDataSharing={Boolean(dataTrack)}
              viewMode={viewMode}
              handleSelectedScreenSharing={this.handleSelectedScreenSharing}
              currentUserId={currentUserId}
            />
            {Boolean(dataTrack) && (
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
                  sendDataMessage={this.handleSendDataMessage}
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
          </div>
          <Dialog
            onCancel={this.handleCanvasClose}
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
        </ErrorBoundary>
        {/* <ErrorBoundary>
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
        </ErrorBoundary> */}
        <ErrorBoundary>
          <VideoPointsDialog
            open={openVideoPoints}
            loading={postingPoints}
            onClose={this.handleVideoPointsClose}
            onSubmit={this.handlePointsSubmit}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          {isOpenMeetingDetails ? (
            <MeetingDetails
              setRef={this.setMeetingUriRef}
              meetingUriRef={this.meetingUriRef}
              onClose={this.handleMeetingDetails}
              onCopy={this.handleCopyMeetingUri}
              openClassmatesDialog={this.openClassmatesDialog}
              meetingUri={`${VIDEO_SHARE_URL}/${roomName}`}
            />
          ) : null}
        </ErrorBoundary>
        <ErrorBoundary>
          <ClassmatesDialog
            meetingInvite
            userId={userId}
            selectedClasses={currentClassList}
            close={this.closeClassmatesDialog}
            expertMode={expertMode}
            state={openClassmates}
            courseDisplayName={this.courseDisplayName()}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <DeviceSettings
            closeSettings={this.closeSettings}
            handleChange={this.handleChange}
            videoinput={videoinput}
            audioinput={audioinput}
            selectedvideoinput={selectedvideoinput}
            selectedaudioinput={selectedaudioinput}
            openSettings={openSettings}
            profiles={profiles}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}
const mapStateToProps = ({ user, router, chat }: StoreState): {} => ({
  currentUser: user,
  router,
  chat
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(withSnackbar(MeetUp)));
