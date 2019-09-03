/**
 * @format
 * @flow
 */
// import update from 'immutability-helper';
import {
  //   notificationsActions,
  rootActions
} from '../constants/action-types';
import type { Action } from '../types/action';

export type NotificationsState = {
  isLoading: boolean,
  data: {
    items: Array<Object>
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    items: []
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  }
};

export default (
  state: NotificationsState = defaultState,
  action: Action
): NotificationsState => {
  switch (action.type) {
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
