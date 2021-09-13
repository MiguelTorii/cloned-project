/* eslint-disable func-names */
// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import Hidden from '@material-ui/core/Hidden';
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
import { fetchFeedv2 } from '../../api/feed';
import * as signInActions from '../../actions/sign-in';
import * as chatActions from '../../actions/chat';
import * as feedActions from '../../actions/feed';
import SharePost from '../SharePost/SharePost';
import Report from '../Report/Report';
import DeletePost from '../DeletePost/DeletePost';
import ProfileHeader from '../../components/Profile/header';
// import ProfileAbout from '../../components/Profile/about';
// import ProfileSeasons from '../../components/Profile/seasons';
import ProfilePosts from '../../components/Profile/posts';
import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';
import StudyCircleDialog from '../../components/StudyCircleDialog/StudyCircleDialog';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { processSeasons } from './utils';
import { logEvent } from '../../api/analytics';
import PointsHistoryCard from '../../components/Profile/PointsHistoryCard';
import PointsHistoryDetails from '../../components/PointsHistoryDetails/PointsHistoryDetails';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import { updateProfileImage, uploadMedia } from '../../actions/user';
import { UPLOAD_MEDIA_TYPES } from '../../constants/app';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit',
    paddingTop: theme.spacing(2)
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
  userId: string,
  edit: boolean,
  push: Function,
  checkUserSession: Function,
  openChannelWithEntity: Function,
  location: {
    search: string,
    pathname: string
  },
  updateBookmark: Function,
  updateProfileImage: Function
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
  tab: number,
  feedId: ?number,
  report: ?Object,
  deletePost: ?Object,
  studyCircle: boolean,
  isStudyCircleLoading: boolean,
  loading: boolean,
  circle: StudyCircle,
  page: string,
  isEditingProfile: boolean,
  isUpdatingProfile: boolean
};

const PROFILE_PAGES = {
  index: 'index',
  points_history: 'points_history'
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
    tab: 1,
    feedId: null,
    report: null,
    deletePost: null,
    studyCircle: false,
    isStudyCircleLoading: false,
    loading: false,
    circle: [],
    page: PROFILE_PAGES.index,
    isEditingProfile: false,
    isUpdatingProfile: false
  };

  componentDidMount = () => {
    this.handleGetProfile();
    this.handleFetchFeed();
    this.handleFetchBookmarks();
    const {
      edit,
      match: { params }
    } = this.props;

    if (params.tab) {
      this.setState({ tab: Number(params.tab) });
    }

    this.setState({ edit });
  };

  handleGetProfile = async () => {
    try {
      const {
        userId,
        user: {
          data: { userId: myId }
        },
        updateProfileImage
      } = this.props;
      if (userId !== '') {
        const { userProfile, about, userStatistics } = await getUserProfile({
          userId
        });

        if (userId === myId) {
          updateProfileImage(userProfile.userProfileUrl);
        }

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
      }).then((feed) => {
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
        sectionId: '',
        bookmarked: true
      }).then((bookmarks) => {
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

  handleSubmit = async (fields) => {
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
    bookmarked: boolean // `bookmarked` means if the post is currently bookmarked or not. can confuse the meaning.
  }) => {
    const {
      user: {
        data: { userId }
      },
      updateBookmark
    } = this.props;

    updateBookmark({ feedId, userId, bookmarked });

    // Update Local State
    const { bookmarks, feed } = this.state;
    const postIndex = feed.findIndex((item) => item.feedId === feedId);

    let newBookmarks = bookmarks;
    let newFeeds = feed;

    if (bookmarked) {
      // If a bookmark is removed, the post is removed from the bookmarks
      newBookmarks = newBookmarks.filter((item) => item.feedId !== feedId);
    } else {
      // If a bookmark is added, the post is added to the bookmarks. In this case, postIndex must exist.
      if (postIndex < 0) throw new Error('Post must exist');
      newBookmarks = [feed[postIndex], ...bookmarks];
    }

    // Update bookmark from the post
    if (postIndex >= 0) {
      feed[postIndex].bookmarked = !bookmarked;
      newFeeds = [...feed];
    }

    this.setState({
      bookmarks: newBookmarks,
      feed: newFeeds
    });
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
      // Reloading all feed again is time waste, we are doing it in other way.
      // this.handleFetchFeed();

      // Update Local State
      const { deletePost, bookmarks, feed } = this.state;
      this.setState({
        bookmarks: bookmarks.filter(
          (item) => item.feedId !== deletePost.feedId
        ),
        feed: feed.filter((item) => item.feedId !== deletePost.feedId)
      });
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
          event: 'Feed- Added to Study Circle',
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
          event: 'Feed- Removed from Study Circle',
          props: { Source: 'Profile' }
        });
      }
    } finally {
      await this.handleGetProfile();
      this.setState({ isStudyCircleLoading: false, loading: false });
    }
  };

  handleEditProfileOpen = () => {
    this.setState({
      isEditingProfile: true
    });
  };

  handleStudyCircleClose = () => {
    this.setState({ studyCircle: false });
  };

  handleUserClick = ({ userId }: { userId: string }) => {
    const { push } = this.props;
    push(`/profile/${userId}`);
  };

  handlePostClick =
    ({ typeId, postId }: { typeId: number, postId: number, feedId: number }) =>
    () => {
      const { push } = this.props;
      let url = '';
      switch (typeId) {
        case 3:
          url = `/flashcards/${postId}`;
          break;
        case 4:
          url = `/notes/${postId}`;
          break;
        case 5:
          url = `/sharelink/${postId}`;
          break;
        case 6:
          url = `/question/${postId}`;
          break;
        case 8:
          url = `/post/${postId}`;
          break;
        default:
          throw new Error('unknown post type');
      }
      push(`${url}?from=profile`);
    };

  updateAvatar = async (imageData) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    const { mediaId } = await uploadMedia(
      userId,
      UPLOAD_MEDIA_TYPES.PROFILE_IMAGE,
      imageData
    );
    await updateUserProfileUrl({ userId, mediaId });
  };

  handleSaveProfile = async (avatar, fields) => {
    this.setState({
      isUpdatingProfile: true
    });

    if (avatar !== undefined) {
      if (avatar === null) {
        // Remove the avatar from the user profile
      } else {
        await this.updateAvatar(avatar);
      }
    }

    const { userId } = this.props.user.data;

    await updateProfile({
      userId,
      fields: [
        {
          field: 'profile_bio',
          updated_value: fields.bio
        }
      ]
    });

    await this.handleGetProfile();

    this.setState({
      isEditingProfile: false,
      isUpdatingProfile: false
    });
  };

  switchPage = (page) => {
    this.setState({ page });
  };

  renderIndex() {
    const {
      classes,
      push,
      user: {
        data: userData,
        userClasses: { classList }
      }
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
      tab,
      feedId,
      report,
      deletePost,
      studyCircle,
      loading,
      circle,
      isStudyCircleLoading,
      isEditingProfile,
      isUpdatingProfile
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
      joined,
      role,
      roleId,
      isOnline
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
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Grid container alignItems="stretch">
                <Grid item xs={12} md={12}>
                  <ErrorBoundary>
                    <ProfileHeader
                      about={about}
                      isMyProfile={userId === userData.userId}
                      firstName={firstName}
                      lastName={lastName}
                      userProfileUrl={userProfileUrl}
                      points={points}
                      thanks={
                        seasons.length > 0
                          ? seasons[seasons.length - 1].thanks
                          : 0
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
                      tab={tab}
                      inStudyCircle={false}
                      isStudyCircleLoading={isStudyCircleLoading}
                      isCirclein={userId === '0'}
                      isOnline={isOnline}
                      role={role}
                      roleId={roleId}
                      profile={userProfile}
                      onStartChat={this.handleStartChat}
                      onStartVideo={this.handleStartVideo}
                      onChange={this.handleTabChange}
                      onStudyCircle={this.handleStudyCircle}
                      onEditProfile={this.handleEditProfileOpen}
                      onSeePointsHistoryDetails={() =>
                        this.switchPage(PROFILE_PAGES.points_history)
                      }
                    />
                  </ErrorBoundary>
                </Grid>
                {/* <Grid item xs={12} md={12} hidden={tab !== 0}> */}
                {/*  <ErrorBoundary> */}
                {/*    <ProfileAbout */}
                {/*      isMyProfile={userId === userData.userId} */}
                {/*      about={about} */}
                {/*      onOpenEdit={this.handleOpenEdit} */}
                {/*    /> */}
                {/*  </ErrorBoundary> */}
                {/* </Grid> */}
                {/* <Grid item xs={12} md={12} hidden={tab !== 0}> */}
                {/* <ErrorBoundary> */}
                {/* <ProfileSeasons seasons={seasons} /> */}
                {/* </ErrorBoundary> */}
                {/* </Grid> */}
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
                      pushTo={push}
                      onDelete={this.handleDelete}
                      onUserClick={this.handleUserClick}
                      classList={classList}
                    />
                  </ErrorBoundary>
                </Grid>
                <Grid item xs={12} md={12} hidden={tab !== 2}>
                  <ErrorBoundary>
                    <ProfilePosts
                      userId={userData.userId}
                      posts={bookmarks}
                      pushTo={push}
                      isMyProfile={userId === userData.userId}
                      isBookmarks
                      onShare={this.handleShare}
                      onPostClick={this.handlePostClick}
                      onBookmark={this.handleBookmark}
                      onReport={this.handleReport}
                      onDelete={this.handleDelete}
                      onUserClick={this.handleUserClick}
                      classList={classList}
                    />
                  </ErrorBoundary>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={4}>
                <Hidden mdDown>
                  <Grid item xs={12}>
                    <PointsHistoryCard
                      profile={userProfile}
                      onSeeMore={() =>
                        this.switchPage(PROFILE_PAGES.points_history)
                      }
                    />
                  </Grid>
                </Hidden>
              </Grid>
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
              onClose={this.handleCloseEdit}
              onSubmit={this.handleSubmit}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <EditProfileModal
              open={isEditingProfile}
              profile={userProfile}
              isSaving={isUpdatingProfile}
              about={about}
              onClose={() => this.setState({ isEditingProfile: false })}
              onSave={this.handleSaveProfile}
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

  renderPointsHistory() {
    const {
      classes,
      user: { data: userData }
    } = this.props;
    const { userProfile } = this.state;

    return (
      <div className={classes.root}>
        <PointsHistoryDetails
          isMyProfile={userProfile.userId === userData.userId}
          profile={userProfile}
          onGoBack={() => this.switchPage(PROFILE_PAGES.index)}
        />
      </div>
    );
  }

  render() {
    const { page } = this.state;

    switch (page) {
      case PROFILE_PAGES.index:
        return this.renderIndex();
      case PROFILE_PAGES.points_history:
        return this.renderPointsHistory();
      default:
        throw new Error('Unknown page type');
    }
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
      updateBookmark: feedActions.updateBookmark,
      updateProfileImage
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Profile)));
