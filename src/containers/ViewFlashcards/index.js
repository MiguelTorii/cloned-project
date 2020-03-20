// @flow

import React, { useState, useEffect } from 'react';
import uuidv4 from 'uuid/v4';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
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
    padding: theme.spacing(2)
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

const ViewFlashcards = ({ classes, user, flashcardId, push }: Props) => {
  const [flashcards, setFlashcards] = useState(null)
  const [report, setReport] = useState(false)
  const [deletePost, setDeletePost] = useState(false)

  const {
    data: { 
      userId,
      firstName: myFirstName,
      lastName: myLastName,
      profileImage
    }
  } = user
    
  const loadData = async () => {
    // eslint-disable-next-line
    const { deck = [], ...flashcards } = await getFlashcards({
      userId,
      flashcardId
    });
    setFlashcards({
      ...flashcards,
      deck: deck.map(item => ({
        question: item.question,
        answer: item.answer,
        id: uuidv4()
      }))
    })

    const {
      postInfo: { feedId }
    } = flashcards;

    logEvent({
      event: 'Feed- View Flashcards',
      props: { 'Internal ID': feedId }
    });
  };

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [flashcardId])


  const handleBookmark = async () => {
    if (!flashcards) return;
    const { feedId, bookmarked } = flashcards;
    try {
      setFlashcards({ ...flashcards, bookmarked: !bookmarked })
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      setFlashcards({ ...flashcards, bookmarked })
    }
  };

  const handleReport = () => setReport(true)

  const handleReportClose = () => setReport(false)

  const handleDelete = () => setDeletePost(true)

  const handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    if (deleted && deleted === true) {
      push('/feed');
    }
    setDeletePost(false)
  };

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
    roleId,
    role,
    name,
    userProfileUrl,
    courseDisplayName,
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
              classroomName={courseDisplayName}
              created={created}
              pushTo={push}
              postId={postId}
              typeId={typeId}
              body={summary}
              title={title}
              bookmarked={bookmarked}
              roleId={roleId}
              role={role}
              onBookmark={handleBookmark}
              onReport={handleReport}
              onDelete={handleDelete}
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
              userProfileUrl={profileImage}
              thanked={thanked}
              inStudyCircle={inStudyCircle}
              questionsCount={questionsCount}
              thanksCount={thanksCount}
              viewCount={viewCount}
              ownName={`${myFirstName} ${myLastName}`}
              onReload={loadData}
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
              onClose={handleReportClose}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <DeletePost
              open={deletePost}
              feedId={feedId}
              onClose={handleDeleteClose}
            />
          </ErrorBoundary>
        </PostItem>
      </ErrorBoundary>
    </div>
  );
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
