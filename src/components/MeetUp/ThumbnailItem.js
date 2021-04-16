/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import PersonIcon from '@material-ui/icons/Person';
// import LockIcon from '@material-ui/icons/Lock';
// import VideocamOffIcon from '@material-ui/icons/VideocamOff';
// import ScreenShareIcon from '@material-ui/icons/ScreenShare';
// import CastForEducationIcon from '@material-ui/icons/CastForEducation';
// import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import { ReactComponent as Mute } from 'assets/svg/mute.svg'

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    margin: theme.spacing(0.5),
    height: '100%',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(1.5)
    },
  },
  hide: {
    display: 'none !important'
  },
  mic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(0.5),
    backgroundColor: 'rgba(44, 45, 45, .75)',
    zIndex: 999,
    minWidth: 130,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5)
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.circleIn.palette.videoThumbDefaultBackground,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  videoWrapper: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 130,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: 150,
      height: 100
    }
  },
  video: {
    height: '100%   !important',
    width: '100%    !important',
    '& video': {
      width: '100%',
      height: '100%   !important',
      objectFit: 'container',
      boxSizing: 'border-box',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    }
  },
  avatarImage: {
    width: '80%',
    objectFit: 'fill'
  },
  content: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  title: {
    color: 'black',
    marginLeft: theme.spacing()
  },
  media: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  icon: {
    color: 'white',
    width: 14,
    height: 14,
    marginRight: theme.spacing(1)
  },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  initials: {
    fontWeight:700,
    fontSize: 50,
    color: '#000000'
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
    justifyContent: 'center',
    borderRadius: 4
  },
  username: {
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: theme.spacing(3)
  },
  cameraVideo: {
    '& video': {
      transform: 'rotateY(180deg)',
      '-webkit-transform': 'rotateY(180deg)', /* Safari and Chrome */
      '-moz-transform': 'rotateY(180deg)' /* Firefox */
    }
  },
});

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  profileImage: string,
  video: ?Object,
  // isPinned: boolean,
  isVideo: boolean,
  isMic: boolean,
  highlight: boolean,
  isLocal: boolean
  // isDataSharing: boolean,
  // isSharing: boolean
};

type State = {};

class ThumbnailItem extends React.PureComponent<Props, State> {
  state = {};

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.state = {
      hover: false
    }
    this.videoinput = React.createRef();
  }

  componentDidMount = () => {
    const { video } = this.props;
    if (video) {
      this.videoinput.current.appendChild(video.attach());
    }
  };

  onMouseOver = () => {
    this.setState({ hover: true })
  }

  onMouseOut = () => {
    this.setState({ hover: false })
  }

  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      isVisible,
      highlight,
      sharingTrackIds,
      viewMode,
      isLocal,
      // isPinned,
      isVideo,
      isMic,
      // isDataSharing,
      // isSharing
    } = this.props;
    const { hover } = this.state
    const initials = `${firstName !== '' ? firstName === 'You' ? 'You' : firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    const isScreenShare = !!(['speaker-view', 'side-by-side'].indexOf(viewMode) > -1 && sharingTrackIds.length)
    const activeBorder = highlight && isScreenShare ? { border: '4px solid #03A9F4' } : {}

    return (
      <Box
        onMouseOver={() => this.onMouseOver()}
        onMouseOut={() => this.onMouseOut()}
        className={cx(classes.root, isVisible && classes.hide)}
        style={{ ...activeBorder }}
      >
        <div className={classes.videoWrapper}>
          {isVideo ? (
            <div
              className={cx(
                classes.video,
                isLocal && classes.cameraVideo
              )}
              ref={this.videoinput}
            />
          ) : profileImage ? (
            <div className={classes.avatar}>
              <Avatar
                alt={initials}
                variant="square"
                src={profileImage}
                classes={{
                  img: classes.avatarImage
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          ) : (
            <div className={classes.profile}>
              <Typography className={classes.initials}>
                {initials}
              </Typography>
            </div>
          )}
        </div>
        <div className={cx(hover && (firstName || lastName) ? classes.mic : classes.hide)}>
          {!isMic && <Mute className={classes.icon} />}
          <Typography
            className={classes.username}
            variant="h6"
          >
            {`${firstName} ${lastName}`}
          </Typography>
        </div>
      </Box>
    );
  }
}

export default withStyles(styles)(ThumbnailItem);
