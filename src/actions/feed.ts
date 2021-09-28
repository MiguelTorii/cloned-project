import { feedActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { FeedItem } from '../types/models';
import * as feedApi from '../api/feed';
import * as postsApi from '../api/posts';
import { FEEDS_PER_PAGE } from '../constants/app';
import { apiFetchFeeds } from '../api/feed';

const requestFetchFeed = (): Action => ({
  type: feedActions.FETCH_FEED_REQUEST
});

const updateFeed = ({ feed, hasMore }: { feed: FeedItem[]; hasMore: boolean }): Action => ({
  type: feedActions.FETCH_FEED_SUCCESS,
  payload: {
    feed,
    hasMore
  }
});

const setError = ({ title, body }: { title: string; body: string }): Action => ({
  type: feedActions.FETCH_FEED_ERROR,
  payload: {
    title,
    body
  }
});

const clearError = (): Action => ({
  type: feedActions.CLEAR_FEED_ERROR
});

const setBookmark = ({ feedId, bookmarked }: { feedId: number; bookmarked: boolean }): Action => ({
  type: feedActions.UPDATE_BOOKMARK_REQUEST,
  payload: {
    feedId,
    bookmarked
  }
});

const requestSearchFeed = (): Action => ({
  type: feedActions.SEARCH_FEED_REQUEST
});

const updateSearchFeed = ({ feed }: { feed: FeedItem[] }): Action => ({
  type: feedActions.SEARCH_FEED_SUCCESS,
  payload: {
    feed
  }
});

const updateFeedFilterFieldRequest = ({
  field,
  value
}: {
  field: string;
  value: string | number;
}) => ({
  type: feedActions.UPDATE_FEED_FILTER_FIELD_REQUEST,
  payload: {
    field,
    value
  }
});

const updateFeedLimitRequest = ({ limit }: { limit: number }) => ({
  type: feedActions.UPDATE_FEED_LIMIT_REQUEST,
  payload: {
    limit
  }
});

const clearFeedFilterRequest = () => ({
  type: feedActions.CLEAR_FEED_FILTER_REQUEST
});

const updateScrollDataRequest = ({ position, classId }: { position: number; classId: number }) => ({
  type: feedActions.UPDATE_SCROLL_DATA,
  payload: {
    position,
    classId
  }
});

const resetScrollDataRequest = () => ({
  type: feedActions.RESET_SCROLL_DATA
});

const clearFeedsAction = () => ({
  type: feedActions.CLEAR_FEEDS
});

/**
 * - This should be deprecated.
 * - It will be replaced by `actionFetchFeed`.
 */
export const fetchFeed =
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    try {
      const {
        feed: {
          data: { filters, items }
        },
        user: {
          data: { userId, schoolId }
        }
      } = getState();

      const { userClasses, postTypes, query, from, fromDate, toDate } = filters;
      dispatch(requestFetchFeed());
      const feed = await feedApi.fetchFeed({
        userId,
        schoolId,
        userClasses,
        index: items.length,
        limit: FEEDS_PER_PAGE,
        postTypes,
        from,
        query,
        fromDate,
        toDate
      });

      const hasMore = feed.length === FEEDS_PER_PAGE;

      dispatch(updateFeed({ feed, hasMore }));
    } catch (err) {
      dispatch(
        setError({
          title: 'Error Fetching Feed',
          body: 'Please contact us if the issue persists'
        })
      );
    }
  };

export const clearFeedError = () => async (dispatch: Dispatch) => dispatch(clearError());
export const clearFeeds = () => async (dispatch) => dispatch(clearFeedsAction());
export const updateScrollData =
  (scrollData: { position: number; classId: number }) => async (dispatch: Dispatch) =>
    dispatch(updateScrollDataRequest(scrollData));
export const resetScrollData = () => async (dispatch: Dispatch) =>
  dispatch(resetScrollDataRequest());
export const updateBookmark =
  ({ feedId, userId, bookmarked }: { feedId: number; userId: string; bookmarked: boolean }) =>
  async (dispatch: Dispatch) => {
    try {
      postsApi.bookmark({
        feedId,
        userId,
        remove: bookmarked
      });
      dispatch(
        setBookmark({
          feedId,
          bookmarked
        })
      );
    } catch (err) {
      dispatch(
        setError({
          title: 'Error Updating Bookmark',
          body: 'Please contact us if the issue persists'
        })
      );
    }
  };
export const searchFeed =
  ({ query }: { query: string }) =>
  async (dispatch: Dispatch) => {
    try {
      await dispatch(clearFeeds());
      dispatch(requestSearchFeed());
      const feed = await feedApi.queryFeed({
        query
      });
      dispatch(
        updateSearchFeed({
          feed
        })
      );
    } catch (err) {
      dispatch(
        setError({
          title: 'Error Fetching Feed',
          body: 'Please contact us if the issue persists'
        })
      );
    }
  };
export const updateFilter =
  ({ field, value }: { field: string; value: string | number }) =>
  async (dispatch: Dispatch) => {
    try {
      await dispatch(clearFeeds());
      await dispatch(
        updateFeedFilterFieldRequest({
          field,
          value
        })
      );
    } catch (err) {
      dispatch(
        setError({
          title: 'Error Updating Filter',
          body: 'Please contact us if the issue persists'
        })
      );
    }
  };
export const updateFeedLimit =
  ({ limit }: { limit: number }) =>
  async (dispatch: Dispatch) => {
    try {
      await dispatch(
        updateFeedLimitRequest({
          limit
        })
      );
      dispatch(fetchFeed());
    } catch (err) {
      dispatch(
        setError({
          title: 'Error Updating Limit',
          body: 'Please contact us if the issue persists'
        })
      );
    }
  };
export const clearFilter = () => async (dispatch: Dispatch) => {
  try {
    await dispatch(clearFeedFilterRequest());
    dispatch(fetchFeed());
  } catch (err) {
    dispatch(
      setError({
        title: 'Error Clearing Filter',
        body: 'Please contact us if the issue persists'
      })
    );
  }
};
export const updateFilterFields = (newFilter) => ({
  type: feedActions.UPDATE_FILTER_FIELDS,
  payload: newFilter
});
export const actionFetchFeed = (params, cancelToken) => ({
  type: feedActions.FETCH_FEED,
  apiCall: () => apiFetchFeeds(params, cancelToken)
});
export const actionDeleteFeed = (feedId) => ({
  type: feedActions.DELETE_FEED,
  payload: {
    feedId
  }
});
export const actionBookmarkFeed = ({ feedId, userId, bookmarked }) => ({
  type: feedActions.BOOKMARK_FEED,
  apiCall: () =>
    postsApi.bookmark({
      feedId,
      userId,
      remove: bookmarked
    }),
  meta: {
    feedId,
    bookmarked: !bookmarked
  }
});
