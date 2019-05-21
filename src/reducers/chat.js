/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import { chatActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type ChatState = {
  isLoading: boolean,
  data: {
    uuid: string
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    uuid: ''
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  }
};

export default (state: ChatState = defaultState, action: Action): ChatState => {
  switch (action.type) {
    case chatActions.OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST:
      return update(state, {
        data: {
          // $FlowIgnore
          uuid: { $set: action.payload.uuid }
        }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
