// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import { getUserProfile } from '../../api/user';

const styles = () => ({
  root: {
    width: 160,
    height: 120,
    position: 'relative'
  },
  wrapper: {
    backgroundColor: 'black',
    '& video': {
      width: '160px    !important',
      height: 'auto   !important',
      maxHeight: '120px !important'
    }
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 100
  },
  isPinned: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 200
  },
  column: {
    flexDirection: 'column'
  },
  text: {
    color: 'white'
  },
  mic: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 5,
    zIndex: 200
  },
  sharingData: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 5,
    zIndex: 200
  }
});

type Props = {
  classes: Object,
  participant: Object,
  isSharing: boolean,
  isSharingData: boolean,
  dataReceived: Function,
  isPinned: boolean,
  onPin: Function
};

type State = {
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  firstName: string,
  lastName: string,
  profileImage: string,
  isSharingData: boolean
};

class ThumbnailsItem extends React.Component<Props, State> {
  state = {
    isVideoEnabled: true,
    isAudioEnabled: true,
    firstName: '',
    lastName: '',
    profileImage: '',
    isSharingData: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.mediainput = React.createRef();
  }

  componentDidMount = async () => {
    const { participant, dataReceived } = this.props;
    const { userProfile } = await getUserProfile({
      userId: participant.identity
    });
    const { firstName, lastName, userProfileUrl } = userProfile;
    this.setState({
      firstName,
      lastName,
      profileImage: userProfileUrl
    });

    participant.on('trackEnabled', track => {
      const { kind } = track;
      if (kind === 'video') {
        this.setState({ isVideoEnabled: true });
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: true });
      }
    });
    participant.on('trackDisabled', track => {
      const { kind } = track;
      if (kind === 'video') {
        this.setState({ isVideoEnabled: false });
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: false });
      }
    });

    participant.tracks.forEach(publication => {
      if (
        publication.isSubscribed ||
        !Object.getOwnPropertyDescriptor(publication, 'isSubscribed')
      ) {
        const { track } = publication;
        const { kind } = track;
        if (kind === 'video') {
          this.setState({ isVideoEnabled: track.isEnabled });
          this.mediainput.current.appendChild(track.attach());
        } else if (kind === 'audio') {
          this.setState({ isAudioEnabled: track.isEnabled });
          this.mediainput.current.appendChild(track.attach());
        } else if (kind === 'data') {
          track.on('message', data => {
            // this.setState({ isSharingData: true });
            const message = JSON.parse(data);
            const { type = '' } = message;
            if (type === 'drawing') dataReceived(data);
            else if (type === 'start_whiteboard') {
              this.setState({ isSharingData: true });
            } else if (type === 'stop_whiteboard') {
              this.setState({ isSharingData: false });
            }
          });
        }
      }
    });

    participant.on('trackSubscribed', track => {
      const { kind } = track;

      if (kind === 'video') {
        this.mediainput.current.appendChild(track.attach());
        this.setState({ isVideoEnabled: track.isEnabled });
      } else if (kind === 'audio') {
        this.mediainput.current.appendChild(track.attach());
        this.setState({ isAudioEnabled: track.isEnabled });
      } else if (kind === 'data') {
        track.on('message', data => {
          // this.setState({ isSharingData: true });
          const message = JSON.parse(data);
          const { type = '' } = message;
          if (type === 'drawing') dataReceived(data);
          else if (type === 'start_whiteboard') {
            this.setState({ isSharingData: true });
          } else if (type === 'stop_whiteboard') {
            this.setState({ isSharingData: false });
          }
        });
      }
    });

    participant.on('trackUnsubscribed', track => {
      const { kind } = track;
      if (kind === 'video') {
        this.setState({ isVideoEnabled: false });
        this.detachTrack(track);
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: false });
        this.detachTrack(track);
      } else if (kind === 'data') {
        this.setState({ isSharingData: false });
      }
    });
  };

  componentWillUnmount = () => {
    const { participant } = this.props;
    if (participant) {
      participant.removeAllListeners();
    }
  };

  handlePin = () => {
    const { participant, onPin } = this.props;
    if (participant) {
      onPin(participant)
    }
  };

  detachTrack = (track: Object) => {
    const attachedElements = track.detach();
    attachedElements.forEach(element => element.remove());
  };

  mediainput: Object;

  render() {
    const {
      classes,
      isSharing,
      isSharingData: isSharingDataProps,
      isPinned
    } = this.props;
    const {
      isVideoEnabled,
      isAudioEnabled,
      firstName = '',
      lastName = '',
      profileImage = '',
      isSharingData
    } = this.state;
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    return (
      <ButtonBase className={classes.root} onClick={this.handlePin}>
        <div ref={this.mediainput} className={classes.wrapper} />
        {isSharing && (
          <div className={cx(classes.overlay, classes.column)}>
            <Typography variant="h6" className={classes.text}>
              Presenting
            </Typography>
            <ScreenShareIcon />
          </div>
        )}
        {
          isPinned && (
            <div className={classes.isPinned}>
              <LockIcon />
            </div>)
        }
        {!isVideoEnabled && !isSharing && (
          <div className={classes.overlay}>
            <Avatar
              alt={initials}
              src={profileImage}
              style={{ width: 60, height: 60 }}
            >
              {initials === '' ? <PersonIcon /> : initials}
            </Avatar>
            {firstName !== '' && (
              <Typography
                style={{ color: 'white', fontWeight: 'bold' }}
              >{`${firstName} ${lastName}`}</Typography>
            )}
          </div>
        )}
        {!isAudioEnabled && (
          <div className={classes.mic}>
            <MicOffIcon style={{ color: 'red' }} />
          </div>
        )}
        {(isSharingData || isSharingDataProps) && (
          <div className={classes.sharingData}>
            <CastForEducationIcon style={{ color: 'white' }} />
          </div>
        )}
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(ThumbnailsItem);
