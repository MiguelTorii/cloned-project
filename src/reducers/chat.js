/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import moment from 'moment'
import { getTitle } from 'utils/chat';
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

const mergeObjects = (first, second) => {
  const merged = {}
  const keys = Object.keys(first)
  if (keys.length === 0) return second
  keys.forEach(l => {
    merged[l] = { ...first[l], ...second[l] }
  })

  return merged
}

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
      newMessage: action.payload.message,
      local: {
        ...state.data.local,
        [action.payload.message.channel.sid]: {
          ...state.data.local[action.payload.message.channel.sid],
          lastMessage: {
            user: {
              firstname: action.payload.message.attributes.firstName,
              lastname:action.payload.message.attributes.lastName,
              userId: action.payload.message.author,
              image:action.payload.message.imageKey
            },
            message: action.payload.message.body,
            date: moment(action.payload.message.dateUpdated).toISOString(),
          }
        }
      }
    }}
  case chatActions.INIT_LOCAL_CHAT:
    return { ...state, data: {
      ...state.data,
      local: mergeObjects(state.data.local, action.payload.local)
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
      local: mergeObjects(state.data.local, action.payload.local),
      channels: action.payload.channels
    }}
  case chatActions.UPDATE_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: [action.payload.channel, ...state.data.channels.filter(c => c.sid !== action.payload.channel.sid)],
      local: { ...state.data.local, [action.payload.channel.sid]: {
        ...state.data.local[action.payload.channel.sid], unread: action.payload.unread
      } }
    }}
  case chatActions.ADD_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      local: {
        ...state.data.local,
        [action.payload.channel.sid]: {
          sid: action.payload.channel.sid,
          unread: 0,
          twilioChannel: action.payload.channel,
          title: getTitle(action.payload.channel, action.payload.userId),
          members: action.payload.channel.attributes.users.map(u => ({
            firstname: u.firstName,
            lastname: u.lastName,
            userId: u.userId,
            image: ''
          })),
          lastMessage: {
            user: {
              firstname: '',
              lastname: '',
              userId: 1
            },
            message: ' ',
            date: moment().toISOString(),
          }
        }
      },
      channels: [action.payload.channel, ...state.data.channels]
    }}
  case chatActions.REMOVE_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: state.data.channels.filter(c => c.sid !== action.payload.sid),
      openChannels: state.data.openChannels.filter(c => c.sid !== action.payload.sid)
    }}
  case chatActions.UPDATE_MEMBERS_CHAT:
    return { ...state, data: {
      ...state.data,
      local: {
        ...state.data.local,
        [action.payload.channelId]: {
          ...state.data.local[action.payload.channelId],
          members: action.payload.members
        }
      }
    }}
  case chatActions.REMOVE_MEMBER_CHAT:
    return { ...state, data: {
      ...state.data,
      local: {
        ...state.data.local,
        [action.payload.member.channel.sid]: {
          ...state.data.local[action.payload.member.channel.sid],
          members: state.data.local[action.payload.member.channel.sid].members.filter(m => (
            Number(m.userId) !== Number(action.payload.member.identity)
          ))
        }
      }
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
