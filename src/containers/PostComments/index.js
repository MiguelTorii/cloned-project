// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PostItemAddComment from 'components/PostItem/PostItemAddComment';
import PostItemComment from 'components/PostItem/PostItemComment';
import SkeletonLoad from 'components/PostItem//SkeletonLoad';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import update from 'immutability-helper';

import Report from '../Report';
import {
  getPostComments,
  createComment,
  thankComment,
  bestAnswer,
  deleteComment, updateComment
} from '../../api/posts';
import { logEvent } from '../../api/analytics';
import type { Comments } from '../../types/models';
import { processComments } from './utils';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  readOnly: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    marginTop: theme.spacing(2)
  },
  viewMore: {
    marginBottom: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  user: UserState,
  feedId: number,
  postId: number,
  typeId: number,
  isQuestion?: boolean,
  readOnly: boolean,
  hasBestAnswer?: boolean,
  isOwner?: boolean
};

type State = {
  comments: ?Comments,
  items: Array<Object>,
  isLoading: boolean,
  report: ?Object
};

class ViewNotes extends React.PureComponent<Props, State> {
  static defaultProps = {
    isQuestion: false,
    hasBestAnswer: false,
    isOwner: false
  };

  state = {
    comments: null,
    items: [],
    isLoading: false,
    report: null,
    loadViewMoreComment: false,
    replyCommentId: 0
  };

  componentDidMount = () => {
    this.loadData()
  }

  handlePostComment = async ({
    comment,
    rootCommentId,
    parentCommentId,
    anonymous
  }: {
    comment: string,
    rootCommentId: number,
    parentCommentId: number,
    anonymous: boolean
  }) => {
    if (comment.trim() === '') return;
    const {
      user: {
        data: { userId }
      },
      postId,
      typeId
    } = this.props;
    if (rootCommentId) {
      this.setState({ replyCommentId: parentCommentId });
    } else {
      this.setState({ isLoading: true });
    }
    try {
      await createComment({
        userId,
        postId,
        typeId,
        anonymous,
        comment,
        rootCommentId,
        parentCommentId
      });
      await this.loadData();
    } finally {
      this.setState({ isLoading: false, replyCommentId: 0 });
      logEvent({
        event: 'Feed- Ask Question',
        props: {}
      });
    }
  };

  handleUpdateComment = async (commentId, newValue) => {
    const { comments } = this.state;
    const { success } = await updateComment(commentId, newValue);

    if (!success) return ;

    const index = comments.comments.findIndex((item) => item.id === commentId);

    if (index >= 0) {
      const newComments = update(comments, {
        comments: {
          [index]: (item) => update(item, {
            comment: {
              $set: newValue
            }
          })
        }
      });

      this.setState(update(this.state, {
        comments: { $set: newComments },
        items: { $set: processComments(newComments.comments).reverse() }
      }));
    }
  };

  handleThanks = async ({ commentId }) => {
    const {
      user: {
        data: { userId }
      },
      feedId
    } = this.props;
    this.setState({ isLoading: true });
    try {
      await thankComment({ userId, feedId, commentId });
      await this.loadData();
    } finally {
      this.setState({ isLoading: false });
      logEvent({
        event: 'Feed- Thank Post',
        props: { 'Internal ID': feedId }
      });
    }
  };

  handleReport = async ({
    commentId,
    ownerId
  }: {
    commentId: number,
    ownerId: number
  }) => {
    this.setState({ report: { commentId, ownerId } });
  };

  handleReportClose = () => {
    this.setState({ report: null });
  };

  handleDelete = async id => {
    try {
      this.setState({ isLoading: true });
      const {
        user: {
          data: { userId }
        }
      } = this.props;
      await deleteComment({ userId, id });
      await this.loadData();
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleBestAnswer = async ({ commentId }: {commentId: number}) => {
    const {
      user: {
        data: { userId }
      },
      feedId
    } = this.props;
    this.setState({ isLoading: true });
    try {
      await bestAnswer({ userId, feedId, commentId });
      await this.loadData();
    } finally {
      this.setState({ isLoading: false });
      logEvent({
        event: 'Feed- Best Answer',
        props: {}
      });
    }
  };

  loadData = async () => {
    const {
      user: {
        data: { userId }
      },
      postId,
      typeId
    } = this.props;
    const result = await getPostComments({ userId, postId, typeId });
    const items = processComments(result.comments);

    this.setState({ comments: result, items: items.reverse() });
  };

  viewMoreComment = () => {
    const { loadViewMoreComment } = this.state;
    this.setState({ loadViewMoreComment: !loadViewMoreComment })
  }

  render() {
    const {
      classes,
      user: {
        data: { userId, profileImage, firstName, lastName }
      },
      isQuestion,
      readOnly,
      hasBestAnswer,
      isOwner,
      feedId
    } = this.props;
    const {
      comments,
      items,
      isLoading,
      report,
      loadViewMoreComment,
      replyCommentId
    } = this.state;
    if (!comments) return null;

    const name = `${firstName} ${lastName}`;
    return (
      <Fragment>
        {readOnly && (
          <Paper className={classes.readOnly} elevation={8}>
            <Typography variant="h6">
              Commenting and replying have been disabled for CircleIn101 post
            </Typography>
          </Paper>
        )}
        <ErrorBoundary>
          <PostItemAddComment
            userId={userId}
            name={name}
            profileImageUrl={profileImage}
            rte
            readOnly={readOnly}
            isQuestion={isQuestion}
            feedId={feedId}
            onPostComment={this.handlePostComment}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          {loadViewMoreComment
            ? items.map((item) => (
              <Fragment key={item.id}>
                <PostItemComment
                  id={item.id}
                  replyCommentId={replyCommentId}
                  role={item.user.role}
                  roleId={item.user.roleId}
                  ownProfileUrl={profileImage}
                  ownName={name}
                  ownerId={item.user.userId}
                  firstName={item.user.firstName}
                  lastName={item.user.lastName}
                  profileImageUrl={item.user.profileImageUrl}
                  created={item.created}
                  comment={item.comment}
                  thanksCount={item.thanksCount}
                  thanked={item.thanked}
                  rootCommentId={item.id}
                  accepted={item.accepted}
                  isLoading={isLoading}
                  isQuestion={isQuestion}
                  isOwn={item.user.userId === userId}
                  readOnly={readOnly}
                  hasBestAnswer={hasBestAnswer}
                  isOwner={Boolean(isOwner)}
                  onPostComment={this.handlePostComment}
                  onUpdateComment={this.handleUpdateComment}
                  onThanks={this.handleThanks}
                  onDelete={this.handleDelete}
                  onReport={this.handleReport}
                  onBestAnswer={this.handleBestAnswer}
                  userId={userId}
                />
                {item.children.reverse().map(reply => (
                  <PostItemComment
                    key={reply.id}
                    id={reply.id}
                    replyCommentId={replyCommentId}
                    ownProfileUrl={profileImage}
                    ownName={name}
                    role={reply.user.role}
                    roleId={reply.user.roleId}
                    replyTo={reply.replyTo}
                    firstName={reply.user.firstName}
                    lastName={reply.user.lastName}
                    profileImageUrl={reply.user.profileImageUrl}
                    created={reply.created}
                    comment={reply.comment}
                    thanksCount={reply.thanksCount}
                    thanked={reply.thanked}
                    rootCommentId={item.id}
                    isLoading={isLoading}
                    isOwn={reply.user.userId === userId}
                    isReply
                    readOnly={readOnly}
                    hasBestAnswer={hasBestAnswer}
                    isOwner={Boolean(isOwner)}
                    onPostComment={this.handlePostComment}
                    onUpdateComment={this.handleUpdateComment}
                    onThanks={this.handleThanks}
                    onDelete={this.handleDelete}
                    onReport={this.handleReport}
                    onBestAnswer={this.handleBestAnswer}
                    userId={userId}
                  />
                ))}
              </Fragment>
            ))
            : (!!items.length && <div key={items[0].id}>
              <PostItemComment
                id={items[0].id}
                role={items[0].user.role}
                roleId={items[0].user.roleId}
                ownProfileUrl={profileImage}
                ownName={name}
                ownerId={items[0].user.userId}
                firstName={items[0].user.firstName}
                lastName={items[0].user.lastName}
                profileImageUrl={items[0].user.profileImageUrl}
                created={items[0].created}
                comment={items[0].comment}
                thanksCount={items[0].thanksCount}
                thanked={items[0].thanked}
                rootCommentId={items[0].id}
                accepted={items[0].accepted}
                isLoading={isLoading}
                isQuestion={isQuestion}
                isOwn={items[0].user.userId === userId}
                readOnly={readOnly}
                hasBestAnswer={hasBestAnswer}
                isOwner={Boolean(isOwner)}
                onPostComment={this.handlePostComment}
                onUpdateComment={this.handleUpdateComment}
                onThanks={this.handleThanks}
                onDelete={this.handleDelete}
                onReport={this.handleReport}
                onBestAnswer={this.handleBestAnswer}
              />
              {!!replyCommentId && <SkeletonLoad />}
            </div>)}
        </ErrorBoundary>
        <ErrorBoundary>
          <Report
            open={Boolean(report)}
            ownerId={(report || {}).ownerId || ''}
            objectId={(report || {}).commentId || -1}
            onClose={this.handleReportClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <div>
            {comments.comments.length > 1 ? <Button
              className={classes.viewMore}
              color="secondary"
              onClick={this.viewMoreComment}
            >
              {!loadViewMoreComment ? 'View more comments' : 'View less comments'}
            </Button> : null}
          </div>
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ViewNotes));
