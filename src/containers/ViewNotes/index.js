// @flow

import React, { useCallback, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush, goBack } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
// import type { PhotoNote } from '../../types/models';
import { getNotes, bookmark } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';
import ImageGallery from '../../components/ImageGallery';
import PdfGallery from '../../components/PdfGallery';
import PostTags from '../PostTags';
import Report from '../Report';
import DeletePost from '../DeletePost';
import ErrorBoundary from '../ErrorBoundary';

const styles = (theme) => ({
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
  noteId: number,
  push: Function,
  pop: Function
};

const ViewNotes = ({ pop, classes, noteId, push, user, router }: Props) => {
  const [photoNote, setPhotoNote] = useState(null);
  const [report, setReport] = useState(false);
  const [deletePost, setDeletePost] = useState(false);

  const {
    expertMode,
    data: { userId, firstName: myFirstName, lastName: myLastName, profileImage }
  } = user;

  const loadData = useCallback(async () => {
    const pn = await getNotes({ userId, noteId });
    setPhotoNote(pn);
    const {
      postInfo: { feedId }
    } = pn;

    logEvent({
      event: 'Feed- View Photo Note',
      props: { 'Internal ID': feedId }
    });
  }, [noteId, userId]);

  useEffect(() => {
    setPhotoNote(null);
    loadData();
  }, [loadData, noteId]);

  const handleBookmark = async () => {
    if (!photoNote) return;
    const { feedId, bookmarked } = photoNote;
    try {
      setPhotoNote({ ...photoNote, bookmarked: !bookmarked });
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      setPhotoNote({ ...photoNote, bookmarked });
    }
  };

  const handleReport = () => {
    setReport(true);
  };

  const handleReportClose = () => {
    setReport(true);
  };

  const handleDelete = () => {
    setDeletePost(true);
  };

  const handleDeleteClose = ({ deleted }: { deleted: ?boolean }) => {
    if (deleted && deleted === true) {
      push('/feed');
    }
    setDeletePost(false);
  };

  if (!photoNote)
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
    classId,
    role,
    name,
    userProfileUrl,
    courseDisplayName,
    created,
    body,
    title,
    notes,
    thanked,
    inStudyCircle,
    postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount },
    readOnly,
    bookmarked
  } = photoNote;

  const notesMap = notes.map((item) => ({
    src: item.fullNoteUrl,
    fileName: item.note,
    thumbnail: item.noteUrl
  }));

  const images = notesMap.filter((nm) => !nm.src.includes('.pdf'));
  const pdfs = notesMap.filter((nm) => nm.src.includes('.pdf'));

  return (
    <div className={classes.root}>
      <ErrorBoundary>
        <PostItem feedId={feedId}>
          <ErrorBoundary>
            <PostItemHeader
              hideShare
              feedId={feedId}
              expertMode={expertMode}
              pushTo={push}
              router={router}
              pop={pop}
              postId={postId}
              typeId={typeId}
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
              role={role}
              onBookmark={handleBookmark}
              onReport={handleReport}
              onDelete={handleDelete}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ImageGallery images={images} />
          </ErrorBoundary>
          <ErrorBoundary>
            <PdfGallery pdfs={pdfs} title={title} />
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
              classId={classId}
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
};

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
)(withStyles(styles)(ViewNotes));
