// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import PostItemAddComment from '../../components/PostItem/PostItemAddComment';
import PostItemComment from '../../components/PostItem/PostItemComment';
import Report from '../Report';
import {
  getPostComments,
  createComment,
  thankComment,
  bestAnswer,
  deleteComment
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
    report: null
  };

  componentDidMount = () => {
    this.loadData();
  };

  handlePostComment = async ({
    comment,
    rootCommentId,
    parentCommentId
  }: {
    comment: string,
    rootCommentId: number,
    parentCommentId: number
  }) => {
    if (comment.trim() === '') return;
    const {
      user: {
        data: { userId }
      },
      postId,
      typeId
    } = this.props;
    this.setState({ isLoading: true });
    try {
      await createComment({
        userId,
        postId,
        typeId,
        comment,
        rootCommentId,
        parentCommentId
      });
      await this.loadData();
    } finally {
      this.setState({ isLoading: false });
      logEvent({
        event: 'Feed- Ask Question',
        props: {}
      });
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

  handleBestAnswer = async ({ commentId }: { commentId: number }) => {
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
    this.setState({ comments: result, items });
  };

  render() {
    const {
      classes,
      user: {
        data: { userId, profileImage, firstName, lastName }
      },
      isQuestion,
      readOnly,
      hasBestAnswer,
      isOwner
    } = this.props;
    const { comments, items, isLoading, report } = this.state;
    if (!comments) return null;

    const name = `${firstName} ${lastName}`;
    return (
      <Fragment>
        <Divider light className={classes.divider} />
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
            onPostComment={this.handlePostComment}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <PostItemComment
                isTutor={item.isTutor}
                id={item.id}
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
                onThanks={this.handleThanks}
                onDelete={this.handleDelete}
                onReport={this.handleReport}
                onBestAnswer={this.handleBestAnswer}
              />
              {item.children.map(reply => (
                <PostItemComment
                  key={reply.id}
                  id={reply.id}
                  ownProfileUrl={profileImage}
                  ownName={name}
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
                  onThanks={this.handleThanks}
                  onDelete={this.handleDelete}
                  onReport={this.handleReport}
                  onBestAnswer={this.handleBestAnswer}
                />
              ))}
              {index + 1 < items.length && <Divider light />}
            </Fragment>
          ))}
        </ErrorBoundary>
        <ErrorBoundary>
          <Report
            open={Boolean(report)}
            ownerId={(report || {}).ownerId || ''}
            objectId={(report || {}).commentId || -1}
            onClose={this.handleReportClose}
          />
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
