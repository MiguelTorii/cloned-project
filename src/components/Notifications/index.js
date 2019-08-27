// @flow

import React from 'react';
import cx from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotificationItem from './notification-item';
import type { Notification as NotificationState } from '../../types/models';

const styles = theme => ({
  root: {
    // width: 376,
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2,
    position: 'absolute',
    top: 0,
    right: 0
  },
  hide: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  notifications: Array<NotificationState>,
  tab: number,
  loading: boolean,
  // eslint-disable-next-line no-undef
  anchorEl: HTMLElement,
  isPage: boolean,
  onNotificationClose: Function,
  onTabChange: Function,
  onClick: Function
};

type State = {};

class Notifications extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      anchorEl,
      notifications,
      tab,
      loading,
      isPage,
      onNotificationClose,
      onTabChange,
      onClick
    } = this.props;
    const open = Boolean(anchorEl);
    const notificationPaper = (
      <Paper className={classes.root}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={onTabChange}
        >
          <Tab label="All" />
          <Tab label="Study Circle" />
        </Tabs>
        <List className={classes.root}>
          {notifications.map(item => (
            <NotificationItem
              key={item.id}
              notification={item}
              onClick={onClick}
            />
          ))}
        </List>
        {notifications.length === 0 && (
          <div className={classes.empty}>
            <Typography align="center" variant="h6">
              No notifications yet. We will keep you posted
            </Typography>
          </div>
        )}
        <div className={cx(classes.progress, !loading && classes.hide)}>
          <CircularProgress />
        </div>
      </Paper>
    );

    const popper = (
      <Popover
        id="notifications-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={onNotificationClose}
      >
        {notificationPaper}
      </Popover>
    );
    if (isPage) return notificationPaper;
    return popper;
  }
}

export default withStyles(styles)(Notifications);
