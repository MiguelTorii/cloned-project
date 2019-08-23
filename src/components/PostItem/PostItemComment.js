/* eslint-disable react/no-danger */
// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Link from '@material-ui/core/Link';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ReplyIcon from '@material-ui/icons/Reply';
import green from '@material-ui/core/colors/green';
import PostItemAddComment from './PostItemAddComment';
import DialogTitle from '../DialogTitle';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 2
  },
  reply: {
    marginLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4
  },
  info: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.unit * 2
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  created: {
    paddingLeft: theme.spacing.unit
  },
  markdown: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
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
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  bestAnswer: {
    justifyContent: 'space-between'
  },
  grow: {
    flex: 1
  },
  thanks: {
    marginLeft: theme.spacing.unit
  },
  replyTo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  accepted: {
    '&:disabled': {
      backgroundColor: green[500],
      color: 'white'
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
  onPostComment: Function,
  onThanks: Function,
  onReport: Function,
  onDelete: Function,
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
    isQuestion: false
  };

  state = {
    showAddComment: false,
    open: false
  };

  handlePostComment = ({ comment }) => {
    const { id, rootCommentId, onPostComment } = this.props;
    onPostComment({ comment, rootCommentId, parentCommentId: id });
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

  render() {
    const {
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
      hasBestAnswer
    } = this.props;
    const { showAddComment, open } = this.state;
    const date = moment(created);
    const name = `${firstName} ${lastName}.`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    const fromNow = date ? date.fromNow() : '';

    return (
      <Fragment>
        <div className={cx(classes.container, isReply && classes.reply)}>
          <Link component={MyLink} href={`/profile/${ownerId}`}>
            <Avatar src={profileImageUrl}>{initials}</Avatar>
          </Link>
          <div className={classes.info}>
            <div className={classes.header}>
              <Typography component="p" variant="subtitle2" noWrap>
                <Link
                  component={MyLink}
                  href={`/profile/${ownerId}`}
                  className={classes.link}
                >
                  {name}
                </Link>
              </Typography>
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
            {isLoading && (
              <div className={classes.progress}>
                <LinearProgress variant="query" />
              </div>
            )}
            <div className={classes.markdown}>
              <span dangerouslySetInnerHTML={{ __html: comment }} />
              {/* <Markdown>{comment}</Markdown> */}
            </div>
            <div
              className={cx(
                classes.actions,
                isQuestion && !isOwn && classes.bestAnswer
              )}
            >
              {isQuestion && !isOwn && (!hasBestAnswer || accepted) ? (
                <Fragment>
                  <Button
                    className={classes.accepted}
                    color="primary"
                    variant={accepted ? 'contained' : 'text'}
                    onClick={this.handleOpenBestAnswer}
                    disabled={accepted || isLoading}
                  >
                    Best Answer
                  </Button>
                  <span className={classes.grow} />
                </Fragment>
              ) : (
                <span className={classes.grow} />
              )}
              <Typography
                component="p"
                variant="subtitle2"
                className={classes.thanks}
              >
                {`${thanksCount} thanks`}
              </Typography>
              {!isOwn && (
                <IconButton onClick={this.handleThanks} disabled={isLoading}>
                  {thanked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                </IconButton>
              )}
              <Button
                color="primary"
                disabled={isLoading}
                // variant="contained"
                onClick={this.handleShowAddComment}
              >
                Reply
              </Button>
              {!isOwn && (
                <Button
                  color="primary"
                  disabled={isLoading}
                  // variant="contained"
                  onClick={this.handleReport}
                >
                  Report
                </Button>
              )}
              {isOwn && !isReply && (
                <Button
                  color="secondary"
                  disabled={isLoading}
                  // variant="contained"
                  onClick={this.handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
        <Collapse in={showAddComment}>
          <PostItemAddComment
            profileImageUrl={ownProfileUrl}
            name={ownName}
            isReply
            rte
            readOnly={readOnly}
            isQuestion={isQuestion}
            onPostComment={this.handlePostComment}
            onCancelComment={this.handleShowAddComment}
          />
        </Collapse>
        <Dialog
          open={open}
          onClose={this.handleCloseBestAnswer}
          aria-labelledby="best-answer-dialog-title"
          aria-describedby="remove-dialog-description"
        >
          <DialogTitle
            id="best-answer-dialog-title"
            onClose={this.handleCloseBestAnswer}
          >
            Best Answer
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              color="textPrimary"
              id="best-answer-dialog-description"
            >
              Are you sure you want to mark it as Best Answer?
              <br />
              <br />
              Once you choose a Best Answer you cannot change it
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseBestAnswer}
              color="secondary"
              variant="contained"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleConfirmBestAnswer}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemComment);
