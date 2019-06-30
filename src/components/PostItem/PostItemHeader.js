// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ReportIcon from '@material-ui/icons/Report';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
    flex: 1,
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
  currentUserId: string,
  userId: string,
  name: string,
  userProfileUrl: string,
  classroomName: string,
  created: string,
  title: string,
  body: string,
  isMarkdown?: boolean,
  bookmarked: boolean,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function
};

type State = {
  moreAnchorEl: ?string
};

class PostItemHeader extends React.PureComponent<Props, State> {
  static defaultProps = {
    isMarkdown: false
  };

  state = {
    moreAnchorEl: null
  };

  handleMenuOpen = event => {
    this.setState({ moreAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ moreAnchorEl: null });
  };

  handleReport = () => {
    const { onReport } = this.props;
    this.handleMenuClose();
    onReport();
  };

  handleDelete = () => {
    const { onDelete } = this.props;
    this.handleMenuClose();
    onDelete();
  };

  render() {
    const {
      classes,
      currentUserId,
      userId,
      name,
      userProfileUrl,
      classroomName,
      created,
      title,
      body,
      isMarkdown,
      bookmarked,
      onBookmark
    } = this.props;
    const { moreAnchorEl } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    const date = moment(created);
    const fromNow = date ? date.fromNow() : '';

    const renderMenu = (
      <Menu
        disableAutoFocusItem
        anchorEl={moreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={onBookmark}>
          <ListItemIcon color="inherit">
            {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </ListItemIcon>
          <ListItemText inset primary="Bookmark" />
        </MenuItem>
        {userId !== currentUserId ? (
          <MenuItem onClick={this.handleReport}>
            <ListItemIcon color="inherit">
              <ReportIcon />
            </ListItemIcon>
            <ListItemText inset primary="Report" />
          </MenuItem>
        ) : (
          <MenuItem onClick={this.handleDelete}>
            <ListItemIcon color="inherit">
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        )}
      </Menu>
    );

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
          <IconButton onClick={this.handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
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
        {renderMenu}
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemHeader);
