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
import { ReactComponent as Mute } from 'assets/svg/mute.svg';

import { styles } from '../_styles/MeetUp/ThumbnailItem';

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
    };
    this.videoinput = React.createRef();
  }

  componentDidMount = () => {
    const { video } = this.props;
    if (video) {
      this.videoinput.current.appendChild(video.attach());
    }
  };

  onMouseOver = () => {
    this.setState({ hover: true });
  };

  onMouseOut = () => {
    this.setState({ hover: false });
  };

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
      isMic
      // isDataSharing,
      // isSharing
    } = this.props;
    const { hover } = this.state;
    const initials = `${
      firstName !== '' ? (firstName === 'You' ? 'You' : firstName.charAt(0)) : ''
    }${lastName !== '' ? lastName.charAt(0) : ''}`;

    const isScreenShare = !!(
      ['speaker-view', 'side-by-side'].indexOf(viewMode) > -1 && sharingTrackIds.length
    );
    const activeBorder = highlight && isScreenShare ? { border: '4px solid #03A9F4' } : {};

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
              className={cx(classes.video, isLocal && classes.cameraVideo)}
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
                  height: '100%'
                }}
              />
            </div>
          ) : (
            <div className={classes.profile}>
              <Typography className={classes.initials}>{initials}</Typography>
            </div>
          )}
        </div>
        <div
          className={cx(
            !isMic ? classes.mic : hover && (firstName || lastName) ? classes.mic : classes.hide
          )}
        >
          {!isMic && <Mute className={classes.icon} />}
          <Typography className={classes.username} variant="h6">
            {`${firstName} ${lastName}`}
          </Typography>
        </div>
      </Box>
    );
  }
}

export default withStyles(styles)(ThumbnailItem);
