import { Client, Channel, Message } from 'twilio-chat';
import update from 'immutability-helper';
import moment from 'moment';
import { getTitle } from 'utils/chat';
import { chatActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type ChatUser = {
  firstname: string;
  image: string;
  lastname: string;
  userId: number;
};

export type DetailedChatUser = {
  firstname: string;
  image: string;
  lastname: string;
  userId: string;
  isOnline: boolean;
  role: string;
  roleId: number;
};

export type ChannelWrapper = {
  lastMessage: {
    date: string;
    message: string;
    user: ChatUser;
  };
  members: DetailedChatUser[];
  muted: boolean;
  sectionId: number;
  sid: string;
  thumbnail: string;
  title: string;
  twilioChannel: Channel;
  unread: number;
  shareLink?: string;
};

export type ChatCommunityData = {
  community: ChatCommunity;
  permissions: string[];
};

export type ChatCommunity = {
  about: string;
  bg_color: string;
  class_id: number;
  community_banner_url: string;
  community_icon_url: string;
  created: string;
  id: number;
  name: string;
  private: boolean;
  school_id: number;
  section_id: number;
};

export type CommunityChannels = {
  channels: CommunityChannelsData[];
  courseId: number;
};

export type CommunityChannelsData = {
  channels: CommunityChannelData[];
  community_id: number;
  created: string;
  id: number;
  name: string;
  private: boolean;
};

export type CommunityChannelData = {
  category_id: number;
  chat_id: string;
  chat_name: string;
  community_id: number;
  created: string;
  ordering: number;
};

export type CurrentCommunity = {
  about: string;
  color: string;
  communityBannerUrl: string;
  communityIconUrl: string;
  created: string;
  id: number | string; // Direct chat uses the string 'chat' as an id, the rest of the communities use numbers for ids.  TODO make them all strings for consistency.
  name: string;
  private: boolean;
  school_id: number;
  section_id: string;
};

export type ChatData = {
  channels: Channel[];
  client: Client | null;
  communities: ChatCommunityData[];
  communityChannels: CommunityChannels[];
  currentChannel: Channel | null;
  currentCommunity: CurrentCommunity | null;
  currentCommunityChannel: Channel | null;
  currentCommunityId: string | null;
  entityFirstName: string;
  entityId: number;
  entityLastName: string;
  entityUuid: string;
  entityVideo: boolean;
  local: Record<string, ChannelWrapper>;
  mainMessage: string;
  messageLoading: boolean;
  newChannel: boolean;
  newMessage: Message | null;
  oneTouchSendOpen: boolean;
  online: boolean;
  openChannels: Channel[];
  selectedChannelId: string;
  unread: number;
  uuid: string;
};

export type ChatState = {
  data: ChatData;
  error: boolean;
  errorMessage: {
    title: string;
    body: string;
  };
  isLoading: boolean;
};
const defaultState = {
  data: {
    channels: [],
    client: null,
    communities: [],
    communityChannels: [],
    currentChannel: null,
    currentCommunity: null,
    currentCommunityChannel: null,
    currentCommunityId: null,
    entityFirstName: '',
    entityId: 0,
    entityLastName: '',
    entityUuid: '',
    entityVideo: false,
    local: {},
    mainMessage: '',
    messageLoading: false,
    newChannel: false,
    newMessage: null,
    oneTouchSendOpen: false,
    online: false,
    openChannels: [],
    selectedChannelId: '',
    unread: 0,
    uuid: ''
  },
  error: false,
  errorMessage: {
    title: '',
    body: ''
  },
  isLoading: false
};

const mergeObjects = (first, second) => {
  const merged = {};
  const keys = Object.keys(first);

  if (keys.length === 0) {
    return second;
  }

  keys.forEach((l) => {
    merged[l] = { ...first[l], ...second[l] };
  });
  return merged;
};

const removeParam = (obj, id) => {
  const { [id]: removed, ...rest } = obj;
  return rest;
};

export default (state: ChatState = defaultState, action: Action): ChatState => {
  switch (action.type) {
    case chatActions.SET_MAIN_MESSAGE:
      return { ...state, data: { ...state.data, mainMessage: action.payload.mainMessage } };

    case chatActions.SET_OPEN_ONE_TOUCH_SEND:
      return { ...state, data: { ...state.data, oneTouchSendOpen: action.payload.open } };

    case chatActions.MAIN_MESSAGE_LOADING:
      return { ...state, data: { ...state.data, messageLoading: action.payload.loading } };

    case chatActions.SET_CURRENT_COMMUNITY_ID:
      return {
        ...state,
        data: { ...state.data, currentCommunityId: action.payload.currentCommunityId }
      };

    case chatActions.SET_CURRENT_CHANNEL:
      return {
        ...state,
        data: {
          ...state.data,
          currentChannel: action.payload.currentChannel,
          currentCommunityId: null
        }
      };

    case chatActions.SET_COMMUNITIES:
      return { ...state, data: { ...state.data, communities: action.payload.communities } };

    case chatActions.SET_COMMUNITY_CHANNELS:
      return {
        ...state,
        data: { ...state.data, communityChannels: action.payload.communityChannels }
      };

    case chatActions.SET_CURRENT_CHANNEL_ID:
      return {
        ...state,
        data: { ...state.data, selectedChannelId: action.payload.selectedChannelId }
      };

    case chatActions.SET_CURRENT_COMMUNITY_CHANNEL:
      return {
        ...state,
        data: { ...state.data, currentCommunityChannel: action.payload.currentChannel }
      };

    case chatActions.SET_CURRENT_COMMUNITY:
      return { ...state, data: { ...state.data, currentCommunity: action.payload.channel } };

    case chatActions.CREATE_NEW_CHANNEL:
      return {
        ...state,
        data: {
          ...state.data,
          newChannel: action.payload.newChannel,
          openChannels: action.payload.openChannels
        }
      };

    case chatActions.UPDATE_CHANNEL_ATTRIBUTES: {
      return update(state, {
        data: {
          local: {
            [action.payload.sid]: {
              $merge: action.payload.attributes
            }
          }
        }
      });
    }

    case chatActions.CHAT_START_LOADING:
      return { ...state, isLoading: true };

    case chatActions.OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST:
      return update(state, {
        data: {
          uuid: {
            $set: action.payload.uuid
          }
        }
      });

    case chatActions.START_CHANNEL_WITH_ENTITY_REQUEST:
      return update(state, {
        data: {
          entityId: {
            $set: action.payload.entityId
          },
          entityFirstName: {
            $set: action.payload.entityFirstName
          },
          entityLastName: {
            $set: action.payload.entityLastName
          },
          entityVideo: {
            $set: action.payload.entityVideo
          },
          entityUuid: {
            $set: action.payload.entityUuid
          }
        }
      });

    case chatActions.NEW_CHAT_MESSAGE:
      return {
        ...state,
        data: {
          ...state.data,
          newMessage: action.payload.message,
          local: {
            ...state.data.local,
            [action.payload.message.channel.sid]: {
              ...state.data.local[action.payload.message.channel.sid],
              lastMessage: {
                user: {
                  firstname: action.payload.message.attributes.firstName,
                  lastname: action.payload.message.attributes.lastName,
                  userId: action.payload.message.author,
                  image: action.payload.message.imageKey
                },
                message: action.payload.message.body,
                date: moment(action.payload.message.dateUpdated).toISOString()
              }
            }
          }
        }
      };

    case chatActions.INIT_LOCAL_CHAT:
      return {
        ...state,
        isLoading: false,
        data: { ...state.data, local: mergeObjects(state.data.local, action.payload.local) }
      };

    case chatActions.INIT_CLIENT_CHAT:
      return { ...state, data: { ...state.data, online: true, client: action.payload.client } };

    case chatActions.INIT_CHANNELS_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          local: mergeObjects(state.data.local, action.payload.local),
          channels: action.payload.channels
        }
      };

    case chatActions.UPDATE_CHANNEL_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          channels: [
            action.payload.channel,
            ...state.data.channels.filter((c) => c.sid !== action.payload.channel.sid)
          ],
          local: {
            ...state.data.local,
            [action.payload.channel.sid]: {
              ...state.data.local[action.payload.channel.sid],
              unread: action.payload.unread
            }
          }
        }
      };

    case chatActions.ADD_CHANNEL_CHAT:
      return {
        ...state,
        data: {
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
                date: moment().toISOString()
              }
            }
          },
          channels: [action.payload.channel, ...state.data.channels]
        }
      };

    case chatActions.REMOVE_CHANNEL_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          channels: state.data.channels.filter((c) => c.sid !== action.payload.sid),
          local: { ...removeParam(state.data.local, action.payload.sid) },
          openChannels: state.data.openChannels.filter((c) => c.sid !== action.payload.sid)
        }
      };

    case chatActions.UPDATE_MEMBERS_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          local: {
            ...state.data.local,
            [action.payload.channelId]: {
              ...state.data.local[action.payload.channelId],
              members: action.payload.members
            }
          }
        }
      };

    case chatActions.UPDATE_SHARE_LINK_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          local: {
            ...state.data.local,
            [action.payload.channelId]: {
              ...state.data.local[action.payload.channelId],
              shareLink: action.payload.shareLink
            }
          }
        }
      };

    case chatActions.REMOVE_MEMBER_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          local: {
            ...state.data.local,
            [action.payload.member.channel.sid]: {
              ...state.data.local[action.payload.member.channel.sid],
              members: state.data.local[action.payload.member.channel.sid]?.members.filter(
                (m) => Number(m.userId) !== Number(action.payload.member.identity)
              )
            }
          }
        }
      };

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
      };

    case chatActions.SHUTDOWN_CHAT:
      return {
        ...state,
        data: {
          ...state.data,
          client: null,
          channels: [],
          online: false,
          openChannels: [],
          unread: 0
        }
      };

    case chatActions.CLOSE_NEW_CHANNEL:
      return { ...state, data: { ...state.data, newChannel: false } };

    case chatActions.SET_OPEN_CHANNELS:
      return {
        ...state,
        data: { ...state.data, openChannels: action.payload.openChannels, newChannel: false }
      };

    case chatActions.UPDATE_FRIENDLY_NAME:
      return {
        ...state,
        data: {
          ...state.data,
          local: {
            ...state.data.local,
            [action.payload.channel.sid]: {
              ...state.data.local[action.payload.channel.sid],
              twilioChannel: action.payload.channel,
              title: action.payload.channel.friendlyName
            }
          }
        }
      };

    case rootActions.CLEAR_STATE:
      return defaultState;

    default:
      return state;
  }
};
