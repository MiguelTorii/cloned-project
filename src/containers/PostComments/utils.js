/* eslint-disable import/prefer-default-export */
// @flow

export const processComments = (comments: Array<Object>) => {
  const commentsById = new Map();
  const commentsTree = [];
  comments.forEach((comment) => {
    commentsById.set(comment.id, { ...comment, children: [] });
  });

  commentsById.forEach((comment) => {
    if (comment.rootCommentId) {
      const rootComment = commentsById.get(comment.rootCommentId);
      const parentComment = commentsById.get(comment.parentCommentId);
      if (rootComment && rootComment.children) {
        // eslint-disable-next-line no-param-reassign
        comment.replyTo = parentComment ? parentComment.user.firstName : '';
        rootComment.children.push(comment);
      }
    } else {
      commentsTree.push(comment);
    }
  });

  return commentsTree;
};
