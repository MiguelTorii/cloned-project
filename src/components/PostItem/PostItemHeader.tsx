/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import truncate from 'lodash/truncate';
import moment from 'moment';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import ShareIcon from '@material-ui/icons/Share';

import { ANONYMOUS_USER_ID, PROFILE_PAGE_SOURCE } from 'constants/common';
import { getInitials } from 'utils/chat';
import { buildPath, getPastClassIds } from 'utils/helpers';

import Avatar from 'components/Avatar';
import SharePost from 'containers/SharePost/SharePost';
import { PROFILE_SOURCE_KEY } from 'routeConstants';

import { styles } from '../_styles/PostItem/PostItemHeader';
import CustomQuill from '../CustomQuill/CustomQuill';
import HoverPopup from '../HoverPopup/HoverPopup';
import RoleBadge from '../RoleBadge/RoleBadge';

import type { State as StoreState } from 'types/state';

const BODY_LENGTH_THRESHOLD = 80;
const MyLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));
type Props = {
  classes?: Record<string, any>;
  user?: Record<string, any>;
  currentUserId?: string;
  userId?: string;
  classId?: number;
  name?: string;
  userProfileUrl?: string;
  classroomName?: string;
  created?: string;
  title?: string;
  body?: string;
  isMarkdown?: boolean;
  bookmarked?: boolean;
  role?: string;
  onBookmark?: (...args: Array<any>) => any;
  onReport?: (...args: Array<any>) => any;
  postId?: number;
  typeId?: number;
  pop?: (...args: Array<any>) => any;
  pushTo?: (...args: Array<any>) => any;
  expertMode?: boolean;
  router?: Record<string, any>;
  onDelete?: (...args: Array<any>) => any;
  onEdit?: (...args: Array<any>) => any;
  hideShare?: any;
  feedId?: number;
  roleId?: number;
};
type State = {
  moreAnchorEl: string | null | undefined;
};

class PostItemHeader extends React.PureComponent<Props, State> {
  static defaultProps = {
    isMarkdown: false
  };

  state = {
    moreAnchorEl: null,
    open: false,
    showShortSummary: true
  };

  handleMenuOpen = (event) => {
    this.setState({
      moreAnchorEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({
      moreAnchorEl: null
    });
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
    this.setState({
      open: !open
    } as any);
  };

  handleEdit = () => {
    const { onEdit, postId, typeId, pushTo } = this.props;
    this.handleMenuClose();

    if (typeId === 3) {
      onEdit();
    }

    if (typeId === 4) {
      pushTo(`/edit/notes/${String(postId)}`);
    }

    if (typeId === 5) {
      pushTo(`/edit/sharelink/${String(postId)}`);
    }

    if (typeId === 6) {
      pushTo(`/edit/question/${String(postId)}`);
    }

    if (typeId === 8) {
      pushTo(`/edit/post/${String(postId)}`);
    }
  };

  handleSummaryMoreOrLess = () => {
    const { showShortSummary } = this.state;
    this.setState({
      showShortSummary: !showShortSummary
    } as any);
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
      onBookmark,
      router,
      classId,
      user
    } = this.props;
    const {
      userClasses: { classList }
    } = user;
    const { moreAnchorEl, open, showShortSummary } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const initials = getInitials(name);
    const pastClassIds = getPastClassIds(classList);
    const date = moment(created);
    const fromNow = date ? date.fromNow() : '';
    const from = new URLSearchParams(router.location.query).get(PROFILE_SOURCE_KEY); // This indicates where the feed came from.

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
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
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
            {!pastClassIds.includes(classId) && (
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
      <>
        <Grid
          className={classes.backButton}
          container
          justifyContent="flex-start"
          alignItems="center"
          onClick={this.handleGoBack}
        >
          <ArrowBackIosRoundedIcon />
          <Typography className={classes.feedTypo}>{navigationTitle}</Typography>
        </Grid>
        <div className={classes.root}>
          {Number(userId) === ANONYMOUS_USER_ID ? (
            <Avatar
              profileImage={userProfileUrl}
              initials={initials}
              mobileSize={60}
              desktopSize={60}
            />
          ) : (
            <Link
              className={classes.avatar}
              component={MyLink}
              underline="none"
              href={buildPath(`/profile/${userId}`, {
                from: PROFILE_PAGE_SOURCE.POST
              })}
            >
              <HoverPopup userId={userId} profileSource={PROFILE_PAGE_SOURCE.POST}>
                <Avatar
                  profileImage={userProfileUrl}
                  initials={initials}
                  mobileSize={60}
                  desktopSize={60}
                />
              </HoverPopup>
            </Link>
          )}

          <div className={classes.userInfo}>
            <Box display="flex" alignItems="center">
              <Typography component="p" variant="h6" noWrap>
                {Number(userId) === ANONYMOUS_USER_ID ? (
                  name
                ) : (
                  <Link
                    component={MyLink}
                    href={buildPath(`/profile/${userId}`, {
                      from: PROFILE_PAGE_SOURCE.POST
                    })}
                    className={classes.link}
                  >
                    {name}
                  </Link>
                )}
              </Typography>
              {role && <RoleBadge text={role} />}
            </Box>
            {expertMode ? (
              <Typography component="p" variant="subtitle1" noWrap>
                {classroomName} ??? {fromNow}
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
          <IconButton onClick={this.handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </div>
        <Typography component="p" variant="h4" paragraph>
          {title}
        </Typography>
        {!isMarkdown ? (
          <Typography className={classes.body} component="p" variant="h6">
            {showShortSummary
              ? truncate(body, {
                  length: BODY_LENGTH_THRESHOLD
                })
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
      </>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(
  mapStateToProps,
  null
)(withStyles(styles as any)(PostItemHeader));
