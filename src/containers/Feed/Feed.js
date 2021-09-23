// @flow

import React from 'react';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { processClasses } from 'containers/ClassesSelector/utils';
import queryString from 'query-string';
import HeaderNavigation from 'containers/Feed/HeaderNavigation';
import { decypherClass } from 'utils/crypto';
import ClassmatesDialog from 'components/ClassmatesDialog/ClassmatesDialog';
import Tooltip from 'containers/Tooltip/Tooltip';
import PostCreationHeader from 'containers/Feed/PostCreationHeader';
import FeedList from '../../components/FeedList/FeedList';
import FeedFilter from '../../components/FeedFilter/FeedFilter';
import Report from '../../components/Report/ReportIssue';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { FeedState } from '../../reducers/feed';
import { logEvent } from '../../api/analytics';
import SharePost from '../SharePost/SharePost';
import DeletePost from '../DeletePost/DeletePost';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
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
  router: Object,
  sectionId: number,
  from: boolean,
  push: Function,
  fetchFeed: Function,
  updateBookmark: Function,
  updateFilter: Function,
  clearFilter: Function,
  campaign: CampaignState,
  updateScrollData: Function,
  clearFeeds: Function
};

type State = {
  feedId: ?number,
  report: ?Object,
  deletePost: ?Object,
  selectedClasses: Array,
  isFiltering: boolean
};

class Feed extends React.PureComponent<Props, State> {
  state = {
    feedId: null,
    report: null,
    deletePost: null,
    selectedClasses: [],
    isFiltering: false,
    isBeforeFirstLoad: true // This is used to display loading state from the beginning.
  };

  mounted: boolean;

  componentDidUpdate(prevProps) {
    const { from } = this.props;
    if (from !== prevProps.from) {
      this.handleUpdateFilter();
    }
  }

  setSelectedClasses = (selectedClasses) => {
    this.setState({ selectedClasses });
  };

  handleUpdateFilter = () => {
    const { from, updateFilter } = this.props;
    if (from) {
      updateFilter({ field: 'from', value: from });
    } else {
      updateFilter({ field: 'from', value: 'everyone' });
    }
  };

  componentDidMount = async () => {
    this.mounted = true;
    const {
      classId,
      sectionId,
      updateFilter,
      feed: { scrollData },
      resetScrollData
      // push,
      // user: {
      // expertMode
      // }
    } = this.props;
    // if (!expertMode && !classId) push('/')

    if (classId >= 0 && sectionId >= 0) {
      updateFilter({
        field: 'userClasses',
        value: [JSON.stringify({ classId, sectionId })]
      });
    }

    this.handleUpdateFilter();

    window.addEventListener('offline', () => {
      if (
        this.handleFetchFeed.cancel &&
        typeof this.handleFetchFeed.cancel === 'function'
      ) { this.handleFetchFeed.cancel(); }
    });
    window.addEventListener('online', () => {
      this.handleFetchFeed();
    });

    this.handleFetchFeed = debounce(this.handleFetchFeed, 521);
    await this.handleFetchFeed();

    if (classId === scrollData.classId) {
      window.scrollTo(0, scrollData.position);
    }

    resetScrollData();
  };

  componentWillUnmount = () => {
    this.mounted = false;
    if (
      this.handleFetchFeed.cancel &&
      typeof this.handleFetchFeed.cancel === 'function'
    ) { this.handleFetchFeed.cancel(); }
  };

  handleFetchFeed = async () => {
    const { fetchFeed } = this.props;
    try {
      await fetchFeed();
      this.setState({
        isBeforeFirstLoad: false
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isFiltering: false });
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

  handleReport = ({ feedId, ownerId, ownerName }) => {
    this.setState({ report: { feedId, ownerId, ownerName } });
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

  handleChange = (name) => async (event) => {
    const { updateFilter } = this.props;
    await updateFilter({ field: name, value: event.target.value });
    this.handleFetchFeed();
  };

  handleApplyFilters = (filters) => {
    const { updateFilter } = this.props;
    // eslint-disable-next-line no-restricted-syntax
    this.setState({ isFiltering: true });
    for (const filter of filters) {
      updateFilter({ field: filter.name, value: filter.value });
    }
    this.setState({
      isBeforeFirstLoad: true
    });
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
    const { fetchFeed } = this.props;
    fetchFeed();
  };

  updateFeed = async (filters) => {
    const { updateFilter } = this.props;
    await updateFilter({
      field: 'userClasses',
      value: filters
    });
    this.handleFetchFeed();
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
    const { clearFeeds } = this.props;

    clearFeeds();
    this.setState({
      isBeforeFirstLoad: true
    });
    this.handleFetchFeed();
  };

  handleChangeDateRange = (range, date) => {
    const { updateFilter } = this.props;
    updateFilter({ field: range, value: date });
    this.handleFetchFeed();
  };

  handlePostClick =
    ({
      typeId,
      postId,
      feedId
    }: {
      typeId: number,
      postId: number,
      feedId: number
    }) =>
      () => {
        const { push, updateScrollData, classId } = this.props;
        const { search } = window.location;
        const query = queryString.parse(search);
        const newQuery = queryString.stringify({ ...query, id: feedId });
        updateScrollData({ position: window.pageYOffset, classId });
        push(`/feed?${newQuery}`);
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
          case 8:
            push(`/post/${postId}${search}`);
            break;
          default:
            break;
        }
      };

  openClassmatesDialog = (openClassmates) => () => {
    this.setState({ openClassmates });
  };

  closeClassmatesDialog = () => {
    this.setState({ openClassmates: null });
  };

  courseDisplayName = () => {
    const {
      user: { userClasses },
      router: {
        location: { search }
      }
    } = this.props;
    const query = queryString.parse(search);

    if (query.class && userClasses?.classList) {
      const { classId } = decypherClass(query.class);
      const selectedCourse = userClasses.classList.find(
        (cl) => cl.classId === Number(classId)
      );
      if (selectedCourse) { return selectedCourse.courseDisplayName; }
    }
    return '';
  };

  render() {
    const {
      classes,
      push,
      user: {
        data: { userId, schoolId, firstName },
        userClasses: { classList },
        expertMode
      },
      feed: {
        data: {
          items,
          hasMore,
          filters: { postTypes, query, from, userClasses, fromDate, toDate }
        },
        isLoading
      },
      router: {
        location: { search, pathname, state }
      },
      feedId: fromFeedId,
      campaign
    } = this.props;
    const {
      feedId,
      report,
      deletePost,
      openClassmates,
      selectedClasses,
      isBeforeFirstLoad,
      isFiltering
    } = this.state;

    let courseName = '';

    if (items.length > 0) {
      courseName = items[0].courseDisplayName;
    }

    return (
      <>
        <ErrorBoundary>
          <div className={classes.root}>
            <ClassmatesDialog
              userId={userId}
              selectedClasses={selectedClasses}
              userClasses={userClasses}
              close={this.closeClassmatesDialog}
              expertMode={expertMode}
              // state
              state={openClassmates}
              courseDisplayName={this.courseDisplayName()}
            />
            <HeaderNavigation
              selectedClasses={selectedClasses}
              setSelectedClasses={this.setSelectedClasses}
              firstName={firstName}
              schoolId={schoolId}
              state={state}
              classList={classList}
              openClassmatesDialog={this.openClassmatesDialog}
              pathname={pathname}
              expertMode={expertMode}
              search={search}
              updateFeed={this.updateFeed}
              push={push}
            />
            {selectedClasses.length === 1 &&
            !selectedClasses[0].isCurrent ? null : (
              <PostCreationHeader />
            )}
            <FeedFilter
              query={query}
              from={from}
              userClasses={userClasses}
              expertMode={expertMode}
              courseDisplayName={courseName}
              postTypes={postTypes}
              classesList={processClasses({ classes: classList })}
              classList={classList}
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
            <Tooltip
              id={9045}
              hidden={!expertMode}
              placement="right-start"
              text="When you're in Expert Mode, you see posts from all your classes at once."
            >
              <FeedList
                isLoading={isBeforeFirstLoad || isLoading}
                userId={userId}
                schoolId={schoolId}
                items={items}
                expertMode={expertMode}
                newClassExperience={campaign.newClassExperience}
                hasMore={hasMore}
                fromFeedId={fromFeedId}
                classList={classList}
                handleShare={this.handleShare}
                onPostClick={this.handlePostClick}
                onBookmark={this.handleBookmark}
                pushTo={push}
                onReport={this.handleReport}
                onDelete={this.handleDelete}
                onLoadMore={this.handleLoadMore}
                onUserClick={this.handleUserClick}
                isFiltering={isFiltering}
              />
            </Tooltip>
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
            ownerName={(report || {}).ownerName || ''}
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
      </>
    );
  }
}

const mapStateToProps = ({ router, user, feed, campaign }: StoreState): {} => ({
  user,
  campaign,
  router,
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
      updateScrollData: feedActions.updateScrollData,
      resetScrollData: feedActions.resetScrollData,
      clearFeeds: feedActions.clearFeeds
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
