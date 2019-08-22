// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import FeedList from '../../components/FeedList';
import FeedFilter from '../../components/FeedFilter';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { FeedState } from '../../reducers/feed';
import { getUserClasses } from '../../api/user';
import { logEvent } from '../../api/analytics';
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';
import { processUserClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary';
import * as feedActions from '../../actions/feed';

// const defaultClass = JSON.stringify({ classId: -1, sectionId: -1 });

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
  feed: FeedState,
  feedId: ?number,
  classId: number,
  sectionId: number,
  bookmarks: boolean,
  push: Function,
  fetchFeed: Function,
  updateBookmark: Function,
  updateFilter: Function,
  clearFilter: Function,
  updateFeedLimit: Function
};

type State = {
  feedId: ?number,
  report: ?Object,
  deletePost: ?Object,
  classesList: Array<{ value: string, label: string }>
};

class Feed extends React.PureComponent<Props, State> {
  state = {
    feedId: null,
    report: null,
    deletePost: null,
    classesList: []
  };

  componentDidMount = async () => {
    this.mounted = true;
    const { classId, sectionId, bookmarks, updateFilter } = this.props;
    if (classId >= 0 && sectionId >= 0) {
      updateFilter({
        field: 'userClass',
        value: JSON.stringify({ classId, sectionId })
      });
    }
    if (bookmarks) {
      updateFilter({ field: 'from', value: 'bookmarks' });
    }
    window.addEventListener('offline', () => {
      if (
        this.handleFetchFeed.cancel &&
        typeof this.handleFetchFeed.cancel === 'function'
      )
        this.handleFetchFeed.cancel();
    });
    window.addEventListener('online', () => {
      this.handleFetchFeed();
    });

    this.handleFetchFeed = debounce(this.handleFetchFeed, 521);
    this.handleFetchUserClasses();
    await this.handleFetchFeed();
  };

  componentWillUnmount = () => {
    this.mounted = false;
    if (
      this.handleFetchFeed.cancel &&
      typeof this.handleFetchFeed.cancel === 'function'
    )
      this.handleFetchFeed.cancel();
  };

  handleFetchUserClasses = () => {
    const {
      user: {
        data: { userId, segment }
      }
    } = this.props;

    getUserClasses({ userId }).then(({ classes }) => {
      const classesList = processUserClasses({ classes, segment });
      if (this.mounted) this.setState({ classesList });
    });
  };

  handleFetchFeed = () => {
    const { fetchFeed } = this.props;
    try {
      fetchFeed();
    } catch (err) {
      console.log(err);
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
      },
      updateBookmark
    } = this.props;

    updateBookmark({ feedId, userId, bookmarked });
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

  handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    if (deleted && deleted === true) {
      this.handleFetchFeed();
    }
    this.setState({ deletePost: null });
  };

  handleChange = name => event => {
    const { updateFilter } = this.props;
    updateFilter({ field: name, value: event.target.value });
  };

  handleApplyFilters = filters => {
    const { updateFilter } = this.props;
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of filters) {
      updateFilter({ field: filter.name, value: filter.value });
    }
  };

  handleClearFilters = () => {
    const { clearFilter } = this.props;
    clearFilter();
  };

  handleClearSearch = () => {
    const { updateFilter } = this.props;
    updateFilter({ field: 'query', value: '' });
  }

  handleLoadMore = () => {
    const {
      feed: {
        data: {
          filters: { limit }
        }
      },
      updateFeedLimit
    } = this.props;
    updateFeedLimit({ limit: limit + 100 });
  };

  handleUserClick = ({ userId }: { userId: string }) => {
    const { push } = this.props;
    push(`/profile/${userId}`);
  };

  handleOpenFilter = () => {
    logEvent({
      event: 'Feed- Open Filter',
      props: {}
    });
  };

  handleRefresh = () => {
    this.handleFetchFeed();
  };

  handleChangeDateRange = (range, date) => {
    const { updateFilter } = this.props;
    updateFilter({ field: range, value: date });
  };

  handlePostClick = ({
    typeId,
    postId,
    feedId
  }: {
    typeId: number,
    postId: number,
    feedId: number
  }) => () => {
    const { push } = this.props;
    push(`/feed?id=${feedId}`);
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

  mounted: boolean;

  render() {
    const {
      classes,
      user: {
        data: { userId }
      },
      feed: {
        data: {
          items,
          hasMore,
          filters: { postTypes, query, from, userClasses, fromDate, toDate }
        },
        isLoading
      },
      feedId: fromFeedId
    } = this.props;
    const { feedId, report, deletePost, classesList } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <FeedFilter
              query={query}
              from={from}
              userClasses={userClasses}
              postTypes={postTypes}
              classesList={classesList}
              fromDate={fromDate}
              toDate={toDate}
              onChange={this.handleChange}
              onApplyFilters={this.handleApplyFilters}
              onClearFilters={this.handleClearFilters}
              onOpenFilter={this.handleOpenFilter}
              onRefresh={this.handleRefresh}
              onChangeDateRange={this.handleChangeDateRange}
              onClearSearch={this.handleClearSearch}
            />
            <FeedList
              isLoading={isLoading}
              userId={userId}
              items={items}
              hasMore={hasMore}
              fromFeedId={fromFeedId}
              handleShare={this.handleShare}
              onPostClick={this.handlePostClick}
              onBookmark={this.handleBookmark}
              onReport={this.handleReport}
              onDelete={this.handleDelete}
              onLoadMore={this.handleLoadMore}
              onUserClick={this.handleUserClick}
            />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <SharePost
            feedId={feedId}
            open={Boolean(feedId)}
            onClose={this.handleShareClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Report
            open={Boolean(report)}
            ownerId={(report || {}).ownerId || ''}
            objectId={(report || {}).feedId || -1}
            onClose={this.handleReportClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <DeletePost
            open={Boolean(deletePost)}
            feedId={(deletePost || {}).feedId || -1}
            onClose={this.handleDeleteClose}
          />
        </ErrorBoundary>
      </Fragment>
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
      push: routePush,
      fetchFeed: feedActions.fetchFeed,
      updateBookmark: feedActions.updateBookmark,
      updateFilter: feedActions.updateFilter,
      clearFilter: feedActions.clearFilter,
      updateFeedLimit: feedActions.updateFeedLimit
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
