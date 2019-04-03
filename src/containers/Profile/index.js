// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  }
});

type Props = {
  classes: Object,
  userId: string
};

type State = {};

class Profile extends React.PureComponent<Props, State> {
  render() {
    const { classes, userId } = this.props;
    return <div className={classes.root}>{`Profile: ${userId}`}</div>;
  }
}

// const mapStateToProps = ({ feed }: StoreState): {} => ({
//   feed
// });

// const mapDispatchToProps = (dispatch: *): {} =>
//   bindActionCreators(
//     {
//       //   closeShareDialog: shareActions.closeShareDialog
//     },
//     dispatch
//   );

export default connect(
  null,
  null
)(withStyles(styles)(Profile));
