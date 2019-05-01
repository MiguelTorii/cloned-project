// @flow

import React, { Fragment } from 'react';
import PostActions from '../../components/PostItem/PostItemActions';
import SharePost from '../SharePost';

type Props = {
  feedId: number,
  thanked: boolean,
  inStudyCircle: boolean,
  questionsCount: number,
  thanksCount: number,
  viewCount: number
};

type State = {
  open: boolean
};

class PostItemActions extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

  handleShare = () => {
    this.setState({ open: true });
  };

  handleThanks = () => {
    console.log('thanks');
  };

  handleStudyCircle = () => {
    console.log('study circle');
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      feedId,
      thanked,
      inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount
    } = this.props;
    const { open } = this.state;
    return (
      <Fragment>
        <PostActions
          thanked={thanked}
          inStudyCircle={inStudyCircle}
          questionsCount={questionsCount}
          thanksCount={thanksCount}
          viewCount={viewCount}
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
