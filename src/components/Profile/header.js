// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { gradeName } from '../../constants/common';

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
    width: 170,
    height: 170,
    fontSize: theme.typography.h1.fontSize,
    margin: theme.spacing.unit * 2
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
    marginRight: theme.spacing.unit * 2
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
  joined: string
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
      joined
    } = this.props;

    const name = `${firstName} ${lastName}`;
    const initials = name !== '' ? name.match(/\b(\w)/g).join('') : '';

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Grid container>
            <Grid item xs={5} className={classes.gridAvatar}>
              <Avatar
                alt="Camilo R"
                src={userProfileUrl}
                className={classes.bigAvatar}
              >
                {initials}
              </Avatar>
              {!isMyProfile ? (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  add to my study circle
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  edit profile
                </Button>
              )}
            </Grid>
            <Grid item xs={7} className={classes.gridInfo}>
              <Typography variant="h2" gutterBottom>
                {name}
              </Typography>
              <div className={classes.status}>
                <Typography variant="h4">{points}</Typography>
                <Typography variant="body2" className={classes.statusLabel}>
                  points
                </Typography>
                <Typography variant="h4">60</Typography>
                <Typography variant="body2" className={classes.statusLabel}>
                  thanks
                </Typography>
                <Typography variant="h4">10</Typography>
                <Typography variant="body2" className={classes.statusLabel}>
                  best answers
                </Typography>
              </div>
              <Typography variant="body2" gutterBottom>
                {`${school}, ${state}`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {gradeName(segment, grade)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {`Member Since ${moment(joined).format('MMMM YYYY')}`}
              </Typography>
              {!isMyProfile && (
                <Fragment>
                  <Button variant="text" color="primary">
                    Send Luke a message
                  </Button>
                  <Button variant="text" color="primary">
                    Start video study session
                  </Button>
                </Fragment>
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
