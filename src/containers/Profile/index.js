// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserProfile } from '../../types/models';
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
    isLoading: true,
    error: false
  };

  componentDidMount = async () => {
    try {
      const { userId } = this.props;
      const userProfile = await getUserProfile({ userId });
      this.setState({ userProfile, isLoading: false });
    } catch (err) {
      this.setState({ error: true, isLoading: false });
    }
  };

  render() {
    const { classes } = this.props;
    const { userProfile, isLoading, error } = this.state;
    if (isLoading)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    if (error) return <Redirect to="/" />;
    return (
      <div className={classes.root}>
        <ProfileHeader />
        <ProfileAbout />
        <ProfileSeasons />
      </div>
    );
  }
}

// const mapStateToProps = ({ feed }: StoreState): {} => ({
//   feed
// });

// const mapDispatchToProps = (dispatch: *): {} =>
//   bindActionCreators(
//     {
//       //   closeShareDialog: shareActions.closeShareDialog
//     },
//     dispatch
//   );

export default connect(
  null,
  null
)(withStyles(styles)(Profile));
