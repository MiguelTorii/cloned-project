// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import FeedList from '../../components/FeedList';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { FeedState } from '../../reducers/feed';
import * as feedActions from '../../actions/feed';
import * as shareActions from '../../actions/share';

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
  classes: Object,
  user: UserState,
  feed: FeedState,
  fetchUserFeed: Function,
  openShareDialog: Function,
  push: Function
};

type State = {};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  componentDidMount = () => {
    const {
      user: { data },
      fetchUserFeed
    } = this.props;
    const { userId } = data;
    fetchUserFeed({ userId });
  };

  handleShare = ({ userId, feedId }: { userId: number, feedId: number }) => {
    const { openShareDialog } = this.props;
    openShareDialog({ userId, feedId });
  };

  handlePostClick = (typeId: number, postId: number) => () => {
    const { push } = this.props;

    switch (typeId) {
      case 3:
        push(`/flashcards/${postId}`);
        break;
      case 4:
        push(`/notes/${postId}`);
        break;
      case 5:
        push(`/sharelink/${postId}`);
        break;
      case 6:
        push(`/question/${postId}`);
        break;
      default:
        console.log(typeId, postId);
        break;
    }
  };

  render() {
    const {
      classes,
      feed: { isLoading, items }
    } = this.props;
    return (
      <div className={classes.root}>
        <FeedList
          isLoading={isLoading}
          items={items}
          handleShare={this.handleShare}
          handlePostClick={this.handlePostClick}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ user, feed }: StoreState): {} => ({
  user,
  feed
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      fetchUserFeed: feedActions.fetchUserFeed,
      openShareDialog: shareActions.openShareDialog,
      push: routePush
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
