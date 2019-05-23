// @flow

import React, { Fragment } from 'react';
import type { Node } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MainLayout from '../../components/MainLayout';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as signInActions from '../../actions/sign-in';
import * as chatActions from '../../actions/chat';
import Notifications from '../Notifications';
import ClassesManager from '../ClassesManager';
import BlockedUsersManager from '../BlockedUsersManager';
import Leaderboard from '../Leaderboard';
import Announcements from '../../components/Announcements';

const styles = theme => ({
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
  children: Object,
  user: UserState,
  isNaked?: boolean,
  checkUserSession: Function,
  signOut: Function,
  openCreateChatGroup: Function,
  push: Function
};

type State = {
  manageClasses: boolean,
  manageBlockedUsers: boolean,
  anchorEl: Node,
  leaderboard: boolean,
  announcements: boolean,
  unreadCount: number
};

class Layout extends React.PureComponent<Props, State> {
  static defaultProps = {
    isNaked: false
  };

  state = {
    manageClasses: false,
    manageBlockedUsers: false,
    anchorEl: null,
    leaderboard: false,
    announcements: false,
    unreadCount: 0
  };

  componentDidMount = () => {
    const { checkUserSession } = this.props;
    checkUserSession();
  };

  handleNotificationOpen = event => {
    const { currentTarget } = event;
    this.setState({ anchorEl: currentTarget });
  };

  handleNotificationClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOpenManageClasses = () => {
    this.setState({ manageClasses: true });
  };

  handleOpenBlockedUsers = () => {
    this.setState({ manageBlockedUsers: true });
  };

  handleCloseManageClasses = () => {
    this.setState({ manageClasses: false });
  };

  handleCloseManageBlockedUsers = () => {
    this.setState({ manageBlockedUsers: false });
  };

  handleOpenLeaderboard = () => {
    this.setState({ leaderboard: true });
  };

  handleCloseLeaderboard = () => {
    this.setState({ leaderboard: false });
  };

  handleOpenAnnouncements = () => {
    this.setState({ announcements: true });
  };

  handleCloseAnnouncements = () => {
    this.setState({ announcements: false });
  };

  handleCreateChatGroupChannel = () => {
    this.handleCloseAnnouncements();
    const { openCreateChatGroup } = this.props;
    openCreateChatGroup();
  };

  handleUpdateUnreadCount = unreadCount => {
    this.setState({ unreadCount });
  };

  handleNotificationClick = ({
    typeId,
    postId
  }: {
    typeId: number,
    postId: number
  }) => {
    const { push } = this.props;
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

  renderChildren = () => {
    const {
      user: { data, isLoading },
      children,
      classes
    } = this.props;
    if (data.userId && !isLoading) return children;
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  };

  render() {
    const { user, signOut, isNaked } = this.props;
    const {
      data: { userId }
    } = user;
    const {
      manageClasses,
      manageBlockedUsers,
      anchorEl,
      leaderboard,
      announcements,
      unreadCount
    } = this.state;
    if (isNaked) return this.renderChildren();
    return (
      <Fragment>
        <MainLayout
          userId={userId}
          unreadCount={unreadCount}
          handleNotificationOpen={this.handleNotificationOpen}
          handleSignOut={signOut}
          onManageClasses={this.handleOpenManageClasses}
          onManageBlockedUsers={this.handleOpenBlockedUsers}
          onOpenLeaderboard={this.handleOpenLeaderboard}
          onOpenAnnouncements={this.handleOpenAnnouncements}
        >
          {this.renderChildren()}
        </MainLayout>
        <Notifications
          anchorEl={anchorEl}
          onClose={this.handleNotificationClose}
          onUpdateUnreadCount={this.handleUpdateUnreadCount}
          onClick={this.handleNotificationClick}
        />
        <ClassesManager
          open={manageClasses}
          onClose={this.handleCloseManageClasses}
        />
        <BlockedUsersManager
          open={manageBlockedUsers}
          onClose={this.handleCloseManageBlockedUsers}
        />
        <Leaderboard open={leaderboard} onClose={this.handleCloseLeaderboard} />
        <Announcements
          open={announcements}
          onClose={this.handleCloseAnnouncements}
          onCreate={this.handleCreateChatGroupChannel}
        />
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
      checkUserSession: signInActions.checkUserSession,
      signOut: signInActions.signOut,
      openCreateChatGroup: chatActions.openCreateChatGroup,
      push: routePush
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
