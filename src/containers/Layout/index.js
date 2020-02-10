// @flow

import React, { Fragment } from 'react';
import type { Node } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import AddRemoveClasses from 'components/AddRemoveClasses'
import MainLayout from '../../components/MainLayout';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as signInActions from '../../actions/sign-in';
import * as chatActions from '../../actions/chat';
import Notifications from '../Notifications';
import BlockedUsersManager from '../BlockedUsersManager';
import WebNotifications from '../WebNotifications'
import RequestClass from '../RequestClass'
import Announcements from '../../components/Announcements';
import BottomNav from '../../components/BottomNav';
import ErrorBoundary from '../ErrorBoundary';
import Notifier from '../Notifier';
import * as notificationsActions from '../../actions/notifications';

const styles = theme => ({
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
  children: Object,
  user: UserState,
  isNaked?: boolean,
  location: {pathname: string},
  checkUserSession: Function,
  signOut: Function,
  enqueueSnackbar: Function,
  openCreateChatGroup: Function,
  push: Function
};

type State = {
  manageClasses: boolean,
  manageBlockedUsers: boolean,
  anchorEl: Node,
  announcements: boolean,
  unreadCount: number,
  openRequestClass: boolean
};

class Layout extends React.PureComponent<Props, State> {
  static defaultProps = {
    isNaked: false
  };

  state = {
    manageClasses: false,
    manageBlockedUsers: false,
    anchorEl: null,
    announcements: false,
    unreadCount: 0,
    openRequestClass: false
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

  handleOpenStartVideoMeetUp = () => {}

  handleCloseStartVideoMeetUp = () => {}

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

  handleOpenRequestClass = () => {
    this.handleCloseManageClasses();
    this.setState({openRequestClass: true})
  }

  handleCloseRequestClass = () => {
    this.setState({openRequestClass: false})
  }

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
    const {
      user,
      signOut,
      isNaked,
      enqueueSnackbar,
      location: { pathname }
    } = this.props;
    const {
      data: { userId, firstName, lastName, profileImage }
    } = user;

    const {
      manageClasses,
      manageBlockedUsers,
      anchorEl,
      announcements,
      unreadCount,
      openRequestClass
    } = this.state;
    if (isNaked) return this.renderChildren();
    const name = `${firstName} ${lastName}`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    return (
      <Fragment>
        <ErrorBoundary>
          <MainLayout
            userId={userId}
            initials={initials}
            userProfileUrl={profileImage}
            unreadCount={unreadCount}
            pathname={pathname}
            handleNotificationOpen={this.handleNotificationOpen}
            handleSignOut={signOut}
            onManageClasses={this.handleOpenManageClasses}
            onManageBlockedUsers={this.handleOpenBlockedUsers}
            onOpenAnnouncements={this.handleOpenAnnouncements}
          >
            {this.renderChildren()}
          </MainLayout>
        </ErrorBoundary>
        <Hidden smUp implementation="css">
          <BottomNav />
        </Hidden>
        <ErrorBoundary>
          <Notifications
            anchorEl={anchorEl}
            onClose={this.handleNotificationClose}
            onUpdateUnreadCount={this.handleUpdateUnreadCount}
            onClick={this.handleNotificationClick}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <AddRemoveClasses
            userId={userId}
            open={manageClasses}
            onClose={this.handleCloseManageClasses}
            enqueueSnackbar={enqueueSnackbar}
            onOpenRequestClass={this.handleOpenRequestClass}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <BlockedUsersManager
            open={manageBlockedUsers}
            onClose={this.handleCloseManageBlockedUsers}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Announcements
            open={announcements}
            onClose={this.handleCloseAnnouncements}
            onCreate={this.handleCreateChatGroupChannel}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <WebNotifications />
        </ErrorBoundary>
        <ErrorBoundary>
          <RequestClass open={openRequestClass} onClose={this.handleCloseRequestClass} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Notifier />
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
      enqueueSnackbar: notificationsActions.enqueueSnackbar,
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
)(withStyles(styles)(withRouter(Layout)));
