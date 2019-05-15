// @flow

import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MainLayout from '../../components/MainLayout';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as notificationsActions from '../../actions/notifications';
import * as signInActions from '../../actions/sign-in';
import Notifications from '../Notifications';

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
  isNaked?: boolean,
  openNotifications: Function,
  checkUserSession: Function,
  signOut: Function
};

type State = {};

class Layout extends React.PureComponent<Props, State> {
  static defaultProps = {
    isNaked: false
  };

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
    const { user, signOut, isNaked } = this.props;
    const {
      data: { userId }
    } = user;
    if (isNaked) return this.renderChildren();
    return (
      <Fragment>
        <MainLayout
          userId={userId}
          handleNotificationOpen={this.handleNotificationOpen}
          handleSignOut={signOut}
        >
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
      checkUserSession: signInActions.checkUserSession,
      signOut: signInActions.signOut
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
