// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '../DialogTitle';
import type { StudyCircle } from '../../types/models';

const styles = theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  },
  circleContainer: {
    position: 'relative',
    width: 240,
    height: 240,
    padding: theme.spacing.unit,
    margin: theme.spacing.unit * 4,
    border: 'solid 4px',
    borderColor: theme.palette.primary.main,
    borderRadius: '50%'
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    margin: -20
  },
  avatarBig: {
    height: 80,
    width: 80
  },
  avatarSmall: {
    height: 40,
    width: 40
  }
});

type Props = {
  classes: Object,
  open: boolean,
  name: string,
  userProfileUrl: string,
  loading: boolean,
  circle: StudyCircle,
  ownName: string,
  onClose: Function
};

type State = {};

class StudyCircleDialog extends React.PureComponent<Props, State> {
  getInitials = name =>
    name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

  render() {
    const {
      classes,
      open,
      name,
      userProfileUrl,
      loading,
      circle,
      ownName,
      onClose
    } = this.props;
    const initials = this.getInitials(ownName);
    const degreeAngle = circle.length === 0 ? 0 : 360 / circle.length;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="study-circle-title"
        aria-describedby="study-circle-description"
      >
        <DialogTitle id="study-circle-title" onClose={onClose}>
          Congratulations
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText
            align="center"
            id="study-circle-description"
            color="textPrimary"
          >
            You added <strong>{name}</strong> to your Study Circle
          </DialogContentText>
          {loading && (
            <div className={classes.progress}>
              <CircularProgress />
            </div>
          )}
          {!loading && (
            <div className={classes.circleContainer}>
              <div className={classes.main}>
                <Avatar src={userProfileUrl} className={classes.avatarBig}>
                  {initials}
                </Avatar>
              </div>
              {circle.map((item, index) => (
                <div
                  key={item.userId}
                  className={classes.circle}
                  style={{
                    transform: `rotate(${270 +
                      index * degreeAngle}deg) translate(120px) rotate(${-(
                      270 +
                      index * degreeAngle
                    )}deg)`
                  }}
                >
                  <Avatar
                    className={classes.avatarSmall}
                    src={item.profileImageUrl}
                  >
                    {this.getInitials(`${item.firstName} ${item.lastName}`)}
                  </Avatar>
                </div>
              ))}
            </div>
          )}
          <DialogContentText align="center" color="textPrimary">
            You will be notified when <strong>{name}</strong> publishes new
            content
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(StudyCircleDialog);
