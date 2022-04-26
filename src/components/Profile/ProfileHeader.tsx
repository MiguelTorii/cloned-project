import React from 'react';

import moment from 'moment';

import { Hidden } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { Message, Videocam, Create } from '@material-ui/icons';

import { getPointsText } from 'utils/helpers';

import ImgEmptyCover from 'assets/img/empty_cover.png';
import ImgLogo from 'assets/svg/app-logo.svg';
import schoolIcon from 'assets/svg/ic_school.svg';
import Avatar from 'components/Avatar';
import RefereeListCard from 'components/RefereeListCard';

import { styles } from '../_styles/Profile/header';
import GradientButton from '../Basic/Buttons/GradientButton';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import LoadImg from '../LoadImg/LoadImg';
import RoleBadge from '../RoleBadge/RoleBadge';

import PointsHistoryCard from './PointsHistoryCard';

import type { About, UserProfile } from 'types/models';

type Props = {
  classes?: Record<string, any>;
  isMyProfile?: boolean;
  firstName?: string;
  lastName?: string;
  userProfileUrl?: string;
  points?: number;
  bestAnswers?: number;
  thanks?: number;
  school?: string;
  state?: string;
  segment?: string;
  grade?: number;
  joined?: string;
  chatLoading?: boolean;
  tab?: number;
  inStudyCircle?: boolean;
  isStudyCircleLoading?: boolean;
  isCirclein?: boolean;
  isOnline?: boolean;
  roleId?: number;
  role?: string;
  profile?: UserProfile;
  onStartChat?: (...args: Array<any>) => any;
  onStartVideo?: (...args: Array<any>) => any;
  onChange?: (...args: Array<any>) => any;
  onEditProfile?: (...args: Array<any>) => any;
  onSeePointsHistoryDetails?: (...args: Array<any>) => any;
  about?: Array<About>;
  onStudyCircle?: any;
};

type State = {
  open: boolean;
};

class ProfileHeader extends React.PureComponent<Props, State> {
  // eslint-disable-next-line no-undef
  fileInput: HTMLInputElement | null | undefined;

  state = {
    // eslint-disable-next-line react/no-unused-state
    open: false
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

  renderPointsHistory = () => {
    const { profile, onSeePointsHistoryDetails } = this.props;
    return (
      <Box mt={5}>
        <PointsHistoryCard profile={profile} onSeeMore={onSeePointsHistoryDetails} />
      </Box>
    );
  };

  findAboutField = (id) => {
    const { about } = this.props;

    const idx = about?.findIndex((item) => item.id === id);

    if (!about || !idx || idx < 0) {
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
      isCirclein,
      isOnline,
      role,
      profile,
      onStartChat,
      onStartVideo,
      onChange,
      onEditProfile,
      onSeePointsHistoryDetails
    } = this.props;
    const name = `${firstName} ${lastName}`;
    const bio = this.findAboutField(6);
    const major = this.findAboutField(4);
    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.coverContainer}>
            <LoadImg url={ImgEmptyCover} className={classes.cover} />
          </div>
          <div className={classes.actionContainer}>
            {isMyProfile ? (
              <IconButton
                classes={{
                  root: classes.penIcon
                }}
                onClick={onEditProfile}
              >
                <Create />
              </IconButton>
            ) : (
              <div />
            )}
          </div>
          <div className={classes.avatarContainer}>
            <Avatar
              profileImage={userProfileUrl}
              fullName={name}
              hasOnlineBadge
              isOnline={isOnline}
              onlineBadgeBackground="circleIn.palette.feedBackground"
              desktopSize={124}
              mobileSize={124}
              largeImage
            />
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
                <Grid item hidden={isMyProfile || isCirclein}>
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
        {this.renderPointsHistory()}
        {isMyProfile && <RefereeListCard />}
        <Tabs
          value={tab}
          textColor="primary"
          onChange={onChange}
          variant="fullWidth"
          classes={{
            root: classes.tabs
          }}
        >
          <Tab label={isMyProfile ? 'My Posts' : 'Posts'} value={1} />
          {isMyProfile && <Tab label="Bookmarks" value={2} />}
        </Tabs>
      </div>
    );
  }
}

export default withStyles(styles as any)(ProfileHeader);
