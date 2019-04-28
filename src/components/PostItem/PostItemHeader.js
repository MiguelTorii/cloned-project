// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 100,
    padding: theme.spacing.unit
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  name: string,
  userProfileUrl: string,
  classroomName: string,
  created: string,
  title: string,
  body: string
};

class PostItemHeader extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      name,
      userProfileUrl,
      classroomName,
      created,
      title,
      body
    } = this.props;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    const date = moment(created);
    const fromNow = date ? date.fromNow() : '';
    return (
      <Fragment>
        <div className={classes.root}>
          <Avatar src={userProfileUrl} className={classes.bigAvatar}>
            {initials}
          </Avatar>
          <div className={classes.userInfo}>
            <Typography component="p" variant="h6" noWrap>
              {name}
            </Typography>
            <Typography component="p" variant="subtitle1" noWrap>
              {classroomName}
            </Typography>
            <Typography component="p" variant="subtitle1" noWrap>
              {fromNow}
            </Typography>
          </div>
        </div>
        <Typography component="p" variant="h5" noWrap>
          {title}
        </Typography>
        <Typography component="p" variant="body1" noWrap>
          {body}
        </Typography>
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemHeader);
