// @flow

import React, { Fragment } from 'react';
import PostItemAddComment from '../../components/PostItem/PostItemAddComment';
import PostItemComment from '../../components/PostItem/PostItemComment';
import { getPostComments, createComment } from '../../api/posts';
import type { Comments } from '../../types/models';
import { processComments } from './processComments';

type Props = {
  userId: string,
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

  componentDidMount = async () => {
    const { userId, postId, typeId } = this.props;
    const result = await getPostComments({ userId, postId, typeId });
    const items = processComments(result.comments);
    this.setState({ comments: result, items });
  };

  handlePostComment = async ({ comment, rootCommentId, parentCommentId }) => {
    if (comment.trim() === '') return;
    const { userId, postId, typeId } = this.props;
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
      const result = await getPostComments({ userId, postId, typeId });
      const items = processComments(result.comments);
      this.setState({ comments: result, items });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { comments, items, isLoading } = this.state;
    if (!comments) return null;
    console.log(items);
    return (
      <Fragment>
        <PostItemAddComment onPostComment={this.handlePostComment} />
        {items.map(item => (
          <Fragment key={item.id}>
            <PostItemComment
              id={item.id}
              firstName={item.user.firstName}
              lastName={item.user.lastName}
              profileImageUrl={item.user.profileImageUrl}
              created={item.created}
              comment={item.comment}
              thanksCount={item.thanksCount}
              thanked={item.thanked}
              rootCommentId={item.id}
              isLoading={isLoading}
              onPostComment={this.handlePostComment}
            />
            {item.children.map(reply => (
              <PostItemComment
                key={reply.id}
                id={reply.id}
                firstName={reply.user.firstName}
                lastName={reply.user.lastName}
                profileImageUrl={reply.user.profileImageUrl}
                created={reply.created}
                comment={reply.comment}
                thanksCount={reply.thanksCount}
                thanked={reply.thanked}
                rootCommentId={item.id}
                onPostComment={this.handlePostComment}
                isReply
              />
            ))}
          </Fragment>
        ))}
      </Fragment>
    );
  }
}

export default ViewNotes;
