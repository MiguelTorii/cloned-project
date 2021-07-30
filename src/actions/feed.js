// @flow

import { feedActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { Feed } from '../types/models';
import * as feedApi from '../api/feed';
import * as postsApi from '../api/posts';

const requestFetchFeed = (): Action => ({
  type: feedActions.FETCH_FEED_REQUEST
});

const updateFeed = ({
  feed,
  hasMore
}: {
  feed: Feed,
  hasMore: boolean
}): Action => ({
  type: feedActions.FETCH_FEED_SUCCESS,
  payload: {
    feed,
    hasMore
  }
});

const setError = ({
  title,
  body
}: {
  title: string,
  body: string
}): Action => ({
  type: feedActions.FETCH_FEED_ERROR,
  payload: {
    title,
    body
  }
});

const clearError = (): Action => ({
  type: feedActions.CLEAR_FEED_ERROR
});

const setBookmark = ({
  feedId,
  bookmarked
}: {
  feedId: number,
  bookmarked: boolean
}): Action => ({
  type: feedActions.UPDATE_BOOKMARK_REQUEST,
  payload: {
    feedId,
    bookmarked
  }
});

const requestSearchFeed = (): Action => ({
  type: feedActions.SEARCH_FEED_REQUEST
});

const updateSearchFeed = ({ feed }: { feed: Feed }): Action => ({
  type: feedActions.SEARCH_FEED_SUCCESS,
  payload: {
    feed
  }
});

const updateFeedFilterFieldRequest = ({
  field,
  value
}: {
  field: string,
  value: string | number
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

const updateScrollDataRequest = ({
  position,
  classId
}: {
  position: number,
  classId: string
}) => ({
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

export const fetchFeed =
  () => async (dispatch: Dispatch, getState: Function) => {
    try {
      const {
        feed: {
          data: { filters }
        },
        user: {
          data: { userId, schoolId }
        }
      } = getState();

      const {
        userClasses,
        index,
        limit,
        postTypes,
        query,
        from,
        fromDate,
        toDate
      } = filters;

      dispatch(requestFetchFeed());
      const feed = await feedApi.fetchFeed({
        userId,
        schoolId,
        userClasses,
        index,
        limit,
        postTypes,
        from,
        query,
        fromDate,
        toDate
      });

      const hasMore = feed.length === limit;

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

export const clearFeedError = () => async (dispatch: Dispatch) =>
  dispatch(clearError());

export const clearFeeds = () => async (dispatch) =>
  dispatch(clearFeedsAction());

export const updateScrollData =
  (scrollData: { position: number, clasId: number }) =>
  async (dispatch: Dispatch) =>
    dispatch(updateScrollDataRequest(scrollData));

export const resetScrollData = () => async (dispatch: Dispatch) =>
  dispatch(resetScrollDataRequest());

export const updateBookmark =
  ({
    feedId,
    userId,
    bookmarked
  }: {
    feedId: number,
    userId: string,
    bookmarked: boolean
  }) =>
  async (dispatch: Dispatch) => {
    try {
      postsApi.bookmark({ feedId, userId, remove: bookmarked });
      dispatch(setBookmark({ feedId, bookmarked }));
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
      dispatch(requestSearchFeed());
      const feed = await feedApi.queryFeed({
        query
      });

      dispatch(updateSearchFeed({ feed }));
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
  ({ field, value }: { field: string, value: string | number }) =>
  async (dispatch: Dispatch) => {
    try {
      await dispatch(updateFeedLimitRequest({ limit: 10 }));
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
