// @flow
import React from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import AddIcon from '@material-ui/icons/Add';
// import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { getCampaign } from 'api/campaign';
import OnlineBadge from 'components/OnlineBadge/OnlineBadge';
import RoleBadge from 'components/RoleBadge/RoleBadge';
import ImgEmptyCover from 'assets/img/empty_cover.png';
import ImgLogo from 'assets/svg/app-logo.svg';
import { Hidden } from '@material-ui/core';
import { Message, Videocam, Create } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import _ from 'lodash';
import Box from '@material-ui/core/Box';
import { getInitials } from 'utils/chat';
import schoolIcon from '../../assets/svg/ic_school.svg';
// $FlowIgnore
import LoadImg from '../LoadImg/LoadImg';
import { getPointsText } from '../../utils/helpers';
import GradientButton from '../Basic/Buttons/GradientButton';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import type { About, UserProfile } from '../../types/models';
import PointsHistoryCard from './PointsHistoryCard';
import { styles } from '../_styles/Profile/header';

type Props = {
  classes: Object,
  isMyProfile: Boolean,
  firstName: string,
  lastName: string,
  userProfileUrl: string,
  points: number,
  bestAnswers: number,
  thanks: number,
  school: string,
  state: string,
  segment: string,
  grade: number,
  joined: string,
  chatLoading: boolean,
  tab: number,
  inStudyCircle: boolean,
  isStudyCircleLoading: boolean,
  isCirclein: boolean,
  roleId: number,
  role: string,
  profile: UserProfile,
  onStartChat: Function,
  onStartVideo: Function,
  onChange: Function,
  onEditProfile: Function,
  onSeePointsHistoryDetails: Function,
  about: Array<About>
};

type State = {
  open: boolean,
  videoEnabled: boolean
};

class Header extends React.PureComponent<Props, State> {
  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  state = {
    videoEnabled: null
  };

  componentWillMount = async () => {
    const campaign = await getCampaign({ campaignId: 9 });
    this.setState({
      videoEnabled: campaign.variation_key && campaign.variation_key !== 'hidden'
    });
  };

  renderNumbers = () => {
    const { points, bestAnswers, thanks } = this.props;

    return (
      <Grid container spacing={3}>
        <Grid item>
          <Typography variant="body1">{getPointsText(points)} Points</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{bestAnswers.toLocaleString()} Best Answers</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{thanks.toLocaleString()} Thanks</Typography>
        </Grid>
      </Grid>
    );
  };

  findAboutField = (id) => {
    const { about } = this.props;
    const idx = _.findIndex(about, (item) => item.id === id);

    if (idx < 0) {
      return null;
    }

    return about[idx].answer;
  };

  render() {
    const {
      classes,
      isMyProfile = false,
      firstName,
      lastName,
      userProfileUrl,
      school,
      state,
      joined,
      chatLoading,
      tab,
      // inStudyCircle,
      isCirclein,
      isOnline,
      role,
      profile,
      onStartChat,
      onStartVideo,
      onChange,
      onEditProfile,
      onSeePointsHistoryDetails
      // onStudyCircle
    } = this.props;

    const { videoEnabled } = this.state;
    const name = `${firstName} ${lastName}`;
    const initials = getInitials(name);

    const bio = this.findAboutField(6);
    const major = this.findAboutField(4);

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.coverContainer}>
            <LoadImg url={ImgEmptyCover} className={classes.cover} />
          </div>
          <div className={classes.actionContainer}>
            {
              isMyProfile ? (
                <IconButton classes={{ root: classes.penIcon }} onClick={onEditProfile}>
                  <Create />
                </IconButton>
              ) : (
                <div />
              )
              // <IconButton>
              //   <MoreVert />
              // </IconButton>
            }
          </div>
          <div className={classes.avatarContainer}>
            <div className={classes.avatar}>
              <OnlineBadge
                isOnline={isOnline}
                bgColorPath="circleIn.palette.feedBackground"
                fromChat={false}
              >
                <Avatar
                  alt={initials}
                  src={userProfileUrl}
                  className={classes.bigAvatar}
                  classes={{ img: classes.img }}
                >
                  {initials}
                </Avatar>
              </OnlineBadge>
            </div>
          </div>
          <div className={classes.gridInfo}>
            <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
              <Hidden smDown>
                <Grid item xs={12} md={8}>
                  {this.renderNumbers()}
                </Grid>
              </Hidden>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" align="right">
                  <img src={ImgLogo} className={classes.logoIcon} alt="Logo" />
                  {`Joined ${moment(joined).format('MMMM YYYY')}`}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container direction="column">
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="h5" gutterBottom className={classes.name}>
                    {name}
                  </Typography>
                  {role && <RoleBadge text={role} />}
                </Box>
                <Hidden mdUp>
                  <Grid item xs={12}>
                    {this.renderNumbers()}
                  </Grid>
                </Hidden>
                {bio && (
                  <Grid item xs={12}>
                    <Typography>{bio}</Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container direction="column" className={classes.schoolGrid}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className={classes.typoData}>
                    <Hidden smDown>
                      <img src={schoolIcon} alt="School" className={classes.icon} />
                    </Hidden>
                    {`${school}, ${state}`}
                    <Hidden mdUp>
                      <img src={schoolIcon} alt="School" className={classes.icon} />
                    </Hidden>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{major}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item hidden={isMyProfile || isCirclein}>
                  <GradientButton
                    startIcon={<Message />}
                    disabled={chatLoading}
                    onClick={onStartChat}
                  >
                    message
                  </GradientButton>
                </Grid>
                <Grid item hidden={isMyProfile || isCirclein || !videoEnabled}>
                  <TransparentButton
                    startIcon={<Videocam />}
                    disabled={chatLoading}
                    onClick={onStartVideo}
                  >
                    Study Room
                  </TransparentButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Hidden lgUp>
          <Box mt={5}>
            <PointsHistoryCard profile={profile} onSeeMore={onSeePointsHistoryDetails} />
          </Box>
        </Hidden>
        <Tabs
          value={tab}
          textColor="primary"
          onChange={onChange}
          variant="fullWidth"
          classes={{ root: classes.tabs }}
        >
          {/* <Tab label="Profile" /> */}
          <Tab label={isMyProfile ? 'My Posts' : 'Posts'} value={1} />
          {isMyProfile && <Tab label="Bookmarks" value={2} />}
        </Tabs>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
