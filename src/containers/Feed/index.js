// @flow

import React, { Fragment } from 'react';
import update from 'immutability-helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import FeedList from '../../components/FeedList';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import { fetchFeed } from '../../api/feed';
import { bookmark } from '../../api/posts';
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';

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
  user: UserState,
  push: Function
};

type State = {
  feed: Array<Object>,
  feedId: ?number,
  loading: boolean,
  report: ?Object,
  deletePost: ?Object
};

class Feed extends React.PureComponent<Props, State> {
  state = {
    feed: [],
    feedId: null,
    loading: false,
    report: null,
    deletePost: null
  };

  componentDidMount = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      const feed = await fetchFeed({ userId });
      this.setState({ feed });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleShare = ({ feedId }: { feedId: number }) => {
    this.setState({ feedId });
  };

  handleShareClose = () => {
    this.setState({ feedId: null });
  };

  handleBookmark = ({
    feedId,
    bookmarked
  }: {
    feedId: number,
    bookmarked: boolean
  }) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    bookmark({ feedId, userId, remove: bookmarked });
    const newState = update(this.state, {
      feed: {
        $apply: b => {
          const index = b.findIndex(item => item.feedId === feedId);
          if (index > -1) {
            return update(b, {
              [index]: {
                bookmarked: { $set: !bookmarked }
              }
            });
          }
          return b;
        }
      }
    });

    this.setState(newState);
  };

  handleReport = ({ feedId, ownerId }) => {
    this.setState({ report: { feedId, ownerId } });
  };

  handleReportClose = () => {
    this.setState({ report: null });
  };

  handleDelete = ({ feedId }) => {
    this.setState({ deletePost: { feedId } });
  };

  handleDeleteClose = () => {
    this.setState({ deletePost: null });
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
        break;
    }
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { feed, feedId, loading, report, deletePost } = this.state;

    return (
      <Fragment>
        <div className={classes.root}>
          <FeedList
            isLoading={loading}
            userId={userId}
            items={feed}
            handleShare={this.handleShare}
            handlePostClick={this.handlePostClick}
            onBookmark={this.handleBookmark}
            onReport={this.handleReport}
            onDelete={this.handleDelete}
          />
        </div>
        <SharePost
          feedId={feedId}
          open={Boolean(feedId)}
          onClose={this.handleShareClose}
        />
        <Report
          open={Boolean(report)}
          ownerId={(report || {}).ownerId || ''}
          objectId={(report || {}).feedId || -1}
          onClose={this.handleReportClose}
        />
        <DeletePost
          open={Boolean(deletePost)}
          feedId={(deletePost || {}).feedId || -1}
          onClose={this.handleDeleteClose}
        />
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
      push: routePush
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
