// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import MicOffIcon from '@material-ui/icons/MicOff';

const styles = () => ({
  root: {
    minWidth: 300,
    height: '100%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  videoWrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  video: {
    height: '100%   !important',
    width: 'auto    !important',
    '& video': {
      width: 'auto    !important',
      height: '100%   !important'
    }
  },
  mic: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0
  },
  icon: {
    height: 40,
    width: 40
  }
});

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  profileImage: string,
  isVideo: boolean,
  isMic: boolean,
  video: ?Object,
  isVisible: boolean
};

type State = {};

class VideoGridItem extends React.PureComponent<Props, State> {
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
      const attachedElements = video.detach();
      attachedElements.forEach(element => element.remove());
    }
  };

  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      isVideo,
      isMic,
      isVisible
    } = this.props;

    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    return (
      <Grid item xs hidden={!isVisible}>
        <div className={classes.root}>
          <div className={classes.videoWrapper}>
            {isVideo ? (
              <div className={classes.video} ref={this.videoinput} />
            ) : (
              <div className={classes.avatar}>
                <Avatar
                  alt={initials}
                  src={profileImage}
                  style={{ width: 100, height: 100 }}
                >
                  {initials === '' ? <PersonIcon /> : initials}
                </Avatar>
              </div>
            )}
          </div>
          {!isMic && (
            <div className={classes.mic}>
              <MicOffIcon className={classes.icon} />
            </div>
          )}
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(VideoGridItem);
