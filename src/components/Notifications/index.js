// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotificationItem from './notification-item';
import type { Notification as NotificationState } from '../../types/models';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2,
    height: 200,
    width: 400
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

type Props = {
  classes: Object,
  notifications: Array<NotificationState>,
  tab: number,
  loading: boolean,
  // eslint-disable-next-line no-undef
  anchorEl: HTMLElement,
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
      onNotificationClose,
      onTabChange,
      onClick
    } = this.props;
    const open = Boolean(anchorEl);
    return (
      <Popover
        id="notifications-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={onNotificationClose}
      >
        <Paper className={classes.root}>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={onTabChange}
          >
            <Tab label="Study Circle" />
            <Tab label="All" />
          </Tabs>
          {loading ? (
            <div className={classes.progress}>
              <CircularProgress />
            </div>
          ) : (
            <List className={classes.root}>
              {notifications.map(item => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onClick={onClick}
                />
              ))}
            </List>
          )}
        </Paper>
      </Popover>
    );
  }
}

export default withStyles(styles)(Notifications);
