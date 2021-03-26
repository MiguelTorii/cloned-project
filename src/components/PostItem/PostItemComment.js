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
import Link from '@material-ui/core/Link';
import green from '@material-ui/core/colors/green';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ReplyIcon from '@material-ui/icons/Reply';
import ReportIcon from '@material-ui/icons/Report';
import DeleteIcon from '@material-ui/icons/Delete';

import TutorBadge from 'components/TutorBadge'
import CustomQuill from 'components/CustomQuill'
import SkeletonLoad from 'components/PostItem//SkeletonLoad';
import PostItemAddComment from './PostItemAddComment';
import Dialog from '../Dialog';
// $FlowIgnore
import { ReactComponent as ThanksIcon } from '../../assets/svg/ic_thanks_hands.svg';
import thanksSvg from '../../assets/svg/thanks.svg'
import commentSvg from '../../assets/svg/comment.svg'

const MyLink = React.forwardRef(({ href, ...props }, ref) => <RouterLink to={href} {...props} ref={ref} />);

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: theme.spacing(2, 0)
  },
  reply: {
    marginLeft: theme.spacing(6),
    paddingRight: theme.spacing(6)
  },
  info: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1)
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1)
  },
  commentArea: {
    backgroundColor: theme.circleIn.palette.appBar,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: theme.spacing(1.5)
  },
  created: {
    paddingLeft: 0
  },
  markdown: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    '& img': {
      maxHeight: '100px !important',
      width: 'auto'
    },
    '& a': {
      color: theme.palette.primary.main
    }
  },
  progress: {
    width: '100%'
  },
  actions: {
    marginTop: theme.spacing(),
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  bestAnswer: {
    justifyContent: 'space-between'
  },
  grow: {
    flex: 1
  },
  thanks: {
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    color: theme.circleIn.palette.primaryText1,
  },
  actionIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing()
  },
  replyTo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(3/2)
  },
  accepted: {
    '&:disabled': {
      backgroundColor: green[500],
      color: 'white'
    }
  },
  link: {
    color: theme.circleIn.palette.primaryText1,
    '&:hover': {
      textDecoration: 'none',
    }
  }
});

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
  onThanks: Function,
  onReport: Function,
  onDelete: Function,
  role: string,
  replyCommentId: number,
  onBestAnswer: Function
};

type State = {
  showAddComment: boolean,
  open: boolean
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
    open: false
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
      isOwn,
      isReply,
      isLoading,
      isQuestion,
      readOnly,
      accepted,
      hasBestAnswer,
      role,
      isOwner,
      userId,
      replyCommentId
    } = this.props;
    const { showAddComment, open, moreAnchorEl } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const date = moment(created);
    const name = `${firstName} ${lastName}.`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
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
        {isQuestion && !isOwn && isOwner && (!hasBestAnswer || accepted) ? (
          <MenuItem onClick={this.handleOpenBestAnswer}>
            <ListItemIcon color="inherit">
              <ThumbUpIcon />
            </ListItemIcon>
            <ListItemText inset primary="Reply" />
          </MenuItem>
        ): (
          <span className={classes.grow} />
        )}
        {!isOwn && (
          <MenuItem onClick={this.handleReport}>
            <ListItemIcon color="inherit">
              <ReportIcon />
            </ListItemIcon>
            <ListItemText inset primary="Report" />
          </MenuItem>
        )}
        {isOwn && !isReply && (
          <MenuItem onClick={this.handleDelete}>
            <ListItemIcon color="inherit">
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        )}
      </Menu>
    );

    return replyCommentId && replyCommentId === id ? <SkeletonLoad /> : (
      <>
        <div className={cx(classes.container, isReply && classes.reply)}>
          <Link component={MyLink} href={`/profile/${ownerId}`}>
            <Avatar src={profileImageUrl}>{initials}</Avatar>
          </Link>
          <div className={classes.info}>
            <div className={classes.commentArea}>
              <div>
                <div className={classes.header}>
                  <Typography component="p" variant="subtitle2" noWrap>
                    <Link
                      component={MyLink}
                      href={`/profile/${ownerId}`}
                      className={classes.link}
                    >
                      {name} {role && <TutorBadge text={role} />}
                    </Link>
                  </Typography>
                  &nbsp; • &nbsp;
                  <Typography
                    component="p"
                    variant="caption"
                    noWrap
                    className={classes.created}
                  >
                    {fromNow}
                  </Typography>
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
                  <div className={classes.actionIcon}>{thanked ? <ThanksIcon /> : <ThanksIcon />}</div>
                  <strong className={classes.thanks}>{thanksCount}</strong>
                </IconButton>
              }

              <Typography
                component="p"
                variant="subtitle2"
                className={classes.thanks}
              >
                <img
                  src={commentSvg}
                  className={classes.actionIcon}
                  alt="thanks"
                />
              </Typography>
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
