// @flow

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import type { UserProfile, About, UserStatistic } from '../../types/models';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import {
  getUserProfile,
  updateProfile,
  updateUserProfileUrl
} from '../../api/user';
import { getPresignedURL } from '../../api/media';
import * as signInActions from '../../actions/sign-in';
import * as chatActions from '../../actions/chat';
import ProfileHeader from '../../components/Profile/header';
import ProfileAbout from '../../components/Profile/about';
import ProfileSeasons from '../../components/Profile/seasons';
import ProfileEdit from '../../components/ProfileEdit';
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
  userId: string,
  edit: boolean,
  checkUserSession: Function,
  openChannelWithEntity: Function
};

type State = {
  userProfile: UserProfile,
  about: Array<About>,
  userStatistics: Array<UserStatistic>,
  isLoading: boolean,
  error: boolean,
  edit: boolean,
  uploading: boolean
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
    isLoading: true,
    error: false,
    edit: false,
    uploading: false
  };

  componentDidMount = () => {
    this.handleGetProfile();
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
        this.setState({ userProfile, about, userStatistics, isLoading: false });
      }
    } catch (err) {
      this.setState({ error: true, isLoading: false });
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
    openChannelWithEntity({
      entityId: userId,
      entityFirstName: firstName,
      entityLastName: lastName,
      entityVideo: false
    });
  };

  handleStartVideo = () => {
    const { openChannelWithEntity } = this.props;
    const {
      userProfile: { userId, firstName, lastName }
    } = this.state;
    openChannelWithEntity({
      entityId: userId,
      entityFirstName: firstName,
      entityLastName: lastName,
      entityVideo: true
    });
  };

  render() {
    const {
      classes,
      user: { data: userData }
    } = this.props;
    const { segment = '' } = userData;
    const {
      userProfile,
      about,
      userStatistics,
      isLoading,
      error,
      edit,
      uploading
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
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} md={7}>
            <ErrorBoundary>
              <ProfileHeader
                isMyProfile={userId === userData.userId}
                firstName={firstName}
                lastName={lastName}
                userProfileUrl={userProfileUrl}
                points={points}
                school={school}
                state={state}
                segment={segment}
                grade={grade}
                joined={joined}
                onOpenEdit={this.handleOpenEdit}
                onStartChat={this.handleStartChat}
                onStartVideo={this.handleStartVideo}
              />
            </ErrorBoundary>
          </Grid>
          <Grid item xs={12} md={5}>
            <ErrorBoundary>
              <ProfileAbout about={about} onOpenEdit={this.handleOpenEdit} />
            </ErrorBoundary>
          </Grid>
        </Grid>
        <ErrorBoundary>
          <ProfileSeasons stats={userStatistics} />
        </ErrorBoundary>
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
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      checkUserSession: signInActions.checkUserSession,
      openChannelWithEntity: chatActions.openChannelWithEntity
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
