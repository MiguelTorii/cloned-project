// @flow
import React, { Fragment } from 'react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import Grid from '@material-ui/core/Grid';
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
import CreateIcon from '@material-ui/icons/Create';
import queryString from 'query-string';
import TutorBadge from 'components/TutorBadge'
import Markdown from './Markdown';
import Tooltip from '../../containers/Tooltip';

const MyLink = React.forwardRef(({ href, ...props }, ref) => <RouterLink to={href} {...props} ref={ref} />);

const styles = theme => ({
  feedTypo: {
    fontSize: 24
  },
  backButton: {
    cursor: 'pointer'
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 100,
    padding: theme.spacing()
  },
  body: {
    wordBreak: 'break-word'
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: '50%'
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
    marginLeft: theme.spacing(2)
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
  roleId: number,
  role: string,
  onBookmark: Function,
  newClassExperience: boolean,
  onReport: Function,
  postId: number,
  typeId: number,
  pushTo: Function,
  pop: Function,
  router: Object,
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

  handleEdit = () => {
    const {
      postId,
      typeId,
      pushTo
    } = this.props;
    this.handleMenuClose();
    if (typeId === 3) pushTo(`/edit/flashcards/${String(postId)}`)
    if (typeId === 4) pushTo(`/edit/notes/${String(postId)}`)
    if (typeId === 5) pushTo(`/edit/sharelink/${String(postId)}`)
    if (typeId === 6) pushTo(`/edit/question/${String(postId)}`)
  };

  render() {
    const {
      classes,
      router,
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
      roleId,
      role,
      pushTo,
      newClassExperience,
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
          <div>
            <MenuItem onClick={this.handleEdit}> 
              <ListItemIcon color="inherit"> 
                <CreateIcon /> 
              </ListItemIcon> 
              <ListItemText inset primary="Edit" /> 
            </MenuItem> 
            <MenuItem onClick={this.handleDelete}>
              <ListItemIcon color="inherit">
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText inset primary="Delete" />
            </MenuItem>
          </div>
        )}
      </Menu>
    );

    const {
      location: {
        query
      }
    } = router

    const goToFeed = () => pushTo(`/feed?${queryString.stringify(query)}`)

    return (
      <Fragment>
        <Grid
          className={classes.backButton}
          container
          justify='flex-start'
          alignItems='center'
          onClick={goToFeed}
        >
          <ArrowBackIosRoundedIcon />
          <Typography className={classes.feedTypo}>Feed</Typography>
        </Grid>
        <div className={classes.root}>
          <Link
            className={classes.avatar}
            component={MyLink}
            href={`/profile/${userId}`}
          >
            <Avatar src={userProfileUrl} className={classes.bigAvatar}>
              {initials}
            </Avatar>
          </Link>
          <div className={classes.userInfo}>
            <Typography component="p" variant="h6" noWrap>
              <Link
                component={MyLink}
                href={`/profile/${userId}`}
                className={classes.link}
              >
                {name}
              </Link>{' '}
              {roleId === 2 && role && <TutorBadge text={role} />}
            </Typography>
            {!newClassExperience && <Typography component="p" variant="subtitle1" noWrap>
              {classroomName}
            </Typography>}
            <Typography component="p" variant="subtitle1" noWrap>
              {fromNow}
            </Typography>
          </div>
          <Tooltip
            id={9043}
            placement="right"
            text="Save what you want to review later during your study time. Set a reminder to view your bookmarks"
          >
            <IconButton onClick={this.handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Typography component="p" variant="h4" paragraph>
          {title}
        </Typography>
        {!isMarkdown ? (
          <Typography className={classes.body} component="p" variant="h6">
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
