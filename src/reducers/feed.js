/**
 * @flow
 */
import update from 'immutability-helper';
import { feedActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type FeedState = {
  items: Array<Object>,
  isLoading: boolean,
  error: boolean
};

const defaultState = {
  items: [],
  isLoading: false,
  error: false
};

export default (state: FeedState = defaultState, action: Action): FeedState => {
  switch (action.type) {
    case feedActions.FETCH_FEED_REQUEST:
      return update(state, {
        isLoading: { $set: true }
      });
    case feedActions.FETCH_FEED_SUCCESS:
      return update(state, {
        items: { $set: action.payload.items },
        isLoading: { $set: false }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
