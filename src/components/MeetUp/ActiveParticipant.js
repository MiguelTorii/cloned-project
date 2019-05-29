// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import MicOffIcon from '@material-ui/icons/MicOff';
import { getUserProfile } from '../../api/user';

const styles = () => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  wrapper: {
    backgroundColor: 'black',
    '& video': {
      width: '100%    !important',
      height: 'auto   !important',
      maxHeight: '100vh !important'
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
  }
});

type Props = {
  classes: Object,
  participant: Object
};

type State = {
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  firstName: string,
  lastName: string,
  profileImage: string
};

class ActiveParticipant extends React.Component<Props, State> {
  state = {
    isVideoEnabled: true,
    isAudioEnabled: true,
    firstName: '',
    lastName: '',
    profileImage: ''
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.mediainput = React.createRef();
    this.mounted = false;
  }

  componentDidMount = async () => {
    this.mounted = true;
    const { participant } = this.props;

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
      if (!this.mounted) return;
      const { kind } = track;
      if (kind === 'video') {
        this.setState({ isVideoEnabled: true });
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: true });
      }
    });
    participant.on('trackDisabled', track => {
      if (!this.mounted) return;
      const { kind } = track;
      if (kind === 'video') {
        this.setState({ isVideoEnabled: false });
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: false });
      }
    });

    participant.tracks.forEach(publication => {
      if (!this.mounted) return;
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
        }
      }
    });

    participant.on('trackSubscribed', track => {
      if (!this.mounted) return;
      const { kind } = track;

      if (kind === 'video') {
        this.setState({ isVideoEnabled: track.isEnabled });
        this.mediainput.current.appendChild(track.attach());
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: track.isEnabled });
        this.mediainput.current.appendChild(track.attach());
      }
    });

    participant.on('trackUnsubscribed', track => {
      if (!this.mounted) return;
      const { kind } = track;
      if (kind === 'video') {
        this.setState({ isVideoEnabled: false });
        this.detachTrack(track);
      } else if (kind === 'audio') {
        this.setState({ isAudioEnabled: false });
        this.detachTrack(track);
      }
    });
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  detachTrack = (track: Object) => {
    const attachedElements = track.detach();
    attachedElements.forEach(element => element.remove());
  };

  mediainput: Object;

  mounted: boolean;

  render() {
    const { classes } = this.props;
    const {
      isVideoEnabled,
      isAudioEnabled,
      firstName = '',
      lastName = '',
      profileImage = ''
    } = this.state;
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;
    return (
      <div className={classes.root}>
        <div ref={this.mediainput} className={classes.wrapper} />
        {!isVideoEnabled && (
          <div className={classes.overlay}>
            <Avatar
              alt={initials}
              src={profileImage}
              style={{ width: 60, height: 60 }}
            >
              {initials === '' ? <PersonIcon /> : initials}
            </Avatar>
            {firstName !== '' && (
              <Typography variant="h6"
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
      </div>
    );
  }
}

export default withStyles(styles)(ActiveParticipant);
