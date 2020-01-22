// @flow

import React from 'react';
import update from 'immutability-helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Question } from '../../types/models';
import { getQuestion, bookmark } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';
import PostTags from '../PostTags';
import Report from '../Report';
import DeletePost from '../DeletePost';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  },
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  user: UserState,
  questionId: number,
  push: Function
};

type State = {
  question: ?Question,
  report: boolean,
  deletePost: boolean
};

class ViewQuestion extends React.PureComponent<Props, State> {
  state = {
    question: null,
    report: false,
    deletePost: false
  };

  componentDidMount = async () => {
    this.loadData();
  };

  handleBookmark = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const { question } = this.state;
    if (!question) return;
    const { feedId, bookmarked } = question;
    try {
      const newState = update(this.state, {
        question: {
          bookmarked: { $set: !bookmarked }
        }
      });
      this.setState(newState);
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      const newState = update(this.state, {
        question: {
          bookmarked: { $set: bookmarked }
        }
      });
      this.setState(newState);
    }
  };

  handleReport = () => {
    this.setState({ report: true });
  };

  handleReportClose = () => {
    this.setState({ report: false });
  };

  handleDelete = () => {
    this.setState({ deletePost: true });
  };

  handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    if (deleted && deleted === true) {
      const { push } = this.props;
      push('/feed');
    }
    this.setState({ deletePost: false });
  };

  loadData = async () => {
    const {
      user: {
        data: { userId }
      },
      questionId
    } = this.props;
    const question = await getQuestion({ userId, questionId });
    this.setState({ question });
    const {
      postInfo: { feedId }
    } = question;

    logEvent({
      event: 'Feed- View Question',
      props: { 'Internal ID': feedId }
    });
  };

  render() {
    const {
      classes,
      user: {
        data: {
          userId,
          firstName: myFirstName,
          lastName: myLastName,
          profileImage
        }
      }
    } = this.props;
    const { question, report, deletePost } = this.state;

    if (!question)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    const {
      feedId,
      postId,
      typeId,
      roleId,
      name,
      userProfileUrl,
      courseDisplayName,
      created,
      body,
      title,
      thanked,
      inStudyCircle,
      postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount },
      readOnly,
      bookmarked,
      bestAnswer
    } = question;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <PostItem feedId={feedId}>
            <ErrorBoundary>
              <PostItemHeader
                currentUserId={userId}
                userId={ownerId}
                name={name}
                userProfileUrl={userProfileUrl}
                classroomName={courseDisplayName}
                created={created}
                body={body}
                title={title}
                isMarkdown
                bookmarked={bookmarked}
                roleId={roleId}
                onBookmark={this.handleBookmark}
                onReport={this.handleReport}
                onDelete={this.handleDelete}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostTags userId={userId} feedId={feedId} />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostItemActions
                userId={userId}
                ownerId={ownerId}
                feedId={feedId}
                postId={postId}
                typeId={typeId}
                name={name}
                userProfileUrl={profileImage}
                thanked={thanked}
                inStudyCircle={inStudyCircle}
                questionsCount={questionsCount}
                thanksCount={thanksCount}
                viewCount={viewCount}
                isQuestion
                ownName={`${myFirstName} ${myLastName}`}
                onReload={this.loadData}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostComments
                feedId={feedId}
                postId={postId}
                typeId={typeId}
                isQuestion
                hasBestAnswer={bestAnswer}
                readOnly={readOnly}
                isOwner={userId === ownerId}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <Report
                open={report}
                ownerId={ownerId}
                objectId={feedId}
                onClose={this.handleReportClose}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <DeletePost
                open={deletePost}
                feedId={feedId}
                onClose={this.handleDeleteClose}
              />
            </ErrorBoundary>
          </PostItem>
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ViewQuestion));
