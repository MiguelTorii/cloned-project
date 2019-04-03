// @flow

import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MainLayout from '../components/main-layout';
import type { State as StoreState } from '../types/state';
import type { UserState } from '../reducers/user';
import * as notificationsActions from '../actions/notifications';
import * as signInActions from '../actions/sign-in';
import Notifications from './notifications';

const styles = theme => ({
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  children: Object,
  user: UserState,
  openNotifications: Function,
  checkUserSession: Function
};

type State = {};

class Layout extends React.PureComponent<Props, State> {
  componentDidMount = () => {
    const { checkUserSession } = this.props;
    checkUserSession();
  };

  handleNotificationOpen = event => {
    const { currentTarget } = event;
    const { openNotifications } = this.props;
    openNotifications({ anchorEl: currentTarget });
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
    return (
      <Fragment>
        <MainLayout handleNotificationOpen={this.handleNotificationOpen}>
          {this.renderChildren()}
        </MainLayout>
        <Notifications />
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
      openNotifications: notificationsActions.openNotifications,
      checkUserSession: signInActions.checkUserSession
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
