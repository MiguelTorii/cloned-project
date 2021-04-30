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
    currentChannel: ?Object,
    newChannel: boolean,
    mainMessage: string,
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
    mainMessage: '',
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
    currentChannel: null,
    online: false,
    newChannel: false,
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

const removeParam = (obj, id) => {
  const { [id]: removed, ...rest } = obj
  return rest
}

export default (state: ChatState = defaultState, action: Action): ChatState => {
  switch (action.type) {
  case chatActions.SET_MAIN_MESSAGE:
    return {
      ...state,
      data: {
        ...state.data,
        mainMessage: action.payload.mainMessage,
      }
    }
  case chatActions.SET_CURRENT_CHANNEL:
    return {
      ...state,
      data: {
        ...state.data,
        currentChannel: action.payload.currentChannel,
      }
    }
  case chatActions.CREATE_NEW_CHANNEL:
    return {
      ...state,
      data: {
        ...state.data,
        newChannel: action.payload.newChannel,
        openChannels: action.payload.openChannels
      }
    }
  case chatActions.UPDATE_CHANNEL_ATTRIBUTES: {
    return update(state, {
      data: {
        local: {
          [action.payload.sid]: {
            $merge: action.payload.attributes
          }
        }
      }
    })
  }
  case chatActions.CHAT_START_LOADING:
    return {
      ...state,
      isLoading: true
    }
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
    } }
  case chatActions.INIT_LOCAL_CHAT:
    return {
      ...state,
      isLoading: false,
      data: {
        ...state.data,
        local: mergeObjects(state.data.local, action.payload.local)
      } }
  case chatActions.INIT_CLIENT_CHAT:
    return { ...state, data: {
      ...state.data,
      online: true,
      client: action.payload.client
    } }
  case chatActions.INIT_CHANNELS_CHAT:
    return {
      ...state,
      data: {
        ...state.data,
        local: mergeObjects(state.data.local, action.payload.local),
        channels: action.payload.channels
      } }
  case chatActions.UPDATE_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: [action.payload.channel, ...state.data.channels.filter(c => c.sid !== action.payload.channel.sid)],
      local: { ...state.data.local, [action.payload.channel.sid]: {
        ...state.data.local[action.payload.channel.sid], unread: action.payload.unread
      } }
    } }
  case chatActions.ADD_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      local: {
        ...state.data.local,
        [action.payload.channel.sid]: {
          ...state.data.local[action.payload.channel.sid],
          sid: action.payload.channel.sid,
          unread: 0,
          twilioChannel: action.payload.channel,
          title: getTitle(
            action.payload.channel,
            action.payload.userId,
            action.payload.members
          ),
          members: action.payload.members,
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
    } }
  case chatActions.REMOVE_CHANNEL_CHAT:
    return { ...state, data: {
      ...state.data,
      channels: state.data.channels.filter(c => c.sid !== action.payload.sid),
      local: { ...removeParam(state.data.local, action.payload.sid) },
      openChannels: state.data.openChannels.filter(c => c.sid !== action.payload.sid)
    } }
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
    } }
  case chatActions.UPDATE_SHARE_LINK_CHAT:
    return { ...state, data: {
      ...state.data,
      local: {
        ...state.data.local,
        [action.payload.channelId]: {
          ...state.data.local[action.payload.channelId],
          shareLink: action.payload.shareLink
        }
      }
    } }
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
    } }
  case chatActions.MUTE_CHANNEL:
    return {
      ...state,
      data: {
        ...state.data,
        local: {
          ...state.data.local,
          [action.payload.sid]: {
            ...state.data.local[action.payload.sid],
            muted: !state.data.local[action.payload.sid].muted
          }
        }
      }
    }
  case chatActions.SHUTDOWN_CHAT:
    return { ...state, data: {
      ...state.data,
      client: null,
      channels: [],
      online: false,
      openChannels: [],
      unread: 0
    } }
  case chatActions.CLOSE_NEW_CHANNEL:
    return { ...state, data: {
      ...state.data,
      newChannel: false
    }
    }
  case chatActions.SET_OPEN_CHANNELS:
    return { ...state, data: {
      ...state.data,
      openChannels: action.payload.openChannels,
      newChannel: false
    } }
  case chatActions.UPDATE_FRIENDLY_NAME:
    const sid = action.payload.channel.sid;
    return {
      ...state,
      data: {
        ...state.data,
        local: {
          ...state.data.local,
          [sid]: {
            ...state.data.local[sid],
            twilioChannel: action.payload.channel,
            title: action.payload.channel.friendlyName,
          }
        }
      }
    }
  case rootActions.CLEAR_STATE:
    return defaultState;
  default:
    return state;
  }
};
