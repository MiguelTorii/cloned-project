// @flow

import React from 'react';
import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Flashcards } from '../../types/models';
import { getFlashcards, bookmark } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import FlashcardViewer from '../../components/FlashcardViewer';
import Flashcard from '../../components/Flashcard';
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
    padding: theme.spacing.unit * 2
  },
  flashcards: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  flashcardId: number,
  push: Function
};

type State = {
  flashcards: ?Flashcards,
  report: boolean,
  deletePost: boolean
};

class ViewFlashcards extends React.PureComponent<Props, State> {
  state = {
    flashcards: null,
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
    const { flashcards } = this.state;
    if (!flashcards) return;
    const { feedId, bookmarked } = flashcards;
    try {
      const newState = update(this.state, {
        flashcards: {
          bookmarked: { $set: !bookmarked }
        }
      });
      this.setState(newState);
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      const newState = update(this.state, {
        flashcards: {
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
      flashcardId
    } = this.props;
    const { deck = [], ...flashcards } = await getFlashcards({
      userId,
      flashcardId
    });
    this.setState({
      flashcards: {
        ...flashcards,
        deck: deck.map(item => ({
          question: item.question,
          answer: item.answer,
          id: uuidv4()
        }))
      }
    });
    const {
      postInfo: { feedId }
    } = flashcards;

    logEvent({
      event: 'Feed- View Flashcards',
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
    const { flashcards, report, deletePost } = this.state;

    if (!flashcards)
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
      summary,
      title,
      thanked,
      inStudyCircle,
      deck,
      postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount },
      readOnly,
      bookmarked
    } = flashcards;

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
                classroomName={
                  subject !== '' ? `${subject} ${classroomName}` : classroomName
                }
                created={created}
                body={summary}
                title={title}
                bookmarked={bookmarked}
                onBookmark={this.handleBookmark}
                onReport={this.handleReport}
                onDelete={this.handleDelete}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <FlashcardViewer title={title} flashcards={deck} />
            </ErrorBoundary>
            <ErrorBoundary>
              <div className={classes.flashcards}>
                {// $FlowIgnore
                deck.map(({ id, question, answer }, index) => (
                  <Flashcard
                    key={id}
                    index={index + 1}
                    question={question}
                    answer={answer}
                  />
                ))}
              </div>
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
                readOnly={readOnly}
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
)(withStyles(styles)(ViewFlashcards));
