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
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import AddIcon from '@material-ui/icons/Add';
// import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { gradeName } from '../../constants/common';
import calendarIcon from '../../assets/svg/ic_calendar.svg';
import gradCapIcon from '../../assets/svg/ic_grad_cap.svg';
import schoolIcon from '../../assets/svg/ic_school.svg';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';
// $FlowIgnore
import { ReactComponent as StudyCircleIcon } from '../../assets/svg/ic_studycircle.svg';
import { ReactComponent as TutorBadgeIcon } from '../../assets/svg/ic_tutor_badge.svg';

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
  onStartChat: Function,
  onStartVideo: Function,
  onUpdateProfileImage: Function,
  onChange: Function,
  onStudyCircle: Function
};

type State = {
  open: boolean
};

class Header extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

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

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

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
      segment = '',
      grade,
      joined,
      chatLoading,
      uploading,
      tab,
      inStudyCircle,
      isCirclein,
      roleId,
      onStartChat,
      onStartVideo,
      onChange,
      onStudyCircle
    } = this.props;
    
    const { open } = this.state;

    const name = `${firstName} ${lastName}`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <ButtonBase className={classes.helpButton} onClick={this.handleOpen}>
            <Avatar className={classes.helpIcon}>?</Avatar>
          </ButtonBase>
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
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={onStudyCircle}
                >
                  {this.renderStudyCircle()}
                  <Typography
                    variant="subtitle1"
                    className={classes.buttonText}
                  >
                    {inStudyCircle ? 'Remove from' : 'Add to'} Study Circle
                  </Typography>
                </Button>
              )}
            </Grid>
            <Grid item xs={8} sm={8} className={classes.gridInfo}>
              <Typography variant="h2" gutterBottom>
                {name} {roleId === 2 && <TutorBadgeIcon />}
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
                      src={gradCapIcon}
                      alt="Grad Cap"
                      className={classes.icon}
                    />
                    {gradeName(segment, grade)}
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
          <Tab label={isMyProfile ? 'My Stuff' : 'Posts'} />
          {isMyProfile && <Tab label="Bookmarks" />}
        </Tabs>
        <Dialog
          open={open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="md"
          aria-labelledby="ranks-info-title"
          aria-describedby="ranks-info-description"
        >
          <DialogContent>
            <DialogContentText
              id="ranks-points-description"
              variant="h3"
              paragraph
              color="textPrimary"
            >
              What do ranks mean?
            </DialogContentText>
            <DialogContentText color="textPrimary" paragraph>
              Ranks are a quick and easy way to see how active classmates are on
              CircleIn. Check the breakdown below to learn what each rank means
              and the perks of achieving each rank!
            </DialogContentText>
            <div className={classes.content}>
              <img src={bronze} alt="Bronze" className={classes.contentIcon} />
              <div>
                <DialogContentText color="textPrimary" variant="h5">
                  Bronze
                </DialogContentText>
                <DialogContentText color="textPrimary">
                  0 - 248,000 Points
                </DialogContentText>
              </div>
            </div>
            <div className={classes.content}>
              <img src={silver} alt="Silver" className={classes.contentIcon} />
              <div>
                <DialogContentText color="textPrimary" variant="h5">
                  Silver
                </DialogContentText>
                <DialogContentText color="textPrimary">
                  248,001 - 630,000 Points
                </DialogContentText>
              </div>
            </div>
            <div className={classes.content}>
              <img src={gold} alt="Gold" className={classes.contentIcon} />
              <div>
                <DialogContentText color="textPrimary" variant="h5">
                  Gold
                </DialogContentText>
                <DialogContentText color="textPrimary">
                  630,001 - 1,630,000 Points
                </DialogContentText>
              </div>
            </div>
            <div className={classes.content}>
              <img
                src={platinum}
                alt="Platinum"
                className={classes.contentIcon}
              />
              <div>
                <DialogContentText color="textPrimary" variant="h5">
                  Platinum
                </DialogContentText>
                <DialogContentText color="textPrimary">
                  1,630,001 - 4,130,000 Points
                </DialogContentText>
              </div>
            </div>
            <div className={classes.content}>
              <img
                src={diamond}
                alt="Diamond"
                className={classes.contentIcon}
              />
              <div>
                <DialogContentText color="textPrimary" variant="h5">
                  Diamond
                </DialogContentText>
                <DialogContentText color="textPrimary">
                  4,130,001 - 6,830,000 Points
                </DialogContentText>
              </div>
            </div>
            <div className={classes.content}>
              <img src={master} alt="Master" className={classes.contentIcon} />
              <div>
                <DialogContentText color="textPrimary" variant="h5">
                  Master
                </DialogContentText>
                <DialogContentText color="textPrimary">
                  6,830,000+ Points
                </DialogContentText>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
