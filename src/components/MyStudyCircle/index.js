// @flow
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { StudyCircle } from '../../types/models';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  empty: {
    maxWidth: 400,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  list: {
    width: '100%'
  },
  margin: {
    margin: theme.spacing.unit
  },
  avatarLink: {
    textDecoration: 'none'
  }
});

type Props = {
  classes: Object,
  circle: StudyCircle,
  isLoading: boolean,
  onRemove: Function,
  onStartChat: Function
};

class MyStudyCircle extends React.PureComponent<Props> {
  handleRemove = userId => () => {
    const { onRemove } = this.props;
    onRemove(userId);
  };

  handleStartChat = ({ userId, firstName, lastName }) => () => {
    const { onStartChat } = this.props;
    onStartChat({ userId, firstName, lastName });
  };

  getInitials = name =>
    name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

  renderContent = () => {
    const { classes, isLoading, circle } = this.props;

    if (isLoading) return <CircularProgress />;

    if (circle.length === 0)
      return (
        <div className={classes.empty}>
          <Typography variant="h6" paragraph align="center">
            You haven’t added anyone to your study circle yet! Check back here
            once you’ve added students.
          </Typography>
          <Button
            component={MyLink}
            href="/feed"
            variant="outlined"
            color="primary"
          >
            Go to Feed
          </Button>
        </div>
      );

    return (
      <List dense className={classes.list}>
        {circle.map(item => (
          <ListItem key={item.userId}>
            <ListItemAvatar
              className={classes.avatarLink}
              component={MyLink}
              href={`/profile/${item.userId}`}
            >
              <Avatar alt={item.firstName} src={item.profileImageUrl}>
                {this.getInitials(`${item.firstName} ${item.lastName}`)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Typography>
                  <Link component={MyLink} href={`/profile/${item.userId}`}>{`${
                    item.firstName
                  } ${item.lastName}`}</Link>
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.margin}
                onClick={this.handleStartChat({
                  userId: item.userId,
                  firstName: item.firstName,
                  lastName: item.lastName
                })}
              >
                Message
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                className={classes.margin}
                onClick={this.handleRemove(item.userId)}
              >
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Typography variant="h5" paragraph>
            Study Circle
          </Typography>
          <div className={classes.circle}>{this.renderContent()}</div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(MyStudyCircle);