// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { getInitials } from 'utils/chat';
import Dialog from '../Dialog/Dialog';
import type { StudyCircle } from '../../types/models';
import { styles } from '../_styles/StudyCircleDialog';

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
    const initials = getInitials(ownName);
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
                    transform: `rotate(${
                      270 + index * degreeAngle
                    }deg) translate(120px) rotate(${-(
                      270 +
                      index * degreeAngle
                    )}deg)`
                  }}
                >
                  <Avatar
                    className={classes.avatarSmall}
                    src={item.profileImageUrl}
                  >
                    {getInitials(`${item.firstName} ${item.lastName}`)}
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
