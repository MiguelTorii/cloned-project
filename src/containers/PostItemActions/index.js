// @flow

import React from 'react';
import PostActions from '../../components/PostItem/PostItemActions';

type Props = {
  thanked: boolean,
  inStudyCircle: boolean,
  questionsCount: number,
  thanksCount: number,
  viewCount: number
};

class PostItemActions extends React.PureComponent<Props> {
  handleShare = () => {};

  handleThanks = () => {};

  handleStudyCircle = () => {};

  render() {
    const {
      thanked,
      inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount
    } = this.props;
    return (
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
    );
  }
}

export default PostItemActions;
