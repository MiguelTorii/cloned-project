import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { push } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import lodash from 'lodash';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ClassmatesDialog from '../../components/ClassmatesDialog/ClassmatesDialog';
import HeaderNavigation from './HeaderNavigation';
import PostCreationHeader from './PostCreationHeader';
import FeedFilter from '../../components/FeedFilter/FeedFilter';
import { processClasses } from '../ClassesSelector/utils';
import Tooltip from '../Tooltip/Tooltip';
import FeedList from '../../components/FeedList/FeedList';
import SharePost from '../SharePost/SharePost';
import Report from '../../components/Report/ReportIssue';
import DeletePost from '../DeletePost/DeletePost';
import {
  COMMUNITY_SCROLL_CONTAINER_ID,
  FEED_CLEARED_INDEX,
  FEED_NAVIGATION_TABS,
  POST_WRITER,
  PROFILE_PAGE_SOURCE
} from 'constants/common';
import { AppState } from 'redux/store';
import { User } from '../../types/models';
import {
  actionBookmarkFeed,
  actionDeleteFeed,
  actionFetchFeed,
  clearFeedsAction,
  resetScrollData,
  updateFilterFields,
  updateScrollDataRequest
} from '../../actions/feed';
import { CampaignState } from '../../reducers/campaign';
import { TFeedData } from '../../reducers/feed';
import { logEvent } from '../../api/analytics';
import { buildPath, isSame } from '../../utils/helpers';
import { FEEDS_PER_PAGE, POST_TYPES } from '../../constants/app';
import { TUserClasses } from '../../reducers/user';
import { decipherClassId } from '../../utils/crypto';
import { APIFetchFeedsParams } from '../../api/params/APIFetchFeedsParams';
import { feedActions as feedActionTypes } from '../../constants/action-types';
import { URL } from 'constants/navigation';

type Props = {
  from?: string;
  feedId?: number;
  classId?: number;
  sectionId?: number;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  }
}));

const FEED_ACTIONS = {
  SHARE: 'share',
  DELETE: 'delete',
  REPORT: 'report'
};

const Feed = ({ from }: Props) => {
  const classes = useStyles();
  const profile = useSelector<AppState, User>((state) => state.user.data);
  const myClasses = useSelector<AppState, TUserClasses>((state) => state.user.userClasses);
  const isExpertMode = useSelector<AppState, boolean>((state) => state.user.expertMode);
  const campaign = useSelector<AppState, CampaignState>((state) => state.campaign);
  const isLoadingPosts = !!useSelector<AppState, boolean>(
    (state) => state.api[feedActionTypes.FETCH_FEED]?.inProgress
  );
  const lastScrollPosition = useSelector<AppState, number>(
    (state) => state.feed.lastScrollPosition
  );
  const {
    filters: feedFilters,
    items: feedItems,
    hasMore: hasMoreFeed,
    lastIndex: lastFeedIndex
  } = useSelector<AppState, TFeedData>((state) => state.feed.data);
  const location = useLocation();
  const dispatch = useDispatch();

  // States
  const [activeTab, setActiveTab] = useState(FEED_NAVIGATION_TABS.CLASS_FEED);
  const [openClassmates, setOpenClassmates] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  // Memos
  const searchParams = useMemo(() => qs.parse(location.search), [location.search]);

  // Copied logic from old version, not sure what it does.
  const courseName = useMemo(() => {
    if (feedItems.length > 0) {
      return feedItems[0].courseDisplayName;
    }
    return '';
  }, [feedItems]);

  // Copied logic from old version, not sure what it does.
  const courseDisplayName = useMemo(() => {
    const paramClass = decipherClassId(searchParams.class as string);
    if (!paramClass) {
      return '';
    }

    const selectedClass = myClasses.classList.find(
      (classItem) => classItem.classId === paramClass.classId
    );

    return selectedClass?.courseDisplayName || '';
  }, [myClasses, searchParams]);

  const classList = useMemo(
    () => (feedFilters.pastFilter ? myClasses.pastClasses : myClasses.classList),
    [myClasses, feedFilters.pastFilter]
  );

  const selectedClasses = useMemo(
    () =>
      classList
        .filter((classData: any) =>
          feedFilters.userClasses.includes(classData.section?.[0]?.sectionId)
        )
        .map((classData) => ({
          ...classData,
          sectionId: classData.section?.[0]?.sectionId
        })),
    [classList, feedFilters.userClasses]
  );

  // Handlers
  const handleCloseClassmatesModal = useCallback(() => setOpenClassmates(null), []);
  const handleClearActiveAction = useCallback(() => setActiveAction(null), []);

  const handleFetchMorePosts = () => {
    const fetchParams: APIFetchFeedsParams = {
      index: lastFeedIndex === FEED_CLEARED_INDEX ? 0 : lastFeedIndex,
      limit: FEEDS_PER_PAGE,
      bookmarked: feedFilters.bookmark || undefined,
      query: feedFilters.query || undefined,
      section_id: feedFilters.userClasses,
      tool_type_id: feedFilters.postTypes,
      from_date: feedFilters.fromDate?.valueOf(),
      to_date: feedFilters.toDate?.valueOf()
    };

    switch (feedFilters.from) {
      case POST_WRITER.ME:
        fetchParams.user_id = profile.userId ? Number(profile.userId) : 0;
        break;

      case POST_WRITER.CLASSMATES:
        fetchParams.school_id = profile.schoolId;
        break;

      default:
        break;
    }

    dispatch(actionFetchFeed(fetchParams));
  };

  const handleRefresh = () => {
    dispatch(clearFeedsAction());
  };

  const handleUpdateFilters = (newFilter, forceReload = false) => {
    // Remove non-modified filters
    Object.keys(newFilter).forEach((filterKey) => {
      if (isSame(feedFilters[filterKey], newFilter[filterKey])) {
        delete newFilter[filterKey];
      }
    });

    // Return if filter is not updated.
    if (!forceReload && lodash.isEmpty(newFilter)) {
      return;
    }

    dispatch(updateFilterFields(newFilter));
    dispatch(clearFeedsAction());
  };

  const handleOpenFilter = useCallback(() => {
    logEvent({
      event: 'Feed- Open Filter',
      props: {}
    });
  }, []);

  const handleSetActiveTab = (tab) => {
    switch (tab) {
      case FEED_NAVIGATION_TABS.CLASS_FEED: {
        handleUpdateFilters({
          from: POST_WRITER.CLASSMATES,
          bookmark: false
        });
        break;
      }
      case FEED_NAVIGATION_TABS.MY_POSTS: {
        handleUpdateFilters({
          from: POST_WRITER.ME,
          bookmark: false
        });
        break;
      }
      case FEED_NAVIGATION_TABS.BOOKMARKS: {
        handleUpdateFilters({
          from: POST_WRITER.CLASSMATES,
          bookmark: true
        });
        break;
      }
      default:
        break;
    }

    setActiveTab(tab);
  };

  const handleDeleteClose = useCallback(
    ({ deleted }: { deleted?: boolean }) => {
      if (deleted === true) {
        dispatch(actionDeleteFeed(activeAction.data));
      }
      handleClearActiveAction();
    },
    [dispatch, activeAction, handleClearActiveAction]
  );

  const handleChangeSearch = (query) => {
    handleUpdateFilters({ query });
  };

  const handleChangeDateRange = (fromDate, toDate) => {
    handleUpdateFilters({ fromDate, toDate });
  };

  const handleUpdateSelectedClasses = (sectionIds) => {
    handleUpdateFilters({
      userClasses: sectionIds
    });
  };

  const handleClickUser = ({ userId }: { userId: string }) => {
    dispatch(
      push(
        buildPath(`${URL.PROFILE}/${userId}`, {
          from: PROFILE_PAGE_SOURCE.POST
        })
      )
    );
  };

  const handleOpenDelete = useCallback(({ feedId }) => {
    setActiveAction({
      type: FEED_ACTIONS.DELETE,
      data: feedId
    });
  }, []);

  const handleOpenReport = useCallback(({ feedId, ownerId, ownerName }) => {
    setActiveAction({
      type: FEED_ACTIONS.REPORT,
      data: { feedId, ownerId, ownerName }
    });
  }, []);

  const handleBookmark = useCallback(
    ({ feedId, bookmarked }) => {
      dispatch(
        actionBookmarkFeed({
          feedId,
          bookmarked,
          userId: profile.userId
        })
      );
    },
    [dispatch, profile.userId]
  );

  const handleShare = useCallback(({ feedId }) => {
    setActiveAction({
      type: FEED_ACTIONS.SHARE,
      data: feedId
    });
  }, []);

  const handleClickPost = useCallback(
    ({ typeId, postId }) => {
      const scrollContainer = document.getElementById(COMMUNITY_SCROLL_CONTAINER_ID);
      if (scrollContainer) {
        dispatch(updateScrollDataRequest(scrollContainer.scrollTop));
      }

      let redirectUrl = null;

      switch (typeId) {
        case POST_TYPES.FLASHCARDS:
          redirectUrl = `/flashcards/${postId}`;
          break;
        case POST_TYPES.NOTE:
          redirectUrl = `/notes/${postId}`;
          break;
        case POST_TYPES.LINK:
          redirectUrl = `/sharelink/${postId}`;
          break;
        case POST_TYPES.QUESTION:
          redirectUrl = `/question/${postId}`;
          break;
        case POST_TYPES.POST:
          redirectUrl = `/post/${postId}`;
          break;
        default:
          throw Error('Unknown post type');
      }

      dispatch(push(redirectUrl));
    },
    [dispatch]
  );

  useEffect(() => {
    // Initialize data only after classes are loaded.
    if (myClasses.classList.length === 0) {
      return;
    }

    const filter: any = {};
    const paramClass = decipherClassId(searchParams.class as string);

    let forceReload = searchParams.reload === 'true';

    filter.pastFilter = searchParams.pastFilter === 'true';

    // If a class is selected by URL params, filter class feed.
    if (paramClass?.sectionId) {
      filter.userClasses = [Number(paramClass?.sectionId)];
    } else if (lodash.isEmpty(feedFilters.userClasses)) {
      // If no classes are selected, select all classes by default.
      const { classList, pastClasses } = myClasses;
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
    handleUpdateFilters(filter, forceReload);

    // Initialize active tab
    let activeTab = FEED_NAVIGATION_TABS.CLASS_FEED;

    if (feedFilters.bookmark) {
      activeTab = FEED_NAVIGATION_TABS.BOOKMARKS;
    } else if (from === POST_WRITER.ME) {
      activeTab = FEED_NAVIGATION_TABS.MY_POSTS;
    }

    setActiveTab(activeTab);

    if (lastScrollPosition) {
      const scrollContainer = document.getElementById(COMMUNITY_SCROLL_CONTAINER_ID);
      if (scrollContainer) {
        scrollContainer.scrollTop = lastScrollPosition;
      }
      dispatch(resetScrollData());
    }
  }, [searchParams, myClasses]);

  useEffect(() => {
    // This means posts are cleared by updating any filter or refreshing, where needs to fetch posts.
    if (lastFeedIndex === FEED_CLEARED_INDEX) {
      handleFetchMorePosts();
    }
  }, [lastFeedIndex]);

  return (
    <>
      <ErrorBoundary>
        <div className={classes.root}>
          <ClassmatesDialog
            userId={profile.userId}
            selectedClasses={selectedClasses}
            userClasses={feedFilters.userClasses}
            close={handleCloseClassmatesModal}
            expertMode={isExpertMode} // state
            state={openClassmates}
            courseDisplayName={courseDisplayName}
          />
          <HeaderNavigation
            selectedSectionIds={feedFilters.userClasses}
            setSelectedSectionIds={handleUpdateSelectedClasses}
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            firstName={profile.firstName}
            schoolId={profile.schoolId}
            classList={classList}
            openClassmatesDialog={setOpenClassmates}
            pathname={location.pathname}
            expertMode={isExpertMode}
            push={(path) => dispatch(push(path))}
          />
          {selectedClasses.length === 1 && !selectedClasses[0].isCurrent ? null : (
            <PostCreationHeader />
          )}
          <FeedFilter
            query={feedFilters.query}
            from={from}
            userClasses={feedFilters.userClasses}
            expertMode={isExpertMode}
            courseDisplayName={courseName}
            postTypes={feedFilters.postTypes}
            classesList={processClasses({
              classes: classList
            })}
            classList={classList}
            newClassExperience={campaign.newClassExperience}
            fromDate={feedFilters.fromDate}
            toDate={feedFilters.toDate}
            onApplyFilters={handleUpdateFilters}
            onOpenFilter={handleOpenFilter}
            onRefresh={handleRefresh}
            onChangeDateRange={handleChangeDateRange}
            onChangeSearch={handleChangeSearch}
          />
          <Tooltip
            id={9045}
            hidden={!isExpertMode}
            placement="right-start"
            text="When you're in Expert Mode, you see posts from all your classes at once."
          >
            <FeedList
              isLoading={isLoadingPosts}
              userId={profile.userId}
              schoolId={profile.schoolId}
              items={feedItems}
              expertMode={isExpertMode}
              newClassExperience={campaign.newClassExperience}
              hasMore={hasMoreFeed}
              // fromFeedId={fromFeedId}
              classList={classList}
              handleShare={handleShare}
              onPostClick={handleClickPost}
              onBookmark={handleBookmark}
              pushTo={push}
              onReport={handleOpenReport}
              onDelete={handleOpenDelete}
              onLoadMore={handleFetchMorePosts}
              onUserClick={handleClickUser}
              // isFiltering={isFiltering}
              isHud={campaign.hud}
            />
          </Tooltip>
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <SharePost
          feedId={activeAction?.data}
          open={activeAction?.type === FEED_ACTIONS.SHARE}
          onClose={handleClearActiveAction}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <Report
          open={activeAction?.type === FEED_ACTIONS.REPORT}
          ownerId={activeAction?.data.ownerId || ''}
          ownerName={activeAction?.data.ownerName || ''}
          objectId={activeAction?.data.feedId || -1}
          onClose={handleClearActiveAction}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <DeletePost
          open={activeAction?.type === FEED_ACTIONS.DELETE}
          feedId={activeAction?.data}
          onClose={handleDeleteClose}
        />
      </ErrorBoundary>
    </>
  );
};

export default Feed;
