// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Question } from '../../types/models';
import { getQuestion } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';
import PostTags from '../PostTags';
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
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState,
  questionId: number
};

type State = {
  question: ?Question
};

class ViewQuestion extends React.PureComponent<Props, State> {
  state = {
    question: null
  };

  componentDidMount = async () => {
    this.loadData();
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
        data: { userId }
      }
    } = this.props;
    const { question } = this.state;

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
      name,
      userProfileUrl,
      subject,
      classroomName,
      created,
      body,
      title,
      thanked,
      inStudyCircle,
      postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount },
      readOnly
    } = question;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <PostItem>
            <ErrorBoundary>
              <PostItemHeader
                userId={ownerId}
                name={name}
                userProfileUrl={userProfileUrl}
                classroomName={
                  subject !== '' ? `${subject} ${classroomName}` : classroomName
                }
                created={created}
                body={body}
                title={title}
                isMarkdown
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
                userProfileUrl={userProfileUrl}
                thanked={thanked}
                inStudyCircle={inStudyCircle}
                questionsCount={questionsCount}
                thanksCount={thanksCount}
                viewCount={viewCount}
                onReload={this.loadData}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <PostComments
                feedId={feedId}
                postId={postId}
                typeId={typeId}
                isQuestion
                readOnly={readOnly}
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

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ViewQuestion));
