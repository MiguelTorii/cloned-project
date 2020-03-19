// @flow

import React, { useState, useEffect } from 'react';
import update from 'immutability-helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { ShareLink } from '../../types/models';
import { getShareLink, bookmark } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';
import LinkPreview from '../../components/LinkPreview';
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
  sharelinkId: number,
  push: Function
};

const ViewShareLink = ({ classes, user, sharelinkId, push }: Props) => {
  const [shareLink, setShareLink] = useState(null)
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
    const sl = await getShareLink({ userId, sharelinkId });
    setShareLink(sl)
    const {
      postInfo: { feedId }
    } = sl;

    logEvent({
      event: 'Feed- View Link',
      props: { 'Internal ID': feedId }
    });
  };

  useEffect(() => {
    loadData()
  }, [sharelinkId])

  const handleBookmark = async () => {
    if (!shareLink) return;
    const { feedId, bookmarked } = shareLink;
    try {
      setShareLink({ ...shareLink, bookmarked: !bookmarked })
      await bookmark({ feedId, userId, remove: bookmarked });
    } catch (err) {
      setShareLink({ ...shareLink, bookmarked })
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


  if (!shareLink)
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
    postInfo: { userId: ownerId, questionsCount, thanksCount, viewCount },
    uri,
    readOnly,
    bookmarked
  } = shareLink;

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
              body={summary}
              title={title}
              bookmarked={bookmarked}
              roleId={roleId}
              role={role}
              onBookmark={handleBookmark}
              onReport={handleReport}
              onDelete={handleDelete}
              postId={postId}
              typeId={typeId}
              pushTo={push}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <LinkPreview uri={uri} />
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
)(withStyles(styles)(ViewShareLink));
