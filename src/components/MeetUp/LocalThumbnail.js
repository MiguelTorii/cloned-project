/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
// import ScreenShareIcon from '@material-ui/icons/ScreenShare';
// import CastForEducationIcon from '@material-ui/icons/CastForEducation';

const styles = () => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 0
  },
  videoWrapper: {
    height: 60,
    width: 120,
    minHeight: 60,
    minWidth: 120,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 4,
    position: 'relative'
  },
  video: {
    height: '100%   !important',
    width: 'auto    !important',
    maxWidth: '120px !important',
    '& video': {
      width: 'auto    !important',
      maxWidth: '120px !important',
      height: '100%   !important'
    }
  },
  content: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  media: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  icon: {
    color: 'white',
    width: 16,
    height: 16
  }
});

type Props = {
  classes: Object,
  profileImage: string,
  video: ?Object,
  isVideo: boolean,
  isMic: boolean
};

type State = {};

class LocalThumbnail extends React.PureComponent<Props, State> {
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
      if (video.stop) video.stop();
      const attachedElements = video.detach();
      attachedElements.forEach(element => element.remove());
    }
  };

  videoinput: Object;

  render() {
    const { classes, profileImage, isVideo, isMic } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.videoWrapper}>
          {isVideo ? (
            <div className={classes.video} ref={this.videoinput} />
          ) : (
            <div className={classes.avatar}>
              <Avatar alt="You" src={profileImage} sizes="small">
                You
              </Avatar>
            </div>
          )}
        </div>
        <div className={classes.content}>
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
      </div>
    );
  }
}

export default withStyles(styles)(LocalThumbnail);
