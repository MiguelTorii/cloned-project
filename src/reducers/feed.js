/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import { rootActions, feedActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Feed } from '../types/models';

export type FeedState = {
  isLoading: boolean,
  data: {
    items: Feed,
    hasMore: boolean,
    filters: {
      userClasses: Array<string>,
      index: number,
      limit: number,
      postTypes: Array<string>,
      from: string,
      query: string,
      fromDate: ?Object,
      toDate: ?Object
    }
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  },
  scrollData: {
    position: number,
    classId: string,
  }
};

const defaultState = {
  data: {
    items: [],
    hasMore: false,
    filters: {
      // userClass: JSON.stringify({ classId: -1, sectionId: -1 }),
      userClasses: [],
      index: 0,
      limit: 10,
      postTypes: [],
      from: 'everyone',
      query: '',
      fromDate: null,
      toDate: null
    }
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  },
  scrollData: {
    position: 0,
    classId: -1,
  }
};

export default (state: FeedState = defaultState, action: Action): FeedState => {
  switch (action.type) {
  case feedActions.SEARCH_FEED_REQUEST:
  case feedActions.FETCH_FEED_REQUEST:
    return update(state, {
      error: { $set: defaultState.error },
      errorMessage: { $set: defaultState.errorMessage },
      isLoading: { $set: true }
    });
  case feedActions.FETCH_FEED_SUCCESS:
    return update(state, {
      data: {
        // $FlowFixMe
        items: { $set: action.payload.feed },
        // $FlowFixMe
        hasMore: { $set: action.payload.hasMore }
      },
      errorMessage: { $set: defaultState.errorMessage },
      isLoading: { $set: false }
    });
  case feedActions.SEARCH_FEED_SUCCESS:
    return update(state, {
      data: {
        // $FlowFixMe
        items: { $set: action.payload.feed }
      },
      errorMessage: { $set: defaultState.errorMessage },
      isLoading: { $set: false }
    });
  case feedActions.FETCH_FEED_ERROR:
    return update(state, {
      error: { $set: true },
      errorMessage: {
        // $FlowFixMe
        title: { $set: action.payload.title },
        // $FlowFixMe
        body: { $set: action.payload.body }
      },
      isLoading: { $set: false }
    });
  case feedActions.CLEAR_FEED_ERROR:
    return update(state, {
      error: { $set: defaultState.error },
      errorMessage: { $set: defaultState.errorMessage },
      isLoading: { $set: false }
    });
  case feedActions.UPDATE_BOOKMARK_REQUEST:
    return update(state, {
      data: {
        items: {
          $apply: b => {
            const index = b.findIndex(
              // $FlowFixMe
              item => item.feedId === action.payload.feedId
            );
            if (index > -1) {
              return update(b, {
                [index]: {
                  // $FlowFixMe
                  bookmarked: { $set: !action.payload.bookmarked }
                }
              });
            }
            return b;
          }
        }
      }
    });
  case feedActions.UPDATE_FEED_FILTER_FIELD_REQUEST:
    return update(state, {
      data: {
        filters: {
          // $FlowFixMe
          [action.payload.field]: { $set: action.payload.value }
        }
      }
    });
  case feedActions.UPDATE_FEED_LIMIT_REQUEST:
    return update(state, {
      data: {
        filters: {
          // $FlowFixMe
          limit: { $set: action.payload.limit }
        }
      }
    });
  case feedActions.CLEAR_FEED_FILTER_REQUEST:
    return update(state, {
      data: {
        filters: { $set: defaultState.data.filters }
      }
    });
  case feedActions.UPDATE_SCROLL_DATA:
    return update(state, {
      scrollData: { $set: action.payload }
    });
  case feedActions.RESET_SCROLL_DATA:
    return update(state, {
      scrollData: { $set: defaultState.scrollData }
    });
  case rootActions.CLEAR_STATE:
    return defaultState;
  default:
    return state;
  }
};
