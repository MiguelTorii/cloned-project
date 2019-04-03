// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import type { State as StoreState } from '../../types/state';
import type { NotificationsState } from '../../reducers/notifications';
import Notifications from '../../components/Notifications';
import * as notificationsActions from '../../actions/notifications';

const styles = () => ({
  root: {}
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  notifications: NotificationsState,
  closeNotifications: Function
};

type State = {};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const { classes, notifications, closeNotifications } = this.props;
    const { anchorEl } = notifications;
    return (
      <div className={classes.root}>
        <Notifications
          anchorEl={anchorEl}
          handleNotificationClose={closeNotifications}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ notifications }: StoreState): {} => ({
  notifications
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      closeNotifications: notificationsActions.closeNotifications
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
