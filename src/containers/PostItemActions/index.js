// @flow

import React, { Fragment } from 'react';
import PostActions from '../../components/PostItem/PostItemActions';
import SharePost from '../SharePost';
import {
  updateThanks,
  addToStudyCircle,
  removeFromStudyCircle,
  updatePostView
} from '../../api/posts';
import { logEvent } from '../../api/analytics';

type Props = {
  userId: string,
  feedId: number,
  postId: number,
  typeId: number,
  ownerId: string,
  thanked: boolean,
  inStudyCircle: boolean,
  questionsCount: number,
  thanksCount: number,
  viewCount: number,
  onReload: Function
};

type State = {
  open: boolean,
  isThanksLoading: boolean,
  isStudyCircleLoading: boolean
};

class PostItemActions extends React.PureComponent<Props, State> {
  state = {
    open: false,
    isThanksLoading: false,
    isStudyCircleLoading: false
  };

  componentDidMount = () => {
    const { userId, postId, typeId } = this.props;
    updatePostView({ userId, postId, typeId });
  };

  handleShare = () => {
    this.setState({ open: true });
  };

  handleThanks = async () => {
    const { userId, postId, typeId, onReload } = this.props;
    try {
      this.setState({ isThanksLoading: true });
      await updateThanks({ userId, postId, typeId });
    } finally {
      this.setState({ isThanksLoading: false });
      onReload();
    }
  };

  handleStudyCircle = async () => {
    const { userId, ownerId, feedId, inStudyCircle, onReload } = this.props;
    try {
      this.setState({ isStudyCircleLoading: true });
      if (!inStudyCircle) {
        await addToStudyCircle({ userId, classmateId: ownerId, feedId });
        logEvent({
          event: 'Feed- Added to Study Circle',
          props: { Source: 'Feed Post' }
        });
      } else {
        await removeFromStudyCircle({ userId, classmateId: ownerId, feedId });
        logEvent({
          event: 'Feed- Removed from Study Circle',
          props: { Source: 'Feed Post' }
        });
      }
    } finally {
      this.setState({ isStudyCircleLoading: false });
      onReload();
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      userId,
      ownerId,
      feedId,
      thanked,
      inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount
    } = this.props;
    const { open, isThanksLoading, isStudyCircleLoading } = this.state;

    return (
      <Fragment>
        <PostActions
          thanked={thanked}
          isOwner={Boolean(Number(userId) === Number(ownerId))}
          inStudyCircle={inStudyCircle}
          questionsCount={questionsCount}
          thanksCount={thanksCount}
          viewCount={viewCount}
          isThanksLoading={isThanksLoading}
          isStudyCircleLoading={isStudyCircleLoading}
          noThanks={userId === ownerId}
          onShare={this.handleShare}
          onThanks={this.handleThanks}
          onStudyCircle={this.handleStudyCircle}
        />
        <SharePost feedId={feedId} open={open} onClose={this.handleClose} />
      </Fragment>
    );
  }
}

export default PostItemActions;
