// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import PostItemAddComment from '../../components/PostItem/PostItemAddComment';
import PostItemComment from '../../components/PostItem/PostItemComment';
import { getPostComments, createComment, thankComment } from '../../api/posts';
import type { Comments } from '../../types/models';
import { processComments } from './processComments';

type Props = {
  user: UserState,
  feedId: number,
  postId: number,
  typeId: number
};

type State = {
  comments: ?Comments,
  items: Array<Object>,
  isLoading: boolean
};

class ViewNotes extends React.PureComponent<Props, State> {
  state = {
    comments: null,
    items: [],
    isLoading: false
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
    }
  };

  handleDelete = () => {
    console.log('delete');
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
      user: {
        data: { userId, profileImage, firstName, lastName }
      }
    } = this.props;
    const { comments, items, isLoading } = this.state;
    if (!comments) return null;

    const name = `${firstName} ${lastName}`;
    return (
      <Fragment>
        <PostItemAddComment
          name={name}
          profileImageUrl={profileImage}
          onPostComment={this.handlePostComment}
        />
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <PostItemComment
              id={item.id}
              ownProfileUrl={profileImage}
              ownName={name}
              firstName={item.user.firstName}
              lastName={item.user.lastName}
              profileImageUrl={item.user.profileImageUrl}
              created={item.created}
              comment={item.comment}
              thanksCount={item.thanksCount}
              thanked={item.thanked}
              rootCommentId={item.id}
              isLoading={isLoading}
              isOwn={item.user.userId === userId}
              onPostComment={this.handlePostComment}
              onThanks={this.handleThanks}
              onDelete={this.handleDelete}
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
                isOwn={reply.user.userId === userId}
                isReply
                onPostComment={this.handlePostComment}
                onThanks={this.handleThanks}
                onDelete={this.handleDelete}
              />
            ))}
            {index + 1 < items.length && <Divider light />}
          </Fragment>
        ))}
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
)(ViewNotes);
