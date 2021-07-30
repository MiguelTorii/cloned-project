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
import CustomNotification from '../../components/Notifications/CustomNotification';
import {
  getNotifications,
  postPing,
  setNotificationsRead,
  getNotification
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
  title: string,
  details: string,
  loading: boolean
};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  mounted: boolean;

  static defaultProps = {
    isPage: false,
    onUpdateUnreadCount: () => {}
  };

  state = {
    notifications: [],
    tab: 0,
    title: '',
    details: '',
    loading: true
  };

  componentDidMount = async () => {
    this.mounted = true;
    if (
      this.handleDebouncePing.cancel &&
      typeof this.handleDebouncePing.cancel === 'function'
    )
      this.handleDebouncePing.cancel();
    window.addEventListener('offline', () => {
      if (
        this.handleDebounceFetchNotifications.cancel &&
        typeof this.handleDebounceFetchNotifications.cancel === 'function'
      )
        this.handleDebounceFetchNotifications.cancel();
    });
    window.addEventListener('online', () => {
      this.handleDebounceFetchNotifications();
      this.handleDebouncePing();
    });

    this.handleDebounceFetchNotifications = debounce(
      this.handleDebounceFetchNotifications,
      30181
    );

    this.handleDebouncePing = debounce(this.handleDebouncePing, 300000);

    await this.handleFetchNotifications();
    await this.handlePing();

    this.handleDebounceFetchNotifications();
    this.handleDebouncePing();
  };

  componentDidUpdate = (prevProps) => {
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
      this.handleDebouncePing.cancel &&
      typeof this.handleDebouncePing.cancel === 'function'
    )
      this.handleDebouncePing.cancel();
    if (
      this.handleDebounceFetchNotifications.cancel &&
      typeof this.handleDebounceFetchNotifications.cancel === 'function'
    )
      this.handleDebounceFetchNotifications.cancel();
  };

  handleDebouncePing = async () => {
    try {
      await this.handlePing();
    } finally {
      if (this.mounted) this.handleDebouncePing();
    }
  };

  handleDebounceFetchNotifications = async () => {
    try {
      await this.handleFetchNotifications();
    } finally {
      if (this.mounted) this.handleDebounceFetchNotifications();
    }
  };

  handlePing = async () => {
    await postPing();
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
          tab
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

  handleClick = async ({
    entityType,
    typeId,
    postId,
    id
  }: {
    entityType: number,
    typeId: number,
    postId: number,
    id: number
  }) => {
    const {
      user: {
        data: { userId }
      },
      onClick
      // onClose
    } = this.props;
    if (entityType !== 8000) {
      onClick({ postId, typeId, entityType });
    } else {
      const { title, details } = await getNotification({ userId, id });
      // onClose();
      this.setState({ title, details });
    }
  };

  handleCloseCustomNotification = () => {
    this.setState({ title: '', details: '' });
  };

  render() {
    const { classes, isPage, anchorEl, onClose } = this.props;
    const { notifications, tab, title, details, loading } = this.state;

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
            onClick={this.handleClick}
          />
          <CustomNotification
            open={title !== ''}
            title={title}
            details={details}
            onClose={this.handleCloseCustomNotification}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(mapStateToProps, null)(withStyles(styles)(Feed));
