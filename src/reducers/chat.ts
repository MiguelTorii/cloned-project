import { createSelector } from '@reduxjs/toolkit';
import update from 'immutability-helper';
import moment from 'moment';

import { chatActions, rootActions } from 'constants/action-types';
import { getTitle } from 'utils/chat';

import DEFAULT_COMMUNITY_MENU_ITEMS from 'containers/CommunityChat/constants';

import type { Client, Message } from '@twilio/conversations';
import type { ChatCommunity, ChatCommunityData } from 'api/models/APICommunity';
import type { ChannelMetadata } from 'features/chat';
import type { AppState } from 'redux/store';
import type { Action } from 'types/action';
import type { Channel } from 'types/models';

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
  users: ChannelMetadata['users'];
  muted: boolean;
  sectionId: number;
  sid: string;
  thumbnail: string;
  title: string;
  twilioChannel: Channel;
  unread: number;
  shareLink?: string;
};

export type ChatCommunityWithChannels = {
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

export type ChatData = {
  channels: Channel[];
  client: Client | null;
  defaultCommunity: ChatCommunity;
  communities: ChatCommunityData[];
  communityChannels: ChatCommunityWithChannels[];
  currentCommunityChannelId: string;
  currentCommunityId: number | null;
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
  selectedChannelId: string | null;
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
  communitiesLoaded: boolean;
  isLoading: boolean;
  requestingNewChannel: boolean;
  preventSubscriptionsRedirects: boolean;
};
const defaultState = {
  data: {
    channels: [],
    client: null,
    defaultCommunity: DEFAULT_COMMUNITY_MENU_ITEMS,
    communities: [],
    communityChannels: [],
    currentCommunityChannelId: localStorage.getItem('currentCommunityChannelId'),
    currentCommunityId: Number(localStorage.getItem('currentCommunityId')),
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
    selectedChannelId: localStorage.getItem('currentDMChannel') || null,
    unread: 0,
    uuid: ''
  },
  error: false,
  errorMessage: {
    title: '',
    body: ''
  },
  requestingNewChannel: false,
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

    case chatActions.SET_CURRENT_CHANNEL_ID: {
      const id = action.payload.selectedChannelId;
      if (id) {
        localStorage.setItem('currentDMChannel', action.payload.selectedChannelId);
      } else {
        localStorage.removeItem('currentDMChannel');
      }
      return {
        ...state,
        data: { ...state.data, selectedChannelId: action.payload.selectedChannelId }
      };
    }
    case chatActions.DISABLE_SUBSCRIPTIONS_REDIRECTS:
      return {
        ...state,
        preventSubscriptionsRedirects: true
      };
    case chatActions.SET_COMMUNITIES:
      return { ...state, data: { ...state.data, communities: action.payload.communities } };

    case chatActions.SET_COMMUNITY_CHANNELS:
      return {
        ...state,
        communitiesLoaded: true,
        data: { ...state.data, communityChannels: action.payload.communityChannels }
      };

    case chatActions.SET_CURRENT_COMMUNITY_ID: {
      return {
        ...state,
        data: { ...state.data, currentCommunityId: action.payload.currentCommunityId }
      };
    }

    case chatActions.SET_CURRENT_COMMUNITY_CHANNEL_ID: {
      return {
        ...state,
        data: { ...state.data, currentCommunityChannelId: action.payload.currentChannelId }
      };
    }

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

    case chatActions.CHAT_END_LOADING:
      return { ...state, isLoading: false };

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
            [action.payload.message.conversation.sid]: {
              ...state.data.local[action.payload.message.conversation.sid],
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

    case chatActions.JOIN_CHANNEL_REQUEST:
      return {
        ...state,
        requestingNewChannel: action.payload.requesting
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
              users: action.payload.members
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
              members: state.data.local[action.payload.member.channel.sid]?.users.filter(
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

export const selectCurrentCommunityId = (state: AppState) => state.chat.data.currentCommunityId;
export const selectCommunitiesMetadata = (state: AppState) => state.chat.data.communities;
export const selectDefaultCommunity = (state: AppState) => state.chat.data.defaultCommunity;
export const selectCommunitiesWithChannels = (state: AppState) => state.chat.data.communityChannels;

export const selectCurrentCommunityChannelId = (state: AppState) =>
  state.chat.data.currentCommunityChannelId;

export const selectCurrentCommunity = createSelector(
  selectCurrentCommunityId,
  selectCommunitiesMetadata,
  selectDefaultCommunity,
  (communityId, communities, defaultCommunity) =>
    communityId
      ? communities.find((community) => String(community.community.id) === String(communityId))
          ?.community
      : defaultCommunity
);

export const selectCurrentCommunityWithChannels = createSelector(
  selectCommunitiesWithChannels,
  selectCurrentCommunityId,
  (communiyChannels, communityId) =>
    communiyChannels.find((community) => community.courseId === communityId)
);

export const selectCurrentCommunityChannels = createSelector(
  selectCurrentCommunityWithChannels,
  (community) => community?.channels.map((channel) => channel.channels).flat()
);

export const selectCurrentCommunityChannel = createSelector(
  selectCurrentCommunityChannels,
  selectCurrentCommunityChannelId,
  (channels, channelId) => channels?.find((c) => c.chat_id === channelId)
);
