/* eslint-disable jsx-a11y/anchor-is-valid */
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
import Box from '@material-ui/core/Box';
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

import RoleBadge from 'components/RoleBadge';
import CustomQuill from 'components/CustomQuill';
import Tooltip from 'containers/Tooltip';
import SharePost from 'containers/SharePost';

import { getInitials } from 'utils/chat';
import _ from 'lodash';
import { styles } from '../_styles/PostItem/PostItemHeader';

const BODY_LENGTH_THRESHOLD = 80;
const MyLink = React.forwardRef(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

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
  pop: Function,
  pushTo: Function,
  expertMode: boolean,
  router: Object,
  onDelete: Function,
  onEdit: Function,
  isPastClassFlashcard?: boolean
};

type State = {
  moreAnchorEl: ?string
};

class PostItemHeader extends React.PureComponent<Props, State> {
  static defaultProps = {
    isMarkdown: false,
    isPastClassFlashcard: false
  };

  state = {
    moreAnchorEl: null,
    open: false,
    showShortSummary: true
  };

  handleMenuOpen = (event) => {
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
    const { open } = this.state;
    this.setState({ open: !open });
  };

  handleEdit = () => {
    const { onEdit, postId, typeId, pushTo } = this.props;
    this.handleMenuClose();
    if (typeId === 3) {
      onEdit();
    }
    if (typeId === 4) pushTo(`/edit/notes/${String(postId)}`);
    if (typeId === 5) pushTo(`/edit/sharelink/${String(postId)}`);
    if (typeId === 6) pushTo(`/edit/question/${String(postId)}`);
    if (typeId === 8) pushTo(`/edit/post/${String(postId)}`);
  };

  handleSummaryMoreOrLess = () => {
    const { showShortSummary } = this.state;
    this.setState({
      showShortSummary: !showShortSummary
    });
  };

  handleGoBack = () => {
    const { router, pushTo, pop } = this.props;
    const {
      location: { query }
    } = router;
    const from = new URLSearchParams(query).get('from');

    switch (from) {
      case 'profile':
        pop();
        break;
      default:
        pushTo(`/feed?${queryString.stringify(query)}`);
        break;
    }
  };

  render() {
    const {
      hideShare,
      feedId,
      classes,
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
      newClassExperience,
      onBookmark,
      router,
      isPastClassFlashcard
    } = this.props;

    const { moreAnchorEl, open, showShortSummary } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const initials = getInitials(name);
    const date = moment(created);
    const fromNow = date ? date.fromNow() : '';
    const from = new URLSearchParams(router.location.query).get('from'); // This indicates where the feed came from.
    let navigationTitle = '';

    if (from === 'profile') {
      if (userId === currentUserId) {
        navigationTitle = 'Back to Profile';
      } else {
        navigationTitle = `${name}'s Profile`;
      }
    } else {
      navigationTitle = 'Feed';
    }

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
            {!isPastClassFlashcard && (
              <MenuItem onClick={this.handleEdit}>
                <ListItemIcon color="inherit">
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText inset primary="Edit" />
              </MenuItem>
            )}
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

    return (
      <Fragment>
        <Grid
          className={classes.backButton}
          container
          justify="flex-start"
          alignItems="center"
          onClick={this.handleGoBack}
        >
          <ArrowBackIosRoundedIcon />
          <Typography className={classes.feedTypo}>
            {navigationTitle}
          </Typography>
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
            <Box display="flex" alignItems="center">
              <Typography component="p" variant="h6" noWrap>
                <Link
                  component={MyLink}
                  href={`/profile/${userId}`}
                  className={classes.link}
                >
                  {name}
                </Link>
              </Typography>
              {role && <RoleBadge text={role} />}
            </Box>
            {!newClassExperience || expertMode ? (
              <Typography component="p" variant="subtitle1" noWrap>
                {classroomName} • {fromNow}
              </Typography>
            ) : (
              <Typography component="p" variant="subtitle1" noWrap>
                {fromNow}
              </Typography>
            )}
          </div>
          {hideShare && (
            <Button aria-label="Share" onClick={this.handleShare}>
              <ShareIcon />
            </Button>
          )}
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
            {showShortSummary
              ? _.truncate(body, { length: BODY_LENGTH_THRESHOLD })
              : body}
            {body.length > BODY_LENGTH_THRESHOLD && (
              <Link
                className={classes.moreLessLink}
                onClick={this.handleSummaryMoreOrLess}
                color="inherit"
                underline="always"
              >
                {showShortSummary ? 'see more' : 'show less'}
              </Link>
            )}
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
