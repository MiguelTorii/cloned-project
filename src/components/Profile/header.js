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
import OnlineBadge from 'components/OnlineBadge';
import TutorBadge from 'components/TutorBadge'
import schoolIcon from '../../assets/svg/ic_school.svg';
// $FlowIgnore
import LoadImg from '../LoadImg';
import ImgEmptyCover from 'assets/img/empty_cover.png';
import ImgLogo from 'assets/svg/app-logo.svg';
import { Hidden } from '@material-ui/core';
import { getPointsText } from '../../utils/helpers';
import GradientButton from '../Basic/Buttons/GradientButton';
import { Message, Videocam, MoreVert, Create } from '@material-ui/icons';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import IconButton from '@material-ui/core/IconButton';
import type { About } from '../../types/models';
import _ from 'lodash';

const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    // display: 'flex',
    // flexDirection: ''
    padding: theme.spacing(0, 1)
  },
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing(1, 0, 3, 0),
    backgroundColor: theme.circleIn.palette.feedBackground,
    flex: 1,
    position: 'relative'
  },
  coverContainer: {
    margin: theme.spacing(-1, -3, 0, -3),
    height: 115,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(-1, -3, 0, -3)
    },
    [theme.breakpoints.only('sm')]: {
      margin: theme.spacing(-1, -3, 0, -3),
      height: 90
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(-1, -2, 0, -2),
      height: 70
    }
  },
  actionContainer: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  cover: {
    width: '100%',
    minHeight: '100%'
  },
  helpButton: {
    margin: theme.spacing(2),
    width: 20,
    height: 20,
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    right: 0
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1
  },
  logoIcon: {
    width: 15,
    height: 15,
    marginRight: theme.spacing(1),
    verticalAlign: 'middle'
  },
  penIcon: {
    backgroundColor: 'rgba(36, 37, 38, 0.6)',
    width: 32,
    height: 32,
    margin: theme.spacing(1)
  },
  gridInfo: {
    margin: theme.spacing(2, 0, 5, 20)
  },
  schoolGrid: {
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start'
    }
  },
  avatarContainer: {
    position: 'absolute',
    left: theme.spacing(3),
    top: 53,
    [theme.breakpoints.down('sm')]: {
      top: 5
    }
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 124,
    height: 124,
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 170,
    borderRadius: '50%',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  bigAvatar: {
    width: 90,
    height: 90,
    [theme.breakpoints.up('sm')]: {
      width: 124,
      height: 124
    },
    fontSize: theme.typography.h1.fontSize,
    margin: theme.spacing(2)
  },
  img: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing(2)
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2)
  },
  statusLabel: {
    marginLeft: theme.spacing(1/2),
    marginRight: theme.spacing(2)
  },
  icon: {
    width: 20,
    height: 20,
    margin: theme.spacing(0, 1),
    verticalAlign: 'middle'
  },
  uploadButton: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    width: 32,
    height: 32,
    minWidth: 32,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: '100%',
    [theme.breakpoints.down('sm')]: {
      right: 15,
      bottom: 15
    }
  },
  upload: {
    margin: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  tabs: {
    marginTop: theme.spacing(6),
    borderRadius: '10px 10px 0 0',
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderBottom: `solid 1px ${theme.circleIn.palette.modalBackground}`,
    '& .MuiTab-wrapper': {
      textTransform: 'none',
      fontSize: 20,
      color: theme.circleIn.palette.primaryText1,
      opacity: 0.6,
    },
    '& .Mui-selected': {
      borderBottom: `4px solid ${theme.circleIn.palette.darkActionBlue}`,
      '& .MuiTab-wrapper': {
        opacity: 1
      }
    }
  },
  buttonText: {
    marginLeft: theme.spacing()
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  contentIcon: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(2),
    height: 40
  }
});

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
  onStartChat: Function,
  onStartVideo: Function,
  onChange: Function,
  onEditProfile: Function,
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
  }

  renderNumbers = () => {
    const { points, bestAnswers, thanks } = this.props;

    return (
      <Grid container spacing={3}>
        <Grid item>
          <Typography variant="body1">
            { getPointsText(points) } Points
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {bestAnswers.toLocaleString()} Best Answers
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {thanks.toLocaleString()} Thanks
          </Typography>
        </Grid>
      </Grid>
    );
  };

  findAboutField = (id) => {
    const { about } = this.props;
    const idx = _.findIndex(about, (item) => item.id === id);

    if (idx < 0) return null;

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
      onStartChat,
      onStartVideo,
      onChange,
      onEditProfile
      // onStudyCircle
    } = this.props;

    const { videoEnabled } = this.state;
    const name = `${firstName} ${lastName}`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

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
              isMyProfile ?
                <IconButton
                  classes={{root: classes.penIcon}}
                  onClick={onEditProfile}
                >
                  <Create />
                </IconButton> :
                <IconButton>
                  <MoreVert />
                </IconButton>
            }
          </div>
          <div className={classes.avatarContainer}>
            <div className={classes.avatar}>
              <OnlineBadge isOnline={isOnline} bgColorPath="circleIn.palette.feedBackground" fromChat={false}>
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
            <Grid
              container
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
            >
              <Hidden smDown>
                <Grid item xs={12} md={8}>
                  {this.renderNumbers()}
                </Grid>
              </Hidden>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" align="right">
                  <img
                    src={ImgLogo}
                    className={classes.logoIcon}
                    alt="Logo"
                  />
                  {`Joined ${moment(joined).format('MMMM YYYY')}`}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid
                container
                direction="column"
              >
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    {name} {role && <TutorBadge text={role} />}
                  </Typography>
                </Grid>
                <Hidden mdUp>
                  <Grid item xs={12}>
                    {this.renderNumbers()}
                  </Grid>
                </Hidden>
                {
                  bio &&
                    <Grid item xs={12}>
                      <Typography>
                        { bio }
                      </Typography>
                    </Grid>
                }
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                container
                direction="column"
                className={classes.schoolGrid}
              >
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    className={classes.typoData}
                  >
                    <Hidden smDown>
                      <img
                        src={schoolIcon}
                        alt="School"
                        className={classes.icon}
                      />
                    </Hidden>
                    {`${school}, ${state}`}
                    <Hidden mdUp>
                      <img
                        src={schoolIcon}
                        alt="School"
                        className={classes.icon}
                      />
                    </Hidden>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    { major }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item hidden={isMyProfile || isCirclein}>
                  <GradientButton
                    startIcon={<Message/>}
                    disabled={chatLoading}
                    onClick={onStartChat}
                  >
                    message
                  </GradientButton>
                </Grid>
                <Grid item hidden={isMyProfile || isCirclein || !videoEnabled}>
                  <TransparentButton
                    startIcon={<Videocam/>}
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
        <Tabs
          value={tab}
          textColor="primary"
          onChange={onChange}
          variant="fullWidth"
          classes={{ root: classes.tabs }}
        >
          {/*<Tab label="Profile" />*/}
          <Tab label={isMyProfile ? 'My Posts' : 'Posts'} />
          {isMyProfile && <Tab label="Bookmarks" />}
        </Tabs>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
