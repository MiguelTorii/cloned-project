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
    hasMore: boolean
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    items: [],
    hasMore: false
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
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
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
