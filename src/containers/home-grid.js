// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import HomeGridList from '../components/home-grid-list';

const styles = () => ({});

type Props = {
  classes: Object
};

type State = {};

class HomeGrid extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <HomeGridList />
      </div>
    );
  }
}

// const mapDispatchToProps = (dispatch: *): {} =>
//   bindActionCreators(
//     {
//       openNotifications: notificationsActions.openNotifications
//     },
//     dispatch
//   );

export default connect(
  null,
  null
)(withStyles(styles)(HomeGrid));
