// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';

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
    width: '100%',
    '& video': {
      objectFit: 'cover',
      width: '100%',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    right: 10
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
  },
  black: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
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
  isVideo: boolean,
  isMic: boolean,
  video: ?Object,
  isVisible: boolean,
  count: number,
  highlight: boolean,
  isSharing: boolean
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
      isVisible,
      count,
      highlight
      // isSharing
    } = this.props;

    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    const isScreen = video && video.name === 'screenSharing';

    const factor = Math.ceil(Math.sqrt(count))
    const xs = 12 / factor
    const height = 100 / factor

    const activeBorder = highlight ? { border: '1px solid #03A9F4' } : {}

    return (
      <Grid item xs={xs} style={{ ...activeBorder, height: `${height}vh` }} hidden={!isVisible}>
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
            {/* {isSharing && ( */}
            {/* <div className={classes.black}> */}
            {/* <ScreenShareIcon fontSize="large" /> */}
            {/* </div> */}
            {/* )} */}
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
