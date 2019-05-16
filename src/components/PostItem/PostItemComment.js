/* eslint-disable react/no-danger */
// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ReplyIcon from '@material-ui/icons/Reply';
import PostItemAddComment from './PostItemAddComment';

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
    fontFamily: theme.typography.fontFamily
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
  thanks: {
    marginLeft: theme.spacing.unit
  },
  replyTo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
  onPostComment: Function,
  onThanks: Function,
  onReport: Function,
  onDelete: Function
};

type State = {
  showAddComment: boolean
};

class PostItemComment extends React.PureComponent<Props, State> {
  static defaultProps = {
    replyTo: '',
    isReply: false,
    isLoading: false
  };

  state = {
    showAddComment: false
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

  render() {
    const {
      classes,
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
      onDelete
    } = this.props;
    const { showAddComment } = this.state;
    const date = moment(created);
    const name = `${firstName} ${lastName}.`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    const fromNow = date ? date.fromNow() : '';

    return (
      <Fragment>
        <div className={cx(classes.container, isReply && classes.reply)}>
          <Avatar src={profileImageUrl}>{initials}</Avatar>
          <div className={classes.info}>
            <div className={classes.header}>
              <Typography component="p" variant="subtitle2" noWrap>
                {name}
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
            <div className={classes.actions}>
              <Typography
                component="p"
                variant="subtitle2"
                className={classes.thanks}
              >
                {`${thanksCount} ${thanksCount === 1 ? 'thank' : 'thanks'}`}
              </Typography>
              {!isOwn && (
                <IconButton onClick={this.handleThanks}>
                  {thanked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                </IconButton>
              )}
              <Button color="primary" onClick={this.handleShowAddComment}>
                Reply
              </Button>
              {!isOwn && (
                <Button color="primary" onClick={this.handleReport}>
                  Report
                </Button>
              )}
              {isOwn && !isReply && false && (
                <Button color="primary" onClick={onDelete}>
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
            onPostComment={this.handlePostComment}
            onCancelComment={this.handleShowAddComment}
          />
        </Collapse>
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemComment);
