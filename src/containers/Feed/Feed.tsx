import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush, replace as routeReplace } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import lodash from 'lodash';
import axios from 'axios';
import { string } from 'prop-types';
import { processClasses } from '../ClassesSelector/utils';
import HeaderNavigation from './HeaderNavigation';
import { decypherClass } from '../../utils/crypto';
import ClassmatesDialog from '../../components/ClassmatesDialog/ClassmatesDialog';
import Tooltip from '../Tooltip/Tooltip';
import PostCreationHeader from './PostCreationHeader';
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
import { feedActions as feedActionTypes } from '../../constants/action-types';
import type { CampaignState } from '../../reducers/campaign';
import { isSame, buildPath } from '../../utils/helpers';
import { FEED_NAVIGATION_TABS, POST_WRITER, PROFILE_PAGE_SOURCE } from '../../constants/common';
import { FEEDS_PER_PAGE } from '../../constants/app';
import { APIFetchFeedsParams } from '../../api/params/APIFetchFeedsParams';

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
  actionFetchFeed?: (...args: Array<any>) => any;
  api?: Record<string, any>;
  bookmarkFeed?: (...args: Array<any>) => any;
  campaign?: CampaignState;
  classes?: Record<string, any>;
  classId?: number;
  clearFeeds?: (...args: Array<any>) => any;
  clearFilter?: (...args: Array<any>) => any;
  feed?: FeedState;
  feedId?: number | null | undefined;
  fetchFeed?: (...args: Array<any>) => any;
  from?: string;
  push?: (...args: Array<any>) => any;
  replace?: any;
  resetScrollData?: any;
  router?: Record<string, any>;
  sectionId?: number;
  updateBookmark?: (...args: Array<any>) => any;
  updateFilter?: (...args: Array<any>) => any;
  updateScrollData?: (...args: Array<any>) => any;
  user?: UserState;
  updateFilterFields?: any;
  deleteFeed?: any;
  openClassmates?: any;
};
type State = {
  activeAction: {
    type: string;
    data: any;
  };
  activeTab: any;
  feedId: number | null | undefined;
  report: Record<string, any> | null | undefined;
  deletePost: Record<string, any> | null | undefined;
  selectedClasses: Array<any>;
  isFiltering: boolean;
  isBeforeFirstLoad?: boolean;
  openClassmates?: any;
};
const FEED_ACTIONS = {
  SHARE: 'share',
  DELETE: 'delete',
  REPORT: 'report'
};

class Feed extends React.PureComponent<Props, State> {
  state: any = {
    activeAction: null,
    // Store the active action and its data.
    activeTab: FEED_NAVIGATION_TABS.CLASS_FEED,
    // Active navigation tab.
    isFiltering: false
  };

  cancelSource: Record<string, any>;

  mounted: boolean;

  handleUpdateSelectedSectionIds = (sectionIds) => {
    this.handleUpdateFilterFields({
      userClasses: sectionIds
    });
  };

  componentDidUpdate = (prevProps) => {
    const oldClasses = prevProps.user.userClasses;
    const {
      user: { userClasses: newClasses }
    } = this.props;

    // If classes are loaded later, update selected classes to be all if no class had been selected.
    if (
      lodash.isEmpty([...oldClasses.classList, ...oldClasses.pastClasses]) &&
      !lodash.isEmpty([...newClasses.classList, ...newClasses.pastClasses])
    ) {
      const {
        feed: {
          data: {
            filters: { userClasses, pastFilter }
          }
        }
      } = this.props;

      if (lodash.isEmpty(userClasses)) {
        const classes = pastFilter ? newClasses.pastClasses : newClasses.classList;
        this.handleUpdateFilterFields({
          userClasses: classes
            .map((classData) => classData.section?.[0].sectionId)
            .filter((sectionId) => !!sectionId)
        });
      }
    }
  };

  componentDidMount = () => {
    const {
      router: {
        location: { pathname, search }
      }
    } = this.props;
    const { sectionId, replace, feed, updateScrollData, user } = this.props;
    const { userClasses, bookmark, from } = feed.data.filters;
    const query = queryString.parse(search);
    const filter: any = {};
    let forceReload = query.reload === 'true';

    filter.pastFilter = query.pastFilter === 'true';

    // If a class is selected by URL params, filter class feed.
    if (sectionId) {
      filter.userClasses = [Number(sectionId)];
    } else if (lodash.isEmpty(userClasses)) {
      // If no classes are selected, select all classes by default.
      const { classList, pastClasses } = user.userClasses;
      const classes = filter.pastFilter ? pastClasses : classList;

      if (!classes?.length) {
        forceReload = true;
      }

      // Filter valid Section IDs
      filter.userClasses = (classes || [])
        .map((classData) => classData.section?.[0].sectionId)
        .filter((sectionId) => !!sectionId);
    }

    // Update filter
    this.handleUpdateFilterFields(filter, forceReload);
    // Initialize active tab
    let activeTab = FEED_NAVIGATION_TABS.CLASS_FEED;

    if (bookmark) {
      activeTab = FEED_NAVIGATION_TABS.BOOKMARKS;
    } else if (from === POST_WRITER.ME) {
      activeTab = FEED_NAVIGATION_TABS.MY_POSTS;
    }

    this.setState({
      activeTab
    });

    // If there was parameters in the url, it removes all url params.
    if (pathname === '/feed' && search) {
      replace('/feed');
    }

    this.cancelSource = axios.CancelToken.source();
    // Check scroll position
    const { position } = feed.scrollData;

    if (position) {
      window.scrollTo(0, position);
      updateScrollData({
        position: null
      });
    }
  };

  clearActiveAction = () => {
    this.setState({
      activeAction: null
    });
  };

  handleShare = ({ feedId }: { feedId: number }) => {
    this.setState({
      activeAction: {
        type: FEED_ACTIONS.SHARE,
        data: feedId
      }
    });
  };

  handleShareClose = () => {
    this.clearActiveAction();
  };

  handleBookmark = ({ feedId, bookmarked }: { feedId: number; bookmarked: boolean }) => {
    const {
      user: {
        data: { userId }
      },
      bookmarkFeed
    } = this.props;
    bookmarkFeed({
      feedId,
      userId,
      bookmarked
    });
  };

  handleReport = ({ feedId, ownerId, ownerName }) => {
    this.setState({
      activeAction: {
        type: FEED_ACTIONS.REPORT,
        data: {
          feedId,
          ownerId,
          ownerName
        }
      }
    });
  };

  handleReportClose = () => {
    this.clearActiveAction();
  };

  handleDelete = ({ feedId }) => {
    this.setState({
      activeAction: {
        type: FEED_ACTIONS.DELETE,
        data: feedId
      }
    });
  };

  handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    if (deleted && deleted === true) {
      const { deleteFeed } = this.props;
      const { activeAction } = this.state;
      deleteFeed(activeAction.data);
    }

    this.clearActiveAction();
  };

  handleChangeSearch = (query) => {
    this.handleUpdateFilterFields({
      query
    });
  };

  handleApplyFilters = (filter) => {
    this.handleUpdateFilterFields(filter);
  };

  handleUserClick = ({ userId }: { userId: string }) => {
    const { push } = this.props;
    push(
      buildPath(`/profile/${userId}`, {
        from: PROFILE_PAGE_SOURCE.POST
      })
    );
  };

  handleOpenFilter = () => {
    logEvent({
      event: 'Feed- Open Filter',
      props: {}
    });
  };

  handleChangeDateRange = (fromDate, toDate) => {
    this.handleUpdateFilterFields({
      fromDate,
      toDate
    });
  };

  // Fetch new page posts
  fetchMorePosts = () => {
    const { feed, user, actionFetchFeed } = this.props;
    const { filters, lastIndex } = feed.data;
    const { bookmark, from, fromDate, toDate, postTypes, query, userClasses } = filters;
    const { userId, schoolId } = user.data;

    const fetchParams: APIFetchFeedsParams = {
      index: lastIndex,
      limit: FEEDS_PER_PAGE,
      bookmarked: bookmark || undefined,
      query: query || undefined,
      section_id: userClasses,
      tool_type_id: postTypes,
      from_date: fromDate?.valueOf(),
      to_date: toDate?.valueOf()
    };

    switch (from) {
      case POST_WRITER.ME:
        fetchParams.user_id = userId ? Number(userId) : 0;
        break;

      case POST_WRITER.CLASSMATES:
        fetchParams.school_id = schoolId;
        break;

      default:
        break;
    }

    actionFetchFeed(fetchParams, this.cancelSource.token);
  };

  refetchPosts = () => {
    if (this.cancelSource) {
      this.cancelSource.cancel();
    }

    const { clearFeeds } = this.props;
    // Regenerate cancel token.
    this.cancelSource = axios.CancelToken.source();
    clearFeeds().then(this.fetchMorePosts);
  };

  handleUpdateFilterFields = (newFilter, forceReload = false) => {
    const { feed } = this.props;
    const currentFilter = feed.data.filters;
    // Remove non-modified filters
    Object.keys(newFilter).forEach((filterKey) => {
      if (isSame(currentFilter[filterKey], newFilter[filterKey])) {
        delete newFilter[filterKey];
      }
    });

    // Return if filter is not updated.
    if (!forceReload && lodash.isEmpty(newFilter)) {
      return;
    }

    const { updateFilterFields } = this.props;
    // Update filter on Redux and refetch posts
    updateFilterFields(newFilter).then(this.refetchPosts);
  };

  handlePostClick =
    ({ typeId, postId, feedId }: { typeId: number; postId: number; feedId: number }) =>
    () => {
      const { push, updateScrollData } = this.props;
      updateScrollData({
        position: window.pageYOffset
      });

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

        case 8:
          push(`/post/${postId}`);
          break;

        default:
          break;
      }
    };

  openClassmatesDialog = (openClassmates) => () => {
    this.setState({
      openClassmates
    });
  };

  closeClassmatesDialog = () => {
    this.setState({
      openClassmates: null
    });
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
      const { classId } = decypherClass();
      const selectedCourse = userClasses.classList.find((cl) => cl.classId === Number(classId));

      if (selectedCourse) {
        return selectedCourse.courseDisplayName;
      }
    }

    return '';
  };

  handleSetActiveTab = (tab) => {
    this.setState({
      activeTab: tab
    });

    switch (tab) {
      case FEED_NAVIGATION_TABS.CLASS_FEED: {
        this.handleUpdateFilterFields({
          from: POST_WRITER.CLASSMATES,
          bookmark: false
        });
        break;
      }

      case FEED_NAVIGATION_TABS.MY_POSTS: {
        this.handleUpdateFilterFields({
          from: POST_WRITER.ME,
          bookmark: false
        });
        break;
      }

      case FEED_NAVIGATION_TABS.BOOKMARKS: {
        this.handleUpdateFilterFields({
          from: POST_WRITER.CLASSMATES,
          bookmark: true
        });
        break;
      }

      default:
        break;
    }
  };

  render() {
    const {
      classes,
      push,
      user: {
        data: { userId, schoolId, firstName },
        userClasses: { classList: activeClasses, pastClasses },
        expertMode
      },
      feed: {
        data: {
          items,
          hasMore,
          filters: { postTypes, query, from, userClasses, fromDate, toDate, pastFilter }
        }
      },
      router: {
        location: { pathname }
      },
      feedId: fromFeedId,
      campaign,
      api
    } = this.props;
    const { activeAction, activeTab, openClassmates, isFiltering } = this.state;
    const classList = pastFilter ? pastClasses : activeClasses;
    let courseName = '';

    if (items.length > 0) {
      courseName = items[0].courseDisplayName;
    }

    const isLoadingPosts = !!api[feedActionTypes.FETCH_FEED]?.inProgress;
    const selectedClasses = classList
      .filter((classData: any) => userClasses.includes(classData.section?.[0]?.sectionId))
      .map((classData) => ({
        ...classData,
        sectionId: classData.section?.[0]?.sectionId
      }));
    return (
      <>
        <ErrorBoundary>
          <div className={classes.root}>
            <ClassmatesDialog
              userId={userId}
              selectedClasses={selectedClasses}
              userClasses={userClasses}
              close={this.closeClassmatesDialog}
              expertMode={expertMode} // state
              state={openClassmates}
              courseDisplayName={this.courseDisplayName()}
            />
            <HeaderNavigation
              selectedSectionIds={userClasses}
              setSelectedSectionIds={this.handleUpdateSelectedSectionIds}
              activeTab={activeTab}
              setActiveTab={this.handleSetActiveTab}
              firstName={firstName}
              schoolId={schoolId}
              classList={classList}
              openClassmatesDialog={this.openClassmatesDialog}
              pathname={pathname}
              expertMode={expertMode}
              push={push}
            />
            {selectedClasses.length === 1 && !selectedClasses[0].isCurrent ? null : (
              <PostCreationHeader />
            )}
            <FeedFilter
              query={query}
              from={from}
              userClasses={userClasses}
              expertMode={expertMode}
              courseDisplayName={courseName}
              postTypes={postTypes}
              classesList={processClasses({
                classes: classList
              })}
              classList={classList}
              newClassExperience={campaign.newClassExperience}
              fromDate={fromDate}
              toDate={toDate}
              onApplyFilters={this.handleApplyFilters}
              onOpenFilter={this.handleOpenFilter}
              onRefresh={this.refetchPosts}
              onChangeDateRange={this.handleChangeDateRange}
              onChangeSearch={this.handleChangeSearch}
            />
            <Tooltip
              id={9045}
              hidden={!expertMode}
              placement="right-start"
              text="When you're in Expert Mode, you see posts from all your classes at once."
            >
              <FeedList
                isLoading={isLoadingPosts}
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
                onLoadMore={this.fetchMorePosts}
                onUserClick={this.handleUserClick}
                isFiltering={isFiltering}
              />
            </Tooltip>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <SharePost
            feedId={activeAction?.data}
            open={activeAction?.type === FEED_ACTIONS.SHARE}
            onClose={this.handleShareClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Report
            open={activeAction?.type === FEED_ACTIONS.REPORT}
            ownerId={activeAction?.data.ownerId || ''}
            ownerName={activeAction?.data.ownerName || ''}
            objectId={activeAction?.data.feedId || -1}
            onClose={this.handleReportClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <DeletePost
            open={activeAction?.type === FEED_ACTIONS.DELETE}
            feedId={activeAction?.data}
            onClose={this.handleDeleteClose}
          />
        </ErrorBoundary>
      </>
    );
  }
}

const mapStateToProps = ({ router, user, feed, campaign, api }: StoreState): {} => ({
  api,
  user,
  campaign,
  router,
  feed
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      push: routePush,
      replace: routeReplace,
      deleteFeed: feedActions.actionDeleteFeed,
      actionFetchFeed: feedActions.actionFetchFeed,
      bookmarkFeed: feedActions.actionBookmarkFeed,
      updateFilter: feedActions.updateFilter,
      clearFilter: feedActions.clearFilter,
      updateScrollData: feedActions.updateScrollData,
      resetScrollData: feedActions.resetScrollData,
      clearFeeds: feedActions.clearFeeds,
      updateFilterFields: feedActions.updateFilterFields
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(Feed));
