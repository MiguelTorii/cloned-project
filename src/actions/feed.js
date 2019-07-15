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

export const fetchFeed = ({
  userId,
  schoolId,
  classId,
  sectionId,
  index = 0,
  limit,
  postType,
  from,
  query
}: {
  userId: string,
  schoolId: number,
  classId: number,
  sectionId: number,
  index: number,
  limit: number,
  postType: number,
  from: string,
  query: string
}) => async (dispatch: Dispatch) => {
  try {
    dispatch(requestFetchFeed());
    const feed = await feedApi.fetchFeed({
      userId,
      schoolId,
      classId,
      sectionId,
      index,
      limit,
      postType,
      from,
      query
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

export const updateBookmark = ({
  feedId,
  userId,
  bookmarked
}: {
  feedId: number,
  userId: string,
  bookmarked: boolean
}) => async (dispatch: Dispatch) => {
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

export const searchFeed = ({ query }: { query: string }) => async (
  dispatch: Dispatch
) => {
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
