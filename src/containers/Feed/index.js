// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { processClasses } from 'containers/ClassesSelector/utils'
import FeedList from '../../components/FeedList';
import FeedFilter from '../../components/FeedFilter';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { FeedState } from '../../reducers/feed';
import { logEvent } from '../../api/analytics';
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';
import ErrorBoundary from '../ErrorBoundary';
import * as feedActions from '../../actions/feed';
import type { CampaignState } from '../../reducers/campaign';
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
  from: boolean,
  push: Function,
  fetchFeed: Function,
  updateBookmark: Function,
  updateFilter: Function,
  clearFilter: Function,
  campaign: CampaignState,
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

  mounted: boolean;

  componentDidUpdate(prevProps) {
    const { from } = this.props
    if (from !== prevProps.from) {
      this.handleUpdateFilter()
    }
  }

  handleUpdateFilter = () => {
    const { from, updateFilter } = this.props;
    if (from) {
      updateFilter({ field: 'from', value: from });
    } else {
      updateFilter({ field: 'from', value: 'everyone' });
    }
  }

  componentDidMount = async () => {
    this.mounted = true;
    const { classId, sectionId, updateFilter } = this.props;

    if (classId >= 0 && sectionId >= 0) {
      updateFilter({
        field: 'userClasses',
        value: [JSON.stringify({ classId, sectionId })]
      });
    }
    
    this.handleUpdateFilter()
    
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

  handleChange = name => async event => {
    const { updateFilter } = this.props;
    await updateFilter({ field: name, value: event.target.value });
    this.handleFetchFeed();
  };

  handleApplyFilters = filters => {
    const { updateFilter } = this.props;
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of filters) {
      updateFilter({ field: filter.name, value: filter.value });
    }
    this.handleFetchFeed();
  };

  handleClearFilters = () => {
    const { clearFilter } = this.props;
    clearFilter();
    this.handleFetchFeed();
  };

  handleClearSearch = () => {
    const { updateFilter } = this.props;
    updateFilter({ field: 'query', value: '' });
    this.handleFetchFeed();
  };

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
    this.handleFetchFeed();
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
    const { search } = window.location
    const feedParam = search ? `&id=${feedId}` : `?id=${feedId}`
    push(`/feed${search}${feedParam}`);
    switch (typeId) {
    case 3:
      push(`/flashcards/${postId}${search}`);
      break;
    case 4:
      push(`/notes/${postId}${search}`);
      break;
    case 5:
      push(`/sharelink/${postId}${search}`);
      break;
    case 6:
      push(`/question/${postId}${search}`);
      break;
    default:
      break;
    }
  };

  render() {
    const {
      classes,
      push,
      user: {
        data: { userId },
        userClasses: { classList }
      },
      feed: {
        data: {
          items,
          hasMore,
          filters: { postTypes, query, from, userClasses, fromDate, toDate }
        },
        isLoading
      },
      feedId: fromFeedId,
      campaign
    } = this.props;
    const { feedId, report, deletePost } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <FeedFilter
              query={query}
              from={from}
              userClasses={userClasses}
              postTypes={postTypes}
              classesList={processClasses({ classes: classList })}
              newClassExperience={campaign.newClassExperience}
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
              newClassExperience={campaign.newClassExperience}
              hasMore={hasMore}
              fromFeedId={fromFeedId}
              handleShare={this.handleShare}
              onPostClick={this.handlePostClick}
              onBookmark={this.handleBookmark}
              pushTo={push}
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

const mapStateToProps = ({ user, feed, campaign }: StoreState): {} => ({
  user,
  campaign,
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
