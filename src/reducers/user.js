/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import { signInActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { User } from '../types/models';

export type FiltersState = {
  isLoading: boolean,
  user: User,
  error: boolean
};

const defaultState = {
  user: {},
  isLoading: false,
  error: false
};

export default (
  state: FiltersState = defaultState,
  action: Action
): FiltersState => {
  switch (action.type) {
    case signInActions.SIGN_IN_USER_SUCCESS:
      return update(state, {
        user: { $set: action.payload.user }
      });
    case signInActions.SIGN_IN_USER_ERROR:
      return update(state, {
        error: { $set: action.payload.error }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
