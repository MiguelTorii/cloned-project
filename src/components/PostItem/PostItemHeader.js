// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Markdown from './Markdown';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

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
  },
  markdown: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
});

type Props = {
  classes: Object,
  userId: string,
  name: string,
  userProfileUrl: string,
  classroomName: string,
  created: string,
  title: string,
  body: string,
  isMarkdown?: boolean
};

class PostItemHeader extends React.PureComponent<Props> {
  static defaultProps = {
    isMarkdown: false
  };

  render() {
    const {
      classes,
      userId,
      name,
      userProfileUrl,
      classroomName,
      created,
      title,
      body,
      isMarkdown
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
              <Link
                component={MyLink}
                href={`/profile/${userId}`}
                className={classes.link}
              >
                {name}
              </Link>
            </Typography>
            <Typography component="p" variant="subtitle1" noWrap>
              {classroomName}
            </Typography>
            <Typography component="p" variant="subtitle1" noWrap>
              {fromNow}
            </Typography>
          </div>
        </div>
        <Typography component="p" variant="h4" paragraph>
          {title}
        </Typography>
        {!isMarkdown ? (
          <Typography component="p" variant="h6">
            {body}
          </Typography>
        ) : (
          <div className={classes.markdown}>
            <Markdown>{body}</Markdown>
          </div>
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemHeader);
