// @flow

import React from 'react';
import type { Node } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import Notifications from '../../components/Notifications';
import { getNotifications } from '../../api/notifications';

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
  onClose: Function
};

type State = {};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  state = {};

  componentDidMount = () => {
    this.handleFetchNotifications = debounce(
      this.handleFetchNotifications,
      1000
    );
    // this.handleFetchNotifications();
  };

  handleFetchNotifications = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    if (userId !== '') {
      const notifications = await getNotifications({
        userId,
        isStudyCircle: true
      });
      console.log(notifications);
    } else {
      this.handleFetchNotifications();
    }
  };

  render() {
    const { classes, anchorEl, onClose } = this.props;
    return (
      <div className={classes.root}>
        <Notifications anchorEl={anchorEl} handleNotificationClose={onClose} />
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
