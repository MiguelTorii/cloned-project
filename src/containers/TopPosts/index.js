// @flow

import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PostsList from '../../components/posts-list';

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

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <PostsList />
      </div>
    );
  }
}

// const mapStateToProps = ({ user, feed }: StoreState): {} => ({
//   user,
//   feed
// });

// const mapDispatchToProps = (dispatch: *): {} =>
//   bindActionCreators(
//     {
//       fetchUserFeed: feedActions.fetchUserFeed,
//       openShareDialog: shareActions.openShareDialog
//     },
//     dispatch
//   );

export default connect(
  null,
  null
)(withStyles(styles)(Feed));
