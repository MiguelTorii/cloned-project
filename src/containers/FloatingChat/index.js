// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import MainChat from '../../components/FloatingChat/MainChat';

const styles = () => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 10000
  }
});

type Props = {
  classes: Object,
  user: UserState
};

class FloatingChat extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      user: { data: userData }
    } = this.props;
    const { userId } = userData;
    if (userId === '') return null;
    return (
      <div className={classes.root}>
        <MainChat />
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
)(withRoot(withStyles(styles)(FloatingChat)));
