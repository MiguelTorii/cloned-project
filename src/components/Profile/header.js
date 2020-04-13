// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import AddIcon from '@material-ui/icons/Add';
// import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import TutorBadge from 'components/TutorBadge'
import calendarIcon from '../../assets/svg/ic_calendar.svg';
import schoolIcon from '../../assets/svg/ic_school.svg';
// $FlowIgnore
import { ReactComponent as StudyCircleIcon } from '../../assets/svg/ic_studycircle.svg';

const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    // display: 'flex',
    // flexDirection: ''
    padding: theme.spacing()
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    flex: 1,
    position: 'relative'
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
  gridAvatar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  },
  gridInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  avatar: {
    // borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 170,
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
      width: 170,
      height: 170
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
  typoData: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20
  },
  upload: {
    margin: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  tabs: {
    backgroundColor: theme.circleIn.palette.appBar
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
  uploading: boolean,
  tab: number,
  inStudyCircle: boolean,
  isStudyCircleLoading: boolean,
  isCirclein: boolean,
  roleId: number,
  role: string,
  onStartChat: Function,
  onStartVideo: Function,
  onUpdateProfileImage: Function,
  onChange: Function
};

type State = {
  open: boolean
};

class Header extends React.PureComponent<Props, State> {
  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  handleOpenInputFile = () => {
    if (this.fileInput) this.fileInput.click();
  };

  handleInputChange = () => {
    const { onUpdateProfileImage } = this.props;
    if (
      this.fileInput &&
      this.fileInput.files &&
      this.fileInput.files.length > 0
    )
      onUpdateProfileImage(this.fileInput.files[0]);
  };

  renderStudyCircle = () => {
    const { inStudyCircle, isStudyCircleLoading } = this.props;
    if (isStudyCircleLoading) return <CircularProgress size={24} />;
    if (inStudyCircle) return <StudyCircleIcon />;
    return <StudyCircleIcon />;
  };

  render() {
    const {
      classes,
      isMyProfile = false,
      firstName,
      lastName,
      userProfileUrl,
      points,
      bestAnswers,
      thanks,
      school,
      state,
      joined,
      chatLoading,
      uploading,
      tab,
      // inStudyCircle,
      isCirclein,
      roleId,
      role,
      onStartChat,
      onStartVideo,
      onChange,
      // onStudyCircle
    } = this.props;

    const name = `${firstName} ${lastName}`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Grid container>
            <Grid item xs={4} className={classes.gridAvatar}>
              <div className={classes.avatar}>
                <Avatar
                  alt={initials}
                  src={userProfileUrl}
                  className={classes.bigAvatar}
                  classes={{ img: classes.img }}
                >
                  {initials}
                </Avatar>
                {uploading && (
                  <div className={classes.progress}>
                    <CircularProgress />
                  </div>
                )}
              </div>
              {isMyProfile ? (
                <Fragment>
                  <input
                    accept="image/*"
                    className={classes.input}
                    ref={fileInput => {
                      this.fileInput = fileInput;
                    }}
                    onChange={this.handleInputChange}
                    type="file"
                  />
                  <Button
                    onClick={this.handleOpenInputFile}
                    className={classes.upload}
                    disabled={uploading}
                    color="primary"
                    variant="text"
                  >
                    Upload Profile Photo
                  </Button>
                </Fragment>
              ) : null}
              {/* ( */}
              {/* <Button */}
              {/* variant="outlined" */}
              {/* color="primary" */}
              {/* className={classes.button} */}
              {/* onClick={onStudyCircle} */}
              {/* > */}
              {/* {this.renderStudyCircle()} */}
              {/* <Typography */}
              {/* variant="subtitle1" */}
              {/* className={classes.buttonText} */}
              {/* > */}
              {/* {inStudyCircle ? 'Remove from' : 'Add to'} Study Circle */}
              {/* </Typography> */}
              {/* </Button> */}
              {/* )} */}
            </Grid>
            <Grid item xs={8} sm={8} className={classes.gridInfo}>
              <Typography variant="h2" gutterBottom>
                {name} {[2,3].includes(roleId) && role && <TutorBadge text={role} />}
              </Typography>
              <Grid
                justify='space-between'
                container
              >
                <Grid item xs={12} md={4} className={classes.status}>
                  <Typography variant="h4">
                    {points.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    points
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} className={classes.status}>
                  <Typography variant="h4">
                    {thanks.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    thanks
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} className={classes.status}>
                  <Typography variant="h4">
                    {bestAnswers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    best answers
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    className={classes.typoData}
                  >
                    <img
                      src={schoolIcon}
                      alt="School"
                      className={classes.icon}
                    />
                    {`${school}, ${state}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    className={classes.typoData}
                  >
                    <img
                      src={calendarIcon}
                      alt="Calendar"
                      className={classes.icon}
                    />
                    {`Member Since ${moment(joined).format('MMMM YYYY')}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} hidden={isMyProfile || isCirclein}>
                  <Button
                    color="primary"
                    disabled={chatLoading}
                    onClick={onStartChat}
                  >
                    Send {firstName} a message
                  </Button>
                </Grid>
                <Grid item xs={12} md={12} hidden={isMyProfile || isCirclein}>
                  <Button
                    color="primary"
                    disabled={chatLoading}
                    onClick={onStartVideo}
                  >
                    Start video study session
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Tabs
          value={tab}
          textColor="primary"
          centered
          onChange={onChange}
          classes={{ root: classes.tabs }}
        >
          <Tab label="Profile" />
          <Tab label={isMyProfile ? 'My Posts' : 'Posts'} />
          {isMyProfile && <Tab label="Bookmarks" />}
        </Tabs>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
