// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { gradeName } from '../../constants/common';
import calendarIcon from '../../assets/svg/ic_calendar.svg';
import gradCapIcon from '../../assets/svg/ic_grad_cap.svg';
import schoolIcon from '../../assets/svg/ic_school.svg';

const MyLink = props => <RouterLink to="/feed?bookmarks=true" {...props} />;

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
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
    justifyContent: 'center'
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
  bookmarks: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2
  },
  bookmarkIcon: {
    marginLeft: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  isMyProfile: Boolean,
  firstName: string,
  lastName: string,
  userProfileUrl: string,
  points: number,
  school: string,
  state: string,
  segment: string,
  grade: number,
  joined: string,
  onOpenEdit: Function,
  onStartChat: Function,
  onStartVideo: Function
};

class Header extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      isMyProfile = false,
      firstName,
      lastName,
      userProfileUrl,
      points,
      school,
      state,
      segment = '',
      grade,
      joined,
      onOpenEdit,
      onStartChat,
      onStartVideo
    } = this.props;

    const name = `${firstName} ${lastName}`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Grid container>
            <Grid item xs={4} className={classes.gridAvatar}>
              <Avatar
                alt={initials}
                src={userProfileUrl}
                className={classes.bigAvatar}
                classes={{ img: classes.img }}
              >
                {initials}
              </Avatar>
              {!isMyProfile ? (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  Add to Study Circle
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={onOpenEdit}
                >
                  Edit Profile
                </Button>
              )}
            </Grid>
            <Grid item xs={8} className={classes.gridInfo}>
              <Typography variant="h2" gutterBottom>
                {name}
              </Typography>
              <Grid container>
                <Grid item xs={12} md={4} className={classes.status}>
                  <Typography variant="h4">{points}</Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    points
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} className={classes.status}>
                  <Typography variant="h4">60</Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    thanks
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} className={classes.status}>
                  <Typography variant="h4">10</Typography>
                  <Typography variant="body2" className={classes.statusLabel}>
                    best answers
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
              </Grid>
              {!isMyProfile ? (
                <Fragment>
                  <Button variant="text" color="primary" onClick={onStartChat}>
                    Send Luke a message
                  </Button>
                  <Button variant="text" color="primary" onClick={onStartVideo}>
                    Start video study session
                  </Button>
                </Fragment>
              ) : (
                <div className={classes.bookmarks}>
                  <Button variant="outlined" color="primary" component={MyLink}>
                    View my bookmarks
                    <BookmarkIcon className={classes.bookmarkIcon} />
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
