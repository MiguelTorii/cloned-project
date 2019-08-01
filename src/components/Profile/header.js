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
import { gradeName } from '../../constants/common';
import calendarIcon from '../../assets/svg/ic_calendar.svg';
import gradCapIcon from '../../assets/svg/ic_grad_cap.svg';
import schoolIcon from '../../assets/svg/ic_school.svg';

const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    // display: 'flex',
    // flexDirection: ''
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    flex: 1
  },
  gridAvatar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  gridInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2
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
    margin: theme.spacing.unit * 2
  },
  img: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing.unit * 2
  },
  statusLabel: {
    marginLeft: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit * 2
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
    margin: theme.spacing.unit * 2
  },
  input: {
    display: 'none'
  },
  tabs: {
    backgroundColor: theme.circleIn.palette.appBar
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
  onStartChat: Function,
  onStartVideo: Function,
  onUpdateProfileImage: Function,
  onChange: Function
};

class Header extends React.PureComponent<Props> {
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

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

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
      onStartChat,
      onStartVideo,
      onChange
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
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  Add to Study Circle
                </Button>
              )}
            </Grid>
            <Grid item xs={8} sm={6} className={classes.gridInfo}>
              <Typography variant="h2" gutterBottom>
                {name}
              </Typography>
              <Grid container>
                <Grid item xs={12} md={4} className={classes.status}>
                  <Typography variant="h4">
                    {points.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    points
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} className={classes.status}>
                  <Typography variant="h4">
                    {thanks.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    thanks
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} className={classes.status}>
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
                <Grid item xs={12} md={12} hidden={isMyProfile}>
                  <Button
                    color="primary"
                    disabled={chatLoading}
                    onClick={onStartChat}
                  >
                    Send {firstName} a message
                  </Button>
                </Grid>
                <Grid item xs={12} md={12} hidden={isMyProfile}>
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
          onChange={onChange}
          classes={{ root: classes.tabs }}
        >
          <Tab label="Profile" />
          <Tab label="Posts" />
        </Tabs>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
