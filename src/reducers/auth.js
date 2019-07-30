/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import { rootActions, authActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { School } from '../types/models';

export type AuthState = {
  isLoading: boolean,
  data: {
    school: ?School
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    school: null
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  }
};

export default (state: AuthState = defaultState, action: Action): AuthState => {
  switch (action.type) {
    case authActions.UPDATE_AUTH_SCHOOL_REQUEST:
      return update(state, {
        data: {
          // $FlowIgnore
          school: { $set: action.payload.school }
        }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
