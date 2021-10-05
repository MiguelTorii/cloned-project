import React from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import type { State as StoreState } from '../../types/state';
import type { Notification as NotificationState } from '../../types/models';
import type { UserState } from '../../reducers/user';
import Notifications from '../../components/Notifications/Notifications';
import CustomNotification from '../../components/Notifications/CustomNotification';
import {
  getNotifications,
  postPing,
  setNotificationsRead,
  getNotification
} from '../../api/notifications';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = () => ({
  root: {}
});

type ProvidedProps = {
  classes?: Record<string, any>;
};
type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  anchorEl?: React.ReactNode;
  onClose?: (...args: Array<any>) => any;
  onUpdateUnreadCount?: (...args: Array<any>) => any;
  isPage?: boolean;
  onClick?: (...args: Array<any>) => any;
};
type State = {
  notifications: Array<NotificationState>;
  tab: number;
  title: string;
  details: string;
  loading: boolean;
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

    // TODO this looks like a bug because `this.handleDebouncePing` is not a promise
    // but if we call it, it returns a promise, so maybe there was an intention to call it here?
    // More investigation is necessary, using any for now.
    if (
      (this.handleDebouncePing as any).cancel &&
      typeof (this.handleDebouncePing as any).cancel === 'function'
    ) {
      (this.handleDebouncePing as any).cancel();
    }

    window.addEventListener('offline', () => {
      if (
        (this.handleDebounceFetchNotifications as any).cancel &&
        typeof (this.handleDebounceFetchNotifications as any).cancel === 'function'
      ) {
        (this.handleDebounceFetchNotifications as any).cancel();
      }
    });
    window.addEventListener('online', () => {
      this.handleDebounceFetchNotifications();
      this.handleDebouncePing();
    });
    this.handleDebounceFetchNotifications = debounce(this.handleDebounceFetchNotifications, 30181);
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
        setNotificationsRead({
          userId
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;

    // TODO this looks like a bug because `this.handleDebouncePing` is not a promise
    // but if we call it, it returns a promise, so maybe there was an intention to call it here?
    // More investigation is necessary, using any for now.
    if (
      (this.handleDebouncePing as any).cancel &&
      typeof (this.handleDebouncePing as any).cancel === 'function'
    ) {
      (this.handleDebouncePing as any).cancel();
    }

    if (
      (this.handleDebounceFetchNotifications as any).cancel &&
      typeof (this.handleDebounceFetchNotifications as any).cancel === 'function'
    ) {
      (this.handleDebounceFetchNotifications as any).cancel();
    }
  };

  handleDebouncePing = async () => {
    try {
      await this.handlePing();
    } finally {
      if (this.mounted) {
        this.handleDebouncePing();
      }
    }
  };

  handleDebounceFetchNotifications = async () => {
    try {
      await this.handleFetchNotifications();
    } finally {
      if (this.mounted) {
        this.handleDebounceFetchNotifications();
      }
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
      this.setState({
        loading: true
      });

      try {
        const { notifications, unreadCount } = await getNotifications({
          userId,
          tab
        });

        if (onUpdateUnreadCount) {
          onUpdateUnreadCount(unreadCount);
        }

        this.setState({
          notifications
        });
      } finally {
        this.setState({
          loading: false
        });
      }
    }
  };

  handleTabChange = async (event, tab) => {
    const { tab: currentTab } = this.state;

    if (currentTab !== tab) {
      await this.setState(() => ({
        tab,
        loading: true
      }));
      this.handleFetchNotifications();
    }
  };

  handleClick = async ({
    entityType,
    typeId,
    postId,
    id
  }: {
    entityType: number;
    typeId: number;
    postId: number;
    id: number;
  }) => {
    const {
      user: {
        data: { userId }
      },
      onClick
    } = this.props;

    if (entityType !== 8000) {
      onClick({
        postId,
        typeId,
        entityType
      });
    } else {
      const { title, details } = await getNotification({
        userId,
        id
      });
      this.setState({
        title,
        details
      });
    }
  };

  handleCloseCustomNotification = () => {
    this.setState({
      title: '',
      details: ''
    });
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

export default connect<{}, {}, Props>(mapStateToProps, null)(withStyles(styles as any)(Feed));
