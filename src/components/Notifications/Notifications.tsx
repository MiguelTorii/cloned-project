import React from "react";
import cx from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import LoadImg from "components/LoadImg/LoadImg";
import emptyNotification from "assets/svg/no-notification.svg";
import readNotificationAll from "assets/svg/read_all.svg";
import NotificationItem from "./notification-item";
import type { Notification as NotificationState } from "../../types/models";
import { styles } from "../_styles/Notifications/index";
type Props = {
  classes: Record<string, any>;
  notifications: Array<NotificationState>;
  tab: number;
  loading: boolean;
  anchorEl: HTMLElement;
  isPage: boolean;
  onNotificationClose: (...args: Array<any>) => any;
  onTabChange: (...args: Array<any>) => any;
  onClick: (...args: Array<any>) => any;
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

    const handleClick = e => {
      onClick(e);

      if (onNotificationClose) {
        onNotificationClose();
      }
    };

    const open = Boolean(anchorEl);
    const notificationPaper = <Paper className={classes.root}>
        <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={onTabChange}>
          <Tab className={classes.notificationTab} classes={{
          wrapper: tab === 0 ? classes.wrapper : classes.currentWrapper
        }} label="Posts" />
          <Tab className={classes.notificationTab} classes={{
          wrapper: tab === 1 ? classes.wrapper : classes.currentWrapper
        }} label="Recommended" />
          <Tab className={classes.notificationTab} classes={{
          wrapper: tab === 2 ? classes.wrapper : classes.currentWrapper
        }} label="Announcements" />
          <Tab className={cx(classes.notificationTab, classes.readAllTab)} label="Read all" classes={{
          wrapper: tab === 3 ? classes.wrapper : classes.currentWrapper
        }} icon={<LoadImg url={readNotificationAll} className={tab === 3 ? classes.selectedReadAll : ''} />} />
        </Tabs>
        <List className={classes.root}>
          {notifications.map(item => <NotificationItem key={item.id} notification={item} onClick={handleClick} />)}
        </List>
        {notifications.length === 0 && <div className={classes.empty}>
            <LoadImg url={emptyNotification} style={{
          width: '100%'
        }} />
            <Typography align="center" variant="h6">
              No notifications yet.
            </Typography>
            <Typography align="center" variant="body2">
              When something exciting arrives, we’ll let you know right away!
            </Typography>
          </div>}
        <div className={cx(classes.progress, !loading && classes.hide)}>
          <CircularProgress />
        </div>
      </Paper>;
    const popper = <Popover id="notifications-popper" open={open} anchorEl={anchorEl} onClose={onNotificationClose}>
        {notificationPaper}
      </Popover>;

    if (isPage) {
      return notificationPaper;
    }

    return popper;
  }

}

export default withStyles(styles)(Notifications);