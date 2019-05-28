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
    uuid: string,
    entityId: string,
    entityFirstName: string,
    entityLastName: string,
    entityUuid: string
  },
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    uuid: '',
    entityId: '',
    entityFirstName: '',
    entityLastName: '',
    entityUuid: ''
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
    case chatActions.START_CHANNEL_WITH_ENTITY_REQUEST:
      return update(state, {
        data: {
          // $FlowIgnore
          entityId: { $set: action.payload.entityId },
          // $FlowIgnore
          entityFirstName: { $set: action.payload.entityFirstName },
          // $FlowIgnore
          entityLastName: { $set: action.payload.entityLastName },
          // $FlowIgnore
          entityUuid: { $set: action.payload.entityUuid }
        }
      });
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
