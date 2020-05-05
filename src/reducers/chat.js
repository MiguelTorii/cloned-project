/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import { chatActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { ChatChannels } from '../types/models';

export type ChatState = {
  isLoading: boolean,
  data: {
    uuid: string,
    entityId: string,
    entityFirstName: string,
    entityLastName: string,
    entityVideo: boolean,
    entityUuid: string,
    client: ?Object,
    channels: Array<ChatChannels>,
    openChannels: Array<ChatChannels>,
    unread: number,
    local: Object,
    online: boolean,
    newMessage: ?Object
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
    entityVideo: false,
    entityUuid: '',
    client: null,
    channels: [],
    openChannels: [],
    unread: 0,
    local: {},
    online: false,
    newMessage: null,
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
        entityVideo: { $set: action.payload.entityVideo },
        // $FlowIgnore
        entityUuid: { $set: action.payload.entityUuid }
      }
    });
  case chatActions.NEW_CHAT_MESSAGE:
    return { ...state, data: {
      ...state.data,
      newMessage: action.payload.message
    }}
  case chatActions.INIT_CLIENT_CHAT:
    return { ...state, data: {
      ...state.data,
      online: true,
      client: action.payload.client
    }}
  case chatActions.INIT_CHANNELS_CHAT:
    return { ...state, data: {
      ...state.data,
      local: action.payload.local,
      channels: action.payload.channels
    }}
  case chatActions.UPDATE_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: [action.payload.channel, ...state.data.channels.filter(c => c.sid !== action.payload.channel.sid)],
      local: { ...state.data.local, [action.payload.channel.sid]: { unread: action.payload.unread } }
    }}
  case chatActions.ADD_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: [action.payload.channel, ...state.data.channels]
    }}
  case chatActions.REMOVE_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: state.data.channels.filter(c => c.sid !== action.payload.sid),
      openChannels: state.data.openChannels.filter(c => c.sid !== action.payload.sid)
    }}
  case chatActions.SHUTDOWN_CHAT:
    return { ...state, data: {
      ...state.data,
      client: null,
      channels: [],
      online: false,
      openChannels: [],
      unread: 0
    }}
  case chatActions.SET_OPEN_CHANNELS:
    return { ...state, data: {
      ...state.data,
      openChannels: action.payload.openChannels
    }}
  case rootActions.CLEAR_STATE:
    return defaultState;
  default:
    return state;
  }
};
