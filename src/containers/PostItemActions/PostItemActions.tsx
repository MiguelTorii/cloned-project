import React, { Fragment } from 'react';
import PostActions from '../../components/PostItem/PostItemActions';
import StudyCircleDialog from '../../components/StudyCircleDialog/StudyCircleDialog';
import {
  updateThanks,
  addToStudyCircle,
  removeFromStudyCircle,
  updatePostView
} from '../../api/posts';
import { getStudyCircle } from '../../api/user';
import type { StudyCircle } from '../../types/models';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

type Props = {
  userId: string;
  feedId: number;
  postId: number;
  typeId: number;
  ownerId: string;
  name: string;
  userProfileUrl: string;
  thanked: boolean;
  inStudyCircle: boolean;
  questionsCount: number;
  thanksCount: number;
  viewCount: number;
  isQuestion?: boolean;
  ownName: string;
  isPost?: boolean;
  onReload: (...args: Array<any>) => any;
};

type State = {
  open: boolean;
  studyCircle: boolean;
  isThanksLoading: boolean;
  isStudyCircleLoading: boolean;
  loading: boolean;
  circle: StudyCircle;
};

class PostItemActions extends React.PureComponent<Props, State> {
  static defaultProps = {
    isQuestion: false
  };

  state: any = {
    studyCircle: false,
    isThanksLoading: false,
    isStudyCircleLoading: false,
    loading: false,
    circle: []
  };

  componentDidMount = () => {
    const { userId, postId, typeId } = this.props;
    updatePostView({
      userId,
      postId,
      typeId
    });
  };

  handleThanks = async () => {
    const { userId, postId, typeId, onReload } = this.props;

    try {
      this.setState({
        isThanksLoading: true
      });
      await updateThanks({
        userId,
        postId,
        typeId
      });
    } finally {
      this.setState({
        isThanksLoading: false
      });
      onReload();
    }
  };

  handleStudyCircle = async () => {
    const { userId, ownerId, feedId, inStudyCircle, onReload } = this.props;

    try {
      this.setState({
        isStudyCircleLoading: true
      });

      if (!inStudyCircle) {
        await addToStudyCircle({
          userId,
          classmateId: ownerId,
          feedId
        });
        logEvent({
          event: 'Feed- Added to Study Circle',
          props: {
            Source: 'Feed Post'
          }
        });
        this.setState({
          studyCircle: true,
          loading: true
        });
        const circle = await getStudyCircle({
          userId
        });
        this.setState({
          circle
        });
      } else {
        await removeFromStudyCircle({
          userId,
          classmateId: ownerId,
          feedId
        });
        logEvent({
          event: 'Feed- Removed from Study Circle',
          props: {
            Source: 'Feed Post'
          }
        });
      }
    } finally {
      this.setState({
        isStudyCircleLoading: false,
        loading: false
      });
      onReload();
    }
  };

  handleStudyCircleClose = () => {
    this.setState({
      studyCircle: false
    });
  };

  render() {
    const {
      userId,
      ownerId,
      thanked,
      inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount,
      name,
      userProfileUrl,
      isQuestion,
      ownName
    } = this.props;
    const { studyCircle, isThanksLoading, isStudyCircleLoading, loading, circle } = this.state;
    return (
      <>
        <ErrorBoundary>
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
            isQuestion={isQuestion}
            onThanks={this.handleThanks}
            onStudyCircle={this.handleStudyCircle}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <StudyCircleDialog
            open={studyCircle}
            name={name}
            loading={loading}
            userProfileUrl={userProfileUrl}
            circle={circle}
            ownName={ownName}
            onClose={this.handleStudyCircleClose}
          />
        </ErrorBoundary>
      </>
    );
  }
}

export default PostItemActions;
