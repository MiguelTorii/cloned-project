// @flow

import React from 'react';
import type { Node } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import type { State as StoreState } from '../../types/state';
import type { Notification as NotificationState } from '../../types/models';
import type { UserState } from '../../reducers/user';
import Notifications from '../../components/Notifications';
import {
  getNotifications,
  setNotificationsRead
} from '../../api/notifications';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({
  root: {}
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  user: UserState,
  anchorEl: Node,
  onClose: Function,
  onUpdateUnreadCount: Function,
  onClick: Function
};

type State = {
  notifications: Array<NotificationState>,
  tab: number,
  loading: boolean
};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  state = {
    notifications: [],
    tab: 0,
    loading: true
  };

  componentDidMount = () => {
    this.handleDebounceFetchNotifications = debounce(
      this.handleDebounceFetchNotifications,
      10181
    );
    this.handleDebounceFetchNotifications();
  };

  componentDidUpdate = prevProps => {
    const {
      user: {
        data: { userId }
      },
      anchorEl
    } = this.props;
    const { anchorEl: prevAnchorEl } = prevProps;

    if (
      anchorEl !== prevAnchorEl &&
      Boolean(anchorEl) === true &&
      Boolean(prevAnchorEl) === false
    ) {
      try {
        setNotificationsRead({ userId });
      } catch (err) {
        console.log(err);
      }
    }
  };

  handleDebounceFetchNotifications = async () => {
    try {
      await this.handleFetchNotifications();
    } finally {
      this.handleDebounceFetchNotifications();
    }
  };

  handleFetchNotifications = async () => {
    const {
      user: {
        data: { userId }
      },
      onUpdateUnreadCount
    } = this.props;
    if (userId !== '') {
      const { tab } = this.state;
      this.setState({ loading: true });
      try {
        const { notifications, unreadCount } = await getNotifications({
          userId,
          isStudyCircle: !tab
        });
        onUpdateUnreadCount(unreadCount);
        this.setState({ notifications });
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  handleTabChange = async (event, tab) => {
    const { tab: currentTab } = this.state;
    if (currentTab !== tab) {
      await this.setState(() => ({ tab, loading: true }));
      this.handleFetchNotifications();
    }
  };

  render() {
    const { classes, anchorEl, onClose, onClick } = this.props;
    const { notifications, tab, loading } = this.state;
    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <Notifications
            notifications={notifications}
            tab={tab}
            loading={loading}
            anchorEl={anchorEl}
            onNotificationClose={onClose}
            onTabChange={this.handleTabChange}
            onClick={onClick}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Feed));
