// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
  screen: {
    height: 'auto   !important',
    width: '100%    !important',
    '& video': {
      width: '100%    !important',
      height: 'auto   !important',
      maxHeight: '100%    !important'
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
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
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
      if (video.stop) video.stop();
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
      video,
      isVideo,
      isMic,
      isVisible
    } = this.props;

    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    const isScreen = video && video.name === 'screenSharing';

    return (
      <Grid item xs hidden={!isVisible}>
        <div className={classes.root}>
          <div className={classes.videoWrapper}>
            {isVideo ? (
              <div
                className={cx(classes.video, isScreen && classes.screen)}
                ref={this.videoinput}
              />
            ) : (
              <div className={classes.avatar}>
                <Avatar
                  alt={initials}
                  src={profileImage}
                  style={{ width: 100, height: 100 }}
                >
                  {initials === '' ? <PersonIcon /> : initials}
                </Avatar>
                {firstName !== '' && (
                  <Typography
                    variant="h6"
                    style={{ color: 'white', fontWeight: 'bold' }}
                  >{`${firstName} ${lastName}`}</Typography>
                )}
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
