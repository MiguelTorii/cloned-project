/* eslint-disable func-names */
// @flow

import React, { Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import type {
  UserProfile,
  About,
  UserStatistic,
  FeedItem,
  StudyCircle
} from '../../types/models';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import {
  getUserProfile,
  updateProfile,
  updateUserProfileUrl,
  getStudyCircle
} from '../../api/user';
import { addToStudyCircle, removeFromStudyCircle } from '../../api/posts';
import { getPresignedURL } from '../../api/media';
import { fetchFeedv2 } from '../../api/feed';
import * as signInActions from '../../actions/sign-in';
import * as chatActions from '../../actions/chat';
import * as feedActions from '../../actions/feed';
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';
import ProfileHeader from '../../components/Profile/header';
import ProfileAbout from '../../components/Profile/about';
import ProfileSeasons from '../../components/Profile/seasons';
import ProfilePosts from '../../components/Profile/posts';
import ProfileEdit from '../../components/ProfileEdit';
import StudyCircleDialog from '../../components/StudyCircleDialog';
import ErrorBoundary from '../ErrorBoundary';
import { processSeasons } from './utils';
import { logEvent } from '../../api/analytics';

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
  userId: string,
  edit: boolean,
  push: Function,
  checkUserSession: Function,
  openChannelWithEntity: Function,
  updateBookmark: Function
};

type State = {
  userProfile: UserProfile,
  about: Array<About>,
  userStatistics: Array<UserStatistic>,
  feed: Array<FeedItem>,
  bookmarks: Array<FeedItem>,
  isLoading: boolean,
  chatLoading: boolean,
  error: boolean,
  edit: boolean,
  uploading: boolean,
  tab: number,
  feedId: ?number,
  report: ?Object,
  deletePost: ?Object,
  studyCircle: boolean,
  isStudyCircleLoading: boolean,
  loading: boolean,
  circle: StudyCircle
};

class Profile extends React.PureComponent<Props, State> {
  state = {
    userProfile: {
      userId: '',
      firstName: '',
      lastName: '',
      grade: 0,
      hours: 0,
      inStudyCircle: false,
      joined: '',
      points: 0,
      rank: 0,
      school: '',
      state: '',
      userProfileUrl: ''
    },
    about: [],
    userStatistics: [],
    feed: [],
    bookmarks: [],
    isLoading: true,
    chatLoading: false,
    error: false,
    edit: false,
    uploading: false,
    tab: 0,
    feedId: null,
    report: null,
    deletePost: null,
    studyCircle: false,
    isStudyCircleLoading: false,
    loading: false,
    circle: []
  };

  componentDidMount = () => {
    this.handleGetProfile();
    this.handleFetchFeed();
    this.handleFetchBookmarks();
    const { edit } = this.props;
    this.setState({ edit });
  };

  handleGetProfile = async () => {
    try {
      const { userId } = this.props;
      if (userId !== '') {
        const { userProfile, about, userStatistics } = await getUserProfile({
          userId
        });

        this.setState({
          userProfile,
          about,
          userStatistics,
          isLoading: false
        });
      }
    } catch (err) {
      this.setState({ error: true, isLoading: false });
    }
  };

  handleFetchFeed = () => {
    const { userId } = this.props;
    if (userId !== '') {
      fetchFeedv2({
        userId
      }).then(feed => {
        this.setState({ feed });
      });
    }
  };

  handleFetchBookmarks = () => {
    const {
      user: {
        data: { userId: ownId }
      },
      userId
    } = this.props;
    if (ownId === userId && userId !== '') {
      fetchFeedv2({
        userId,
        bookmarked: true
      }).then(bookmarks => {
        this.setState({ bookmarks });
      });
    }
  };

  handleOpenEdit = () => {
    this.setState({ edit: true });
  };

  handleCloseEdit = () => {
    this.setState({ edit: false });
  };

  handleSubmit = async fields => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.handleCloseEdit();
    this.setState({ isLoading: true });
    try {
      await updateProfile({ userId, fields });
    } finally {
      this.handleGetProfile();
    }
  };

  handleUpdateProfileImage = async file => {
    const {
      user: {
        data: { userId }
      },
      checkUserSession
    } = this.props;
    this.setState({ uploading: true });
    try {
      const result = await getPresignedURL({
        userId,
        type: 2,
        mediaType: file.type
      });

      const { mediaId, url } = result;

      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      await updateUserProfileUrl({ userId, mediaId });
      // eslint-disable-next-line func-names
      await setTimeout(function() {}, 1000);
      await this.handleGetProfile();
      checkUserSession();
    } finally {
      this.setState({ uploading: false });
    }
  };

  handleStartChat = () => {
    const { openChannelWithEntity } = this.props;
    const {
      userProfile: { userId, firstName, lastName }
    } = this.state;
    this.setState({ chatLoading: true });
    openChannelWithEntity({
      entityId: userId,
      entityFirstName: firstName,
      entityLastName: lastName,
      entityVideo: false
    });
    setTimeout(() => {
      this.setState({ chatLoading: false });
    }, 2000);
  };

  handleStartVideo = () => {
    const { openChannelWithEntity } = this.props;
    const {
      userProfile: { userId, firstName, lastName }
    } = this.state;
    this.setState({ chatLoading: true });
    openChannelWithEntity({
      entityId: userId,
      entityFirstName: firstName,
      entityLastName: lastName,
      entityVideo: true
    });
    setTimeout(() => {
      this.setState({ chatLoading: false });
    }, 2000);
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  handleShare = ({ feedId }: { feedId: number }) => {
    this.setState({ feedId });
  };

  handleShareClose = () => {
    this.setState({ feedId: null });
  };

  handleBookmark = ({
    feedId,
    bookmarked
  }: {
    feedId: number,
    bookmarked: boolean
  }) => {
    const {
      user: {
        data: { userId }
      },
      updateBookmark
    } = this.props;

    updateBookmark({ feedId, userId, bookmarked });
  };

  handleReport = ({ feedId, ownerId }) => {
    this.setState({ report: { feedId, ownerId } });
  };

  handleReportClose = () => {
    this.setState({ report: null });
  };

  handleDelete = ({ feedId }) => {
    this.setState({ deletePost: { feedId } });
  };

  handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    if (deleted && deleted === true) {
      this.handleFetchFeed();
    }
    this.setState({ deletePost: null });
  };

  handleStudyCircle = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      userProfile: { userId: ownerId, inStudyCircle }
    } = this.state;
    try {
      this.setState({ isStudyCircleLoading: true });
      if (!inStudyCircle) {
        await addToStudyCircle({ userId, classmateId: ownerId, feedId: null });
        logEvent({
          event: 'Profile- Added to Study Circle',
          props: { Source: 'Profile' }
        });
        this.setState({ studyCircle: true, loading: true });
        const circle = await getStudyCircle({ userId });
        this.setState({ circle });
      } else {
        await removeFromStudyCircle({
          userId,
          classmateId: ownerId,
          feedId: null
        });
        logEvent({
          event: 'Profile- Removed from Study Circle',
          props: { Source: 'Profile' }
        });
      }
    } finally {
      await this.handleGetProfile();
      this.setState({ isStudyCircleLoading: false, loading: false });
    }
  };

  handleStudyCircleClose = () => {
    this.setState({ studyCircle: false });
  };

  handleUserClick = ({ userId }: { userId: string }) => {
    const { push } = this.props;
    push(`/profile/${userId}`);
  };

  handlePostClick = ({
    typeId,
    postId,
    feedId
  }: {
    typeId: number,
    postId: number,
    feedId: number
  }) => () => {
    const { push } = this.props;
    push(`/feed?id=${feedId}`);
    switch (typeId) {
      case 3:
        push(`/flashcards/${postId}`);
        break;
      case 4:
        push(`/notes/${postId}`);
        break;
      case 5:
        push(`/sharelink/${postId}`);
        break;
      case 6:
        push(`/question/${postId}`);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      classes,
      user: { data: userData }
    } = this.props;
    const { segment = '', profileImage } = userData;
    const {
      userProfile,
      about,
      userStatistics,
      feed,
      bookmarks,
      isLoading,
      chatLoading,
      error,
      edit,
      uploading,
      tab,
      feedId,
      report,
      deletePost,
      studyCircle,
      loading,
      circle,
      isStudyCircleLoading
    } = this.state;
    const {
      userId,
      firstName,
      lastName,
      userProfileUrl,
      points,
      school,
      state,
      grade,
      joined
    } = userProfile;

    if (isLoading)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    if (error) return <Redirect to="/" />;
    const seasons = processSeasons(userStatistics);

    return (
      <Fragment>
        <div className={classes.root}>
          <Grid container alignItems="stretch">
            <Grid item xs={12} md={12}>
              <ErrorBoundary>
                <ProfileHeader
                  isMyProfile={userId === userData.userId}
                  firstName={firstName}
                  lastName={lastName}
                  userProfileUrl={userProfileUrl}
                  points={points}
                  thanks={
                    seasons.length > 0 ? seasons[seasons.length - 1].thanks : 0
                  }
                  bestAnswers={
                    seasons.length > 0
                      ? seasons[seasons.length - 1].bestAnswers
                      : 0
                  }
                  school={school}
                  state={state}
                  segment={segment}
                  grade={grade}
                  joined={joined}
                  chatLoading={chatLoading}
                  uploading={uploading}
                  tab={tab}
                  inStudyCircle={false}
                  isStudyCircleLoading={isStudyCircleLoading}
                  onStartChat={this.handleStartChat}
                  onStartVideo={this.handleStartVideo}
                  onUpdateProfileImage={this.handleUpdateProfileImage}
                  onChange={this.handleTabChange}
                  onStudyCircle={this.handleStudyCircle}
                />
              </ErrorBoundary>
            </Grid>
            <Grid item xs={12} md={12} hidden={tab !== 0}>
              <ErrorBoundary>
                <ProfileAbout
                  isMyProfile={userId === userData.userId}
                  about={about}
                  onOpenEdit={this.handleOpenEdit}
                />
              </ErrorBoundary>
            </Grid>
            <Grid item xs={12} md={12} hidden={tab !== 0}>
              <ErrorBoundary>
                <ProfileSeasons seasons={seasons} />
              </ErrorBoundary>
            </Grid>
            <Grid item xs={12} md={12} hidden={tab !== 1}>
              <ErrorBoundary>
                <ProfilePosts
                  userId={userData.userId}
                  posts={feed}
                  isMyProfile={userId === userData.userId}
                  onShare={this.handleShare}
                  onPostClick={this.handlePostClick}
                  onBookmark={this.handleBookmark}
                  onReport={this.handleReport}
                  onDelete={this.handleDelete}
                  onUserClick={this.handleUserClick}
                />
              </ErrorBoundary>
            </Grid>
            <Grid item xs={12} md={12} hidden={tab !== 2}>
              <ErrorBoundary>
                <ProfilePosts
                  userId={userData.userId}
                  posts={bookmarks}
                  isMyProfile={userId === userData.userId}
                  isBookmarks
                  onShare={this.handleShare}
                  onPostClick={this.handlePostClick}
                  onBookmark={this.handleBookmark}
                  onReport={this.handleReport}
                  onDelete={this.handleDelete}
                  onUserClick={this.handleUserClick}
                />
              </ErrorBoundary>
            </Grid>
          </Grid>
          <ErrorBoundary>
            <ProfileEdit
              key={`${userId}-${userProfileUrl}`}
              open={edit && userId === userData.userId}
              about={about}
              firstName={firstName}
              lastName={lastName}
              userProfileUrl={userProfileUrl}
              uploading={uploading}
              onClose={this.handleCloseEdit}
              onSubmit={this.handleSubmit}
              onUpdateProfileImage={this.handleUpdateProfileImage}
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <SharePost
            feedId={feedId}
            open={Boolean(feedId)}
            onClose={this.handleShareClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Report
            open={Boolean(report)}
            ownerId={(report || {}).ownerId || ''}
            objectId={(report || {}).feedId || -1}
            onClose={this.handleReportClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <DeletePost
            open={Boolean(deletePost)}
            feedId={(deletePost || {}).feedId || -1}
            onClose={this.handleDeleteClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <StudyCircleDialog
            open={studyCircle}
            name={`${firstName} ${lastName}`}
            loading={loading}
            userProfileUrl={profileImage}
            ownName={`${userData.firstName} ${userData.lastName}`}
            circle={circle}
            onClose={this.handleStudyCircleClose}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      checkUserSession: signInActions.checkUserSession,
      openChannelWithEntity: chatActions.openChannelWithEntity,
      updateBookmark: feedActions.updateBookmark
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
