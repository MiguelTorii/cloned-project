/* eslint-disable no-nested-ternary */
// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as Mute } from 'assets/svg/mute.svg'

const styles = theme => ({
  root: {
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
    backgroundColor: theme.circleIn.palette.videoThumbDefaultBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 10
  },
  shareGalleryInitials: {
    fontSize: '6vw !important'
  },
  video: {
    height: '100% !important',
    width: '100%',
    '& video': {
      width: '100%',
      height: '100%   !important',
      objectFit: 'cover',
      border: '1px solid #979797',
      boxSizing: 'border-box',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: 10
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
    left: 10,
    padding: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: 10,
    zIndex: 9,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1)
    },
  },
  icon: {
    height: 28,
    width: 28,
    marginRight: theme.spacing(2)
  },
  username: {
    fontWeight: 'bold',
    fontSize: '1.3vw',
    marginRight: theme.spacing(3)
  },
  mediumIcon: {
    height: 24,
    width: 24,
    marginRight: theme.spacing(1.5)
  },
  mediumUsername: {
    fontWeight: 'bold',
    fontSize: '.9vw',
    marginRight: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      fontSize: '1.2vw'
    },
  },
  minimizeMic: {
    padding: theme.spacing(1)
  },
  minimizeIcon: {
    height: 20,
    width: 20,
    marginRight: theme.spacing(1)
  },
  minimizeUsername: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      fontSize: '1.5vw'
    },
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
  },
  initials: {
    fontWeight:700,
    fontSize: '9vw',
    color: '#000000'
  },
  minimizeInitials: {
    fontSize: '7vw'
  },
  profile: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.circleIn.palette.videoThumbDefaultBackground,
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  shareGalleryVideo: {
    padding: theme.spacing(1, 0)
  },
  shareGalleryView: {
    flexBasis: 'auto',
    justifyContent: 'flex-start',
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    overflowY: 'scroll'
  },
  shareGalleryMic: {
    padding: theme.spacing(1)
  },
  shareGalleryUsername: {
    fontSize: 12
  }
});

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  isVideo: boolean,
  isMic: boolean,
  video: ?Object,
  isVisible: boolean,
  isSharedGallery: boolean,
  count: number
};

type State = {};

class VideoGridItem extends React.PureComponent<Props, State> {
  state = {};

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.state = {
      windowWidth: window.innerWidth
    }
    this.videoinput = React.createRef();
  }

  componentDidMount = () => {
    const { video } = this.props;
    if (video) {
      this.videoinput.current.appendChild(video.attach());
    }

    window.addEventListener("resize", this.updateDimensions);
  };

  componentWillUnmount = () => {
    const { video } = this.props;
    if (video) {
      // Removing this to fix the sharing screen problem
      // and let react unmount handle kiling the video streams
      // if (video.stop) video.stop();
      // const attachedElements = video.detach();
      // attachedElements.forEach(element => element.remove());
    }

    window.removeEventListener("resize", this.updateDimensions);
  };

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth })
  }

  render() {
    const {
      classes,
      firstName,
      lastName,
      video,
      isVideo,
      isMic,
      isVisible,
      count,
      isSharedGallery,
      // highlight,
      viewMode
    } = this.props

    const { windowWidth } = this.state

    let xs = 0
    let height = ''
    let shareThumbnailHeight = ''
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    const isScreen = video && video.name === 'screenSharing';

    if (isSharedGallery) {
      xs = 12
      shareThumbnailHeight='25%'
    } else if (viewMode === 'minimize') {
      xs = windowWidth > 600 ? 3 : windowWidth > 400 ? 4 : 6
      height = `${140}px`
    } else if (viewMode === 'medium-view') {
      xs = windowWidth > 600 ? 3 : 6
      height = '33.3%'
    } else {
      const factor = Math.ceil(Math.sqrt(count))
      xs = windowWidth > 600 ? 12 / factor : 12
      height = windowWidth > 600 ? `${100 / factor}%` : `${Math.ceil(100 / count)}%`
    }

    // const activeBorder = highlight ? { border: '1px solid #03A9F4' } : {}
    return (
      <Grid
        item xs={xs}
        style={{
          height: isSharedGallery ? shareThumbnailHeight : height,
          flexBasis: isSharedGallery ? 'auto' : '100%'
        }}
        className={cx(isSharedGallery && classes.shareGalleryVideo)}
        hidden={!isVisible}
      >
        <div className={classes.root}>
          <div className={classes.videoWrapper}>
            {isVideo ? (
              <div
                className={cx(classes.video, isScreen && classes.screen)}
                ref={this.videoinput}
              />
            ) : (
              <div className={classes.profile}>
                <Typography
                  className={cx(
                    classes.initials,
                    viewMode === 'minimize' && classes.minimizeInitials,
                    isSharedGallery && classes.shareGalleryInitials
                  )}
                >
                  {initials}
                </Typography>
              </div>
            )}
          </div>
          {!isMic && (
            <div className={cx(
              classes.mic,
              viewMode === 'minimize' && classes.minimizeMic,
              isSharedGallery && classes.shareGalleryMic
            )}>
              <Mute className={cx(
                classes.icon,
                viewMode === 'minimize' && classes.minimizeIcon,
                viewMode === 'medium-view' && classes.mediumIcon
              )} />
              <Typography
                className={cx(
                  classes.username,
                  isSharedGallery && classes.shareGalleryUsername,
                  viewMode === 'minimize' && classes.minimizeUsername,
                  viewMode === 'medium-view' && classes.mediumUsername
                )}
                variant="h6"
              >
                {`${firstName} ${lastName}`}
              </Typography>
            </div>
          )}
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(VideoGridItem);
