/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
// import ScreenShareIcon from '@material-ui/icons/ScreenShare';
// import CastForEducationIcon from '@material-ui/icons/CastForEducation';

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    padding: theme.spacing.unit
  },
  videoWrapper: {
    height: 60,
    width: 80,
    minHeight: 60,
    minWidth: 80,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    position: 'relative'
  },
  video: {
    height: '100%   !important',
    width: 'auto    !important',
    maxWidth: '80px !important',
    '& video': {
      width: 'auto    !important',
      maxWidth: '80px !important',
      height: '100%   !important'
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 60,
    width: '100%'
  },
  title: {
    color: 'black',
    marginLeft: theme.spacing.unit
  },
  media: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  icon: {
    color: 'black',
    width: 16,
    height: 16
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  profileImage: string,
  video: ?Object,
  isPinned: boolean,
  isVideo: boolean,
  isMic: boolean
};

type State = {};

class ThumbnailItem extends React.PureComponent<Props, State> {
  state = {};

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.videoinput = React.createRef();
  }

  componentDidMount = () => {
    const { video } = this.props;
    if (video) {
      this.videoinput.current.appendChild(video.attach());
    }
  };

  componentWillUnmount = () => {
    const { video } = this.props;
    if (video) {
      if(video.stop) video.stop();
      const attachedElements = video.detach();
      attachedElements.forEach(element => element.remove());
    }
  };

  videoinput: Object;

  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      isPinned,
      isVideo,
      isMic
    } = this.props;
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    return (
      <div className={classes.root}>
        <div className={classes.videoWrapper}>
          {isVideo ? (
            <div className={classes.video} ref={this.videoinput} />
          ) : (
            <div className={classes.avatar}>
              <Avatar
                alt={initials}
                src={profileImage}
                style={{ width: 30, height: 30 }}
              >
                {initials === '' ? <PersonIcon /> : initials}
              </Avatar>
            </div>
          )}
        </div>
        <div className={classes.content}>
          <Typography variant="body1" className={classes.title}>
            {`${firstName} ${lastName}`}
          </Typography>
          <div className={classes.media}>
            {isVideo ? (
              <VideocamIcon className={classes.icon} />
            ) : (
              <VideocamOffIcon className={classes.icon} />
            )}
            {isMic ? (
              <MicIcon className={classes.icon} />
            ) : (
              <MicOffIcon className={classes.icon} />
            )}
          </div>
        </div>
        {isPinned && (
          <div className={classes.overlay}>
            <LockIcon />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ThumbnailItem);
