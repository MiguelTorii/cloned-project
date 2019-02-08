/**
 * @flow
 */
import update from 'immutability-helper';
import type { Node } from 'react';
import { notificationsActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type NotificationsState = {
  isLoading: boolean,
  anchorEl?: Node,
  error: boolean
};

const defaultState = {
  anchorEl: null,
  isLoading: false,
  error: false
};

export default (
  state: NotificationsState = defaultState,
  action: Action
): NotificationsState => {
  switch (action.type) {
    case notificationsActions.OPEN_NOTIFICATIONS:
      return update(state, {
        anchorEl: { $set: action.payload.anchorEl }
      });
    case notificationsActions.CLOSE_NOTIFICATIONS:
      return update(state, {
        anchorEl: { $set: null }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
