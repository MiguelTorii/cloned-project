// @flow
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import queryString from 'query-string';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
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
import ShareIcon from '@material-ui/icons/Share';

import TutorBadge from 'components/TutorBadge'
import CustomQuill from 'components/CustomQuill'
import Tooltip from 'containers/Tooltip';
import SharePost from 'containers/SharePost';

import { styles } from '../_styles/PostItem/PostItemHeader';

const MyLink = React.forwardRef(({ href, ...props }, ref) => <RouterLink to={href} {...props} ref={ref} />);


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
  role: string,
  onBookmark: Function,
  newClassExperience: boolean,
  onReport: Function,
  postId: number,
  typeId: number,
  pushTo: Function,
  expertMode: boolean,
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
    moreAnchorEl: null,
    open: false
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

  handleShare = () => {
    const { open } = this.state
    this.setState({ open: !open });
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
      hideShare,
      feedId,
      classes,
      router,
      expertMode,
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
      role,
      pushTo,
      newClassExperience,
      onBookmark
    } = this.props;
    const { moreAnchorEl, open } = this.state;
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
              {role && <TutorBadge text={role} />}
            </Typography>
            {(!newClassExperience || expertMode) ? (
              <Typography component="p" variant="subtitle1" noWrap>
                {classroomName} • {fromNow}
              </Typography>
            ) : (
              <Typography component="p" variant="subtitle1" noWrap>
                {fromNow}
              </Typography>
            )}
          </div>
          {hideShare && <Button aria-label="Share" onClick={this.handleShare}>
            <ShareIcon />
          </Button>}
          <SharePost feedId={feedId} open={open} onClose={this.handleShare} />
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
            <CustomQuill value={body} readOnly />
          </div>
        )}
        {renderMenu}
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemHeader);
