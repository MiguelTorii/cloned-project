// @flow

import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack, push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
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
  push: Function,
  pop: Function,
  router: Object
};

const ViewQuestion = ({ classes, user, questionId, push, router, pop }: Props) => { 
  const [question, setQuestion] = useState(null)
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
    const question = await getQuestion({ userId, questionId });
    setQuestion(question)
    const {
      postInfo: { 
        feedId
      }
    } = question;

    logEvent({
      event: 'Feed- View Question',
      props: { 'Internal ID': feedId }
    });
  };

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [questionId])

  const handleBookmark = async () => {
    if (!question) return;
    const { feedId, bookmarked } = question;
    try {
      setQuestion({ ...question, bookmarked: !bookmarked })
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      setQuestion({ ...question, bookmarked })
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
    role,
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
              action={router.action}
              pop={pop}
              pushTo={push}
              postId={postId}
              typeId={typeId}
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
              role={role}
              onBookmark={handleBookmark}
              onReport={handleReport}
              onDelete={handleDelete}
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
              onReload={loadData}
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

const mapStateToProps = ({ user, router }: StoreState): {} => ({
  user,
  router
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      pop: goBack
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ViewQuestion));
