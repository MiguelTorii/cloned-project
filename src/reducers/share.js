/**
 * @flow
 */
import update from 'immutability-helper';
import { shareActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type ShareState = {
  isLoading: boolean,
  open: boolean,
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  open: false,
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  }
};

export default (
  state: ShareState = defaultState,
  action: Action
): ShareState => {
  switch (action.type) {
    case shareActions.OPEN_SHARE_LINK:
      return update(state, {
        open: { $set: true }
      });
    case shareActions.CLOSE_SHARE_LINK:
      return update(state, {
        open: { $set: false }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
