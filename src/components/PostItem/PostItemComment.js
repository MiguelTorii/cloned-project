/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyIcon from '@material-ui/icons/Reply';
import ReportIcon from '@material-ui/icons/Report';
import DeleteIcon from '@material-ui/icons/Delete';
import PenIcon from '@material-ui/icons/Create';

import RoleBadge from 'components/RoleBadge'
import CustomQuill from 'components/CustomQuill'
import SkeletonLoad from 'components/PostItem/SkeletonLoad';
import { getInitials } from 'utils/chat';
import IconBadge from 'assets/svg/badge.svg';
import PostItemAddComment from './PostItemAddComment';
import Dialog from '../Dialog';
// $FlowIgnore
import { ReactComponent as ThanksIcon } from '../../assets/svg/ic_thanks_hands.svg';
import { ReactComponent as ThankedIcon } from '../../assets/svg/thanked.svg';
import thanksSvg from '../../assets/svg/thanks.svg'
import commentSvg from '../../assets/svg/comment.svg'

import { styles } from '../_styles/PostItem/PostItemComment';
import OnlineBadge from '../OnlineBadge';

const MyLink = React.forwardRef(({ href, ...props }, ref) => <RouterLink to={href} {...props} ref={ref} />);

type Props = {
  classes: Object,
  id: number,
  ownProfileUrl: string,
  ownName: string,
  ownerId: string,
  replyTo?: string,
  firstName: string,
  lastName: string,
  profileImageUrl: string,
  created: string,
  comment: string,
  thanksCount: number,
  thanked: boolean,
  rootCommentId: number,
  isOwn: boolean,
  isReply?: boolean,
  isLoading?: boolean,
  isQuestion?: boolean,
  readOnly: boolean,
  accepted: boolean,
  hasBestAnswer: boolean,
  isOwner: boolean,
  onPostComment: Function,
  onUpdateComment: Function,
  onThanks: Function,
  onReport: Function,
  onDelete: Function,
  role: string,
  roleId: number,
  replyCommentId: number,
  onBestAnswer: Function
};

type State = {
  showAddComment: boolean,
  open: boolean,
  isEditing: boolean
};

class PostItemComment extends React.PureComponent<Props, State> {
  static defaultProps = {
    replyTo: '',
    isReply: false,
    isLoading: false,
    isQuestion: false,
  };

  state = {
    showAddComment: false,
    moreAnchorEl: null,
    open: false,
    isEditing: false
  };

  handlePostComment = ({ comment, anonymous }) => {
    const { id, rootCommentId, onPostComment } = this.props;
    onPostComment({ comment, rootCommentId, parentCommentId: id, anonymous });
  };

  handleShowAddComment = () => {
    this.setState(({ showAddComment }) => ({
      showAddComment: !showAddComment
    }));
  };

  handleThanks = () => {
    const { id, onThanks } = this.props;
    onThanks({ commentId: id });
  };

  handleReport = () => {
    const { id, ownerId, onReport } = this.props;
    onReport({ commentId: id, ownerId });
  };

  handleConfirmBestAnswer = () => {
    const { id, onBestAnswer } = this.props;
    this.handleCloseBestAnswer();
    this.setState({
      moreAnchorEl: null
    });
    onBestAnswer({ commentId: id });
  };

  handleOpenBestAnswer = () => {
    this.setState({ open: true });
  };

  handleCloseBestAnswer = () => {
    this.setState({ open: false });
  };

  handleDelete = () => {
    const { id, onDelete } = this.props;
    onDelete(id);
  };

  handleMenuOpen = event => {
    this.setState({ moreAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ moreAnchorEl: null });
  };

  handleEditComment = () => {
    this.setState({ isEditing: true });
    this.handleMenuClose();
  };

  handleUpdateComment = ({ comment }) => {
    const { id, onUpdateComment } = this.props;
    onUpdateComment(id, comment);
    this.setState({ isEditing: false });
  };

  handleCancelEditComment = () => {
    this.setState({
      isEditing: false
    });
  };

  render() {
    const {
      id,
      classes,
      ownerId,
      ownProfileUrl,
      ownName,
      replyTo,
      firstName,
      lastName,
      profileImageUrl,
      created,
      comment,
      thanksCount,
      thanked,
      isOnline,
      isOwn,
      isReply,
      isLoading,
      isQuestion,
      readOnly,
      accepted,
      hasBestAnswer,
      roleId,
      isOwner,
      userId,
      replyCommentId
    } = this.props;
    const { showAddComment, open, moreAnchorEl, isEditing } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const date = moment(created);
    const name = `${firstName} ${lastName}`;
    const initials = getInitials(name)
    const fromNow = date ? date.fromNow() : '';

    const renderMenu  = (
      <Menu
        disableAutoFocusItem
        anchorEl={moreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleShowAddComment}>
          <ListItemIcon color="inherit">
            <ReplyIcon />
          </ListItemIcon>
          <ListItemText inset primary="Reply" />
        </MenuItem>
        {isQuestion && !isOwn && isOwner && !hasBestAnswer && !accepted && (
          <MenuItem onClick={this.handleOpenBestAnswer}>
            <ListItemIcon color="inherit">
              <img src={IconBadge} className={classes.badgeIcon} alt="best answer badge" />
            </ListItemIcon>
            <ListItemText inset primary="Mark as Best Answer" />
          </MenuItem>
        )}
        {isOwn &&
          <MenuItem onClick={this.handleEditComment}>
            <ListItemIcon color="inherit">
              <PenIcon />
            </ListItemIcon>
            <ListItemText inset primary="Edit" />
          </MenuItem>
        }
        {!isOwn
          ? <MenuItem onClick={this.handleReport}>
            <ListItemIcon color="inherit">
              <ReportIcon />
            </ListItemIcon>
            <ListItemText inset primary="Report" />
          </MenuItem>
          : <MenuItem onClick={this.handleDelete}>
            <ListItemIcon color="inherit">
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>}
      </Menu>
    );

    const renderComment = () => (
      <div className={classes.commentArea}>
        <div>
          <div className={classes.header}>
            <Box display="flex" alignItems="center">
              <Typography component="p" variant="subtitle2" noWrap>
                <Link
                  component={MyLink}
                  href={`/profile/${ownerId}`}
                  className={classes.link}
                >
                  {name}
                </Link>
              </Typography>
              {roleId !== 1 && <RoleBadge />}
            </Box>
            &nbsp; • &nbsp;
            <Typography
              component="p"
              variant="caption"
              noWrap
              className={classes.created}
            >
              {fromNow}
            </Typography>
            {/* It shows a badge if the answer is set as the best answer. */}
            {accepted && (
              <Chip
                className={classes.bestAnswerChip}
                label="BEST ANSWER"
                icon={<img src={IconBadge} alt="best answer badge" />}
                size="small"
              />
            )}
          </div>
          {replyTo !== '' && (
            <div className={classes.replyTo}>
              <ReplyIcon />
              <Typography component="p" variant="subtitle2" noWrap>
                {`Replying to ${replyTo || ''}`}
              </Typography>
            </div>
          )}
          <div className={classes.markdown}>
            <CustomQuill value={comment} readOnly />
          </div>
        </div>

        <IconButton onClick={this.handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </div>
    );

    return replyCommentId && replyCommentId === id ? <SkeletonLoad /> : (
      <>
        <div className={cx(classes.container, isReply && classes.reply)}>
          <Link component={MyLink} href={`/profile/${ownerId}`}>
            <OnlineBadge isOnline={isOnline} bgColorPath="circleIn.palette.feedBackground" fromChat>
              <Avatar src={profileImageUrl}>{initials}</Avatar>
            </OnlineBadge>
          </Link>
          <div className={classes.info}>
            { isEditing ? (
              <div className={classes.editContainer}>
                <PostItemAddComment
                  profileImageUrl={ownProfileUrl}
                  name={ownName}
                  userId={userId}
                  isReply
                  rte
                  readOnly={readOnly}
                  isQuestion={isQuestion}
                  onPostComment={this.handleUpdateComment}
                  onEscape={this.handleCancelEditComment}
                  defaultValue={comment}
                />
              </div>
            ) : renderComment()
            }
            <div
              className={cx(
                classes.actions,
                isQuestion && !isOwn && classes.bestAnswer
              )}
            >
              {isOwn ? <Typography
                component="p"
                variant="subtitle2"
                className={classes.thanks}
              >
                <img
                  src={thanksSvg}
                  className={classes.actionIcon}
                  alt="thanks"
                />
                <strong>{thanksCount}</strong>
              </Typography> :
                <IconButton onClick={this.handleThanks} disabled={isLoading}>
                  <div className={classes.actionIcon}>{thanked ? <ThankedIcon /> : <ThanksIcon />}</div>
                  <strong className={cx(thanked ? classes.thanked : classes.thanks)}>{thanksCount}</strong>
                </IconButton>
              }

              <Typography
                component="p"
                variant="subtitle2"
                className={classes.thanks}
              >
                <IconButton onClick={this.handleShowAddComment}>
                  <img
                    src={commentSvg}
                    className={classes.actionIcon}
                    alt="thanks"
                  />
                </IconButton>
              </Typography>

              {isEditing && (
                <Typography variant="subtitle2">
                  Press Esc to&nbsp;
                  <Link component="button" onClick={this.handleCancelEditComment}>Cancel</Link>
                </Typography>
              )}

            </div>
          </div>
        </div>
        <Collapse in={showAddComment}>
          <PostItemAddComment
            commentId={id}
            profileImageUrl={ownProfileUrl}
            name={ownName}
            userId={userId}
            isReply
            rte
            readOnly={readOnly}
            isQuestion={isQuestion}
            onPostComment={this.handlePostComment}
            onCancelComment={this.handleShowAddComment}
          />
        </Collapse>
        <Dialog
          ariaDescribedBy="remove-dialog-description"
          okTitle="Confirm"
          onCancel={this.handleCloseBestAnswer}
          onOk={this.handleConfirmBestAnswer}
          open={open}
          showActions
          showCancel
          title="Best Answer"
        >
          <Typography
            color="textPrimary"
            id="best-answer-dialog-description"
          >
            Are you sure you want to mark it as Best Answer?
            <br />
            <br />
            Once you choose a Best Answer you cannot change it
          </Typography>
        </Dialog>
        {renderMenu}
      </>
    );
  }
}

export default withStyles(styles)(PostItemComment);
