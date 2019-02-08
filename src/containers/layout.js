// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MainLayout from '../components/main-layout';
import * as notificationsActions from '../actions/notifications';
import Notifications from './notifications';

const styles = () => ({});

type Props = {
  children: Object,
  openNotifications: Function
};

type State = {};

class Layout extends React.PureComponent<Props, State> {
  handleNotificationOpen = event => {
    const { currentTarget } = event;
    const { openNotifications } = this.props;
    // this.setState({
    //   notificationsAnchorEl: currentTarget
    // });
    openNotifications({ anchorEl: currentTarget });
  };

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <MainLayout handleNotificationOpen={this.handleNotificationOpen}>
          {children}
        </MainLayout>
        <Notifications />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      openNotifications: notificationsActions.openNotifications
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Layout));
