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
  video: {
    height: '100%   !important',
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
    zIndex: 9
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
    marginRight: theme.spacing(1.5)
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
    marginRight: theme.spacing(1)
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
    fontSize: 150,
    color: '#000000'
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
});

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  isVideo: boolean,
  isMic: boolean,
  video: ?Object,
  isVisible: boolean,
  count: number
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
      // highlight,
      viewMode
    } = this.props;

    let xs = 0
    let height = ''
    const initials = `${firstName !== '' ? firstName.charAt(0) : ''}${
      lastName !== '' ? lastName.charAt(0) : ''
    }`;

    const isScreen = video && video.name === 'screenSharing';

    if (viewMode === 'minimize') {
      xs = 3
      height = `${140}px`
    } else if (viewMode === 'medium-view') {
      xs = 3
      height = '33.3%'
    } else {
      const factor = Math.ceil(Math.sqrt(count))
      xs = 12 / factor
      height = `${100 / factor}%`
    }

    // const activeBorder = highlight ? { border: '1px solid #03A9F4' } : {}
    return (
      <Grid
        item xs={xs}
        style={{ height }}
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
                  className={classes.initials}
                >
                  {initials}
                </Typography>
              </div>
            )}
          </div>
          {!isMic && (
            <div className={cx(
              classes.mic,
              viewMode === 'minimize' && classes.minimizeMic
            )}>
              <Mute className={cx(
                classes.icon,
                viewMode === 'minimize' && classes.minimizeIcon,
                viewMode === 'medium-view' && classes.mediumIcon
              )} />
              <Typography
                className={cx(
                  classes.username,
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
