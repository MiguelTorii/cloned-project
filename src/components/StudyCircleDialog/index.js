// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Dialog from '../Dialog';
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
    margin: theme.spacing(2)
  },
  circleContainer: {
    position: 'relative',
    width: 240,
    height: 240,
    padding: theme.spacing(),
    margin: theme.spacing(4),
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
        ariaDescribedBy="study-circle-description"
        onCancel={onClose}
        open={open}
        title="Congratulations"
      >
        <div className={classes.content}>
          <Typography
            align="center"
            id="study-circle-description"
            color="textPrimary"
          >
            You added <strong>{name}</strong> to your Study Circle
          </Typography>
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
          <Typography align="center" color="textPrimary">
            You will be notified when <strong>{name}</strong> publishes new
            content
          </Typography>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(StudyCircleDialog);
