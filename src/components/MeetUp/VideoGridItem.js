/* eslint-disable no-nested-ternary */
// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ReactComponent as Mute } from 'assets/svg/mute.svg';

import { styles } from '../_styles/MeetUp/VideoGridItem';

type Props = {
  classes: Object,
  firstName: string,
  lastName: string,
  profileImage: string,
  isVideo: boolean,
  isMic: boolean,
  totalPageCount: number,
  video: ?Object,
  isVisible: boolean,
  count: number,
  handleSelectedScreenSharing: Function,
  sharingType: string
};

type State = {};

class VideoGridItem extends React.PureComponent<Props, State> {
  state = {};

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.state = {
      windowWidth: window.innerWidth,
      hover: false
    };
    this.videoinput = React.createRef();
  }

  componentDidMount = () => {
    const {
      video,
      handleSelectedScreenSharing,
      isSharing,
      sharingTrackIds,
      localSharing
    } = this.props;
    if (video) {
      this.videoinput.current.appendChild(video.attach());

      if (localSharing && sharingTrackIds.indexOf(video.id) > -1) {
        handleSelectedScreenSharing(video.id);
      } else if (isSharing && sharingTrackIds.indexOf(video.sid) > -1) {
        handleSelectedScreenSharing(video.sid);
      }
    }

    window.addEventListener('resize', this.updateDimensions);
  };

  componentWillUnmount = () => {
    // const { video } = this.props
    // if (video) {
    //  Removing this to fix the sharing screen problem
    //  and let react unmount handle killing the video streams
    //  if (video.stop) video.stop()
    //  const attachedElements = video.detach()
    //  attachedElements.forEach(element => element.remove())
    // }

    window.removeEventListener('resize', this.updateDimensions);
  };

  goBack = () => {
    const { selectedPage, setSelectedPage } = this.props;

    if (selectedPage !== 1) {
      setSelectedPage(selectedPage - 1);
    }
  };

  goNext = () => {
    const { selectedPage, totalPageCount, setSelectedPage } = this.props;

    if (selectedPage !== totalPageCount) {
      setSelectedPage(selectedPage + 1);
    }
  };

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
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
      video,
      isVideo,
      isMic,
      isVisible,
      count,
      profileImage,
      highlight,
      totalPageCount,
      selectedPage,
      sharingType,
      viewMode,
      isSharing,
      sharingTrackIds
    } = this.props;

    const { windowWidth, hover } = this.state;

    let xs = 0;
    let height = '';
    const initials = `${
      firstName !== ''
        ? firstName === 'You'
          ? 'You'
          : firstName.charAt(0)
        : ''
    }${lastName !== '' ? lastName.charAt(0) : ''}`;

    const isScreen = video && video.name === 'screenSharing';

    const factor = Math.ceil(Math.sqrt(count));
    xs = windowWidth > 600 ? 12 / factor : 12;
    height =
      windowWidth > 600 ? `${100 / factor}%` : `${Math.ceil(100 / count)}%`;

    const activeBorder =
      highlight && !sharingTrackIds.length
        ? { border: '4px solid #03A9F4' }
        : {};
    return (
      <Grid
        item
        xs={xs}
        onMouseOver={() => this.onMouseOver()}
        onMouseOut={() => this.onMouseOut()}
        style={{
          height,
          flexBasis: '100%'
        }}
        hidden={!isVisible}
      >
        <div className={classes.root} style={{ ...activeBorder }}>
          {totalPageCount > 1 &&
            ['speaker-view', 'side-by-side'].indexOf(viewMode) > -1 && (
              <Button
                onClick={this.goBack}
                size="small"
                className={classes.prevPage}
                classes={{
                  label: classes.labelButton
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
                <Typography variant="subtitle1" component="p">
                  {selectedPage} / {totalPageCount}
                </Typography>
              </Button>
            )}
          <div className={classes.videoWrapper}>
            {isVideo ? (
              <div
                className={cx(
                  classes.video,
                  !isSharing && sharingType === 'local' && classes.cameraVideo,
                  isSharing && classes.shareScreen,
                  isScreen && classes.screen
                )}
                ref={this.videoinput}
              />
            ) : profileImage ? (
              <div
                className={count > 1 ? classes.avatar : classes.singleAvatar}
              >
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
                    maxWidth: count > 1 ? '100%' : 350,
                    maxHeight: count > 1 ? '100%' : 250
                  }}
                />
              </div>
            ) : (
              <div
                className={count > 1 ? classes.profile : classes.singleProfile}
              >
                <Typography className={classes.initials}>{initials}</Typography>
              </div>
            )}
          </div>
          <div
            className={cx(
              !isMic
                ? classes.mic
                : hover && (firstName || lastName)
                ? classes.mic
                : classes.hidden
            )}
          >
            {!isMic && <Mute className={classes.icon} />}
            <Typography className={classes.username} variant="h6">
              {`${firstName} ${lastName}`}
            </Typography>
          </div>
          {totalPageCount > 1 &&
            ['speaker-view', 'side-by-side'].indexOf(viewMode) > -1 && (
              <Button
                onClick={this.goNext}
                size="small"
                className={classes.nextPage}
                classes={{
                  label: classes.labelButton
                }}
              >
                <ArrowForwardIosIcon
                  fontSize="small"
                  className={classes.activeColor}
                />
                <Typography variant="subtitle1" component="p">
                  {selectedPage} / {totalPageCount}
                </Typography>
              </Button>
            )}
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(VideoGridItem);
