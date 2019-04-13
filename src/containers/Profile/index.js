// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserProfile } from '../../types/models';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { getUserProfile } from '../../api/user';
import ProfileHeader from '../../components/Profile/header';
import ProfileAbout from '../../components/Profile/about';
import ProfileSeasons from '../../components/Profile/seasons';

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
  userId: string
};

type State = {
  userProfile: UserProfile,
  isLoading: boolean,
  error: boolean
};

class Profile extends React.PureComponent<Props, State> {
  state = {
    userProfile: {
      userId: '',
      firstName: '',
      lastName: 'string',
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
    error: false
  };

  componentDidMount = async () => {
    try {
      const { userId } = this.props;
      if (userId !== '') {
        const { userProfile, about, userStatistics } = await getUserProfile({
          userId: '995394'
        });
        this.setState({ userProfile, about, userStatistics, isLoading: false });
      }
    } catch (err) {
      this.setState({ error: true, isLoading: false });
    }
  };

  render() {
    const {
      classes,
      user: { data: userData }
    } = this.props;
    const { segment = '' } = userData;
    const { userProfile, about, userStatistics, isLoading, error } = this.state;
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
        />
        <ProfileAbout about={about} />
        <ProfileSeasons stats={userStatistics} />
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

// const mapDispatchToProps = (dispatch: *): {} =>
//   bindActionCreators(
//     {
//       //   closeShareDialog: shareActions.closeShareDialog
//     },
//     dispatch
//   );

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Profile));
