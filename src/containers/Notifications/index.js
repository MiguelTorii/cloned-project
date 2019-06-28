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
  onUpdateUnreadCount?: Function,
  isPage?: boolean,
  onClick: Function
};

type State = {
  notifications: Array<NotificationState>,
  tab: number,
  loading: boolean
};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  static defaultProps = {
    isPage: false,
    onUpdateUnreadCount: () => {}
  };

  state = {
    notifications: [],
    tab: 0,
    loading: true
  };

  componentDidMount = () => {
    this.mounted = true;
    window.addEventListener('offline', () => {
      if (
        this.handleDebounceFetchNotifications.cancel &&
        typeof this.handleDebounceFetchNotifications.cancel === 'function'
      )
        this.handleDebounceFetchNotifications.cancel();
    });
    window.addEventListener('online', () => {
      this.handleDebounceFetchNotifications();
    });

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

  componentWillUnmount = () => {
    this.mounted = false;
    if (
      this.handleDebounceFetchNotifications.cancel &&
      typeof this.handleDebounceFetchNotifications.cancel === 'function'
    )
      this.handleDebounceFetchNotifications.cancel();
  };

  handleDebounceFetchNotifications = async () => {
    try {
      await this.handleFetchNotifications();
    } finally {
      if (this.mounted) this.handleDebounceFetchNotifications();
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
        if (onUpdateUnreadCount) onUpdateUnreadCount(unreadCount);
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

  mounted: boolean;

  render() {
    const { classes, isPage, anchorEl, onClose, onClick } = this.props;
    const { notifications, tab, loading } = this.state;
    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <Notifications
            notifications={notifications}
            tab={tab}
            loading={loading}
            anchorEl={anchorEl}
            isPage={isPage}
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
