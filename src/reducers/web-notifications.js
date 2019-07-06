/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import {
  webNotificationsActions,
  rootActions
} from '../constants/action-types';
import type { Action } from '../types/action';

export type WebNotificationsState = {
  isLoading: boolean,
  data: {
    title: string,
    body: string
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    title: '',
    body: ''
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  }
};

export default (
  state: WebNotificationsState = defaultState,
  action: Action
): WebNotificationsState => {
  switch (action.type) {
    case webNotificationsActions.UPDATE_TITLE_SUCCESS:
      return update(state, {
        data: {
          // $FlowIgnore
          title: { $set: action.payload.title },
          // $FlowIgnore
          body: { $set: action.payload.body }
        }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
