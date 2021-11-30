/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import moment from 'moment';
import get from 'lodash/get';
import { API_ROUTES, API_URL } from '../constants/routes';
import type { CreateChat, ChatUser, Classmate } from '../types/models';
import { callApi } from './api_base';
import { getToken } from './utils';
import { APICreateChat } from './models/APICreateChat';
import { APIClassmate } from './models/APIClassmate';
import { APIChat } from './models/APIChat';

export const sendMessage = async ({
  message,
  chatId,
  imageKey,
  isVideoNotification,
  files,
  source = 'big_chat'
}: {
  message: string;
  chatId: string;
  imageKey?: string;
  isVideoNotification?: boolean;
  files?: any;
  source?: string;
}): Promise<void> => {
  const token = await getToken();
  await axios.post(
    `${API_ROUTES.SEND_MESSAGE}`,
    {
      message,
      chat_id: chatId,
      image_url: imageKey,
      is_video_notification: isVideoNotification,
      files,
      source
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const editMessage = async ({
  message,
  messageId,
  chatId
}: {
  message: string;
  messageId: string;
  chatId: string;
}): Promise<void> =>
  callApi({
    url: `${API_ROUTES.CHAT}/${chatId}/message/${messageId}`,
    method: 'PUT',
    data: {
      message
    }
  });

export const apiDeleteMessage = async (chatId, messageId): Promise<void> =>
  callApi({
    url: `${API_ROUTES.CHAT}/${chatId}/message/${messageId}`,
    method: 'DELETE',
    data: {
      message: ''
    }
  });

export const removeUser = async (userId, chatId): Promise<boolean> =>
  callApi({
    url: `${API_ROUTES.CHAT}/${chatId}/class/members?chat_id=${userId}`,
    method: 'DELETE'
  });

export const sendBatchMessage = async ({
  message,
  chatIds
}: {
  message: string;
  chatIds: any[];
}): Promise<boolean> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.BATCH_MESSAGE}`,
    {
      message,
      chat_ids: chatIds
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data } = result;
  return data;
};

export const getClassmates = async ({
  classId,
  sectionId
}: {
  classId: number;
  sectionId: number;
}): Promise<Array<Record<string, any>>> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.CLASSES}/${classId}/${sectionId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { members }
  } = result;
  return members.map((m) => ({
    notRegistered: !m.registered,
    firstName: m.first_name,
    lastName: m.last_name,
    userId: m.user_id,
    image: m.profile_image_url,
    isOnline: m.is_online
  }));
};

export const getCommunityMembers = async ({
  classId,
  sectionId
}: {
  classId: number;
  sectionId: number;
}): Promise<Classmate[]> => {
  const result: { members: APIClassmate[] } = await callApi({
    url: `${API_ROUTES.CLASSES}/${classId}/${sectionId}/members`,
    method: 'GET'
  });

  const { members } = result;
  return members.map((m) => ({
    notRegistered: !m.registered,
    firstName: m.first_name,
    lastName: m.last_name,
    userId: m.user_id ? String(m.user_id) : '',
    image: m.profile_image_url,
    isOnline: m.is_online,
    fullName: `${m.first_name} ${m.last_name}`,
    roleId: m.role_id
  }));
};

export const getChannelMetadata = async (): Promise<APIChat[]> => {
  const result: { chats: APIChat[] } = await callApi({
    url: `${API_ROUTES.CHAT_V1}`,
    method: 'GET'
  });

  return result.chats;
};

export const renewTwilioToken = async ({ userId }: { userId: string }): Promise<string> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.TWILIO_TOKEN}?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  const { accessToken = '' } = data;
  return accessToken;
};

export const createChannel = async ({
  users,
  groupName,
  type,
  thumbnailUrl
}: {
  users: Array<number>;
  groupName?: string;
  type?: string;
  thumbnailUrl?: string | null | undefined;
}): Promise<CreateChat> => {
  const token = await getToken();
  const result: { data: APICreateChat } = await axios.post(
    API_ROUTES.CHAT,
    {
      users,
      group_name: groupName,
      type,
      thumbnail: thumbnailUrl !== '' ? thumbnailUrl : null
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data } = result;
  return {
    chatId: data.chat_id || '',
    groupName: data.group_name || '',
    isNewChat: data.is_new_chat || false,
    thumbnailUrl: data.thumbnail_url || '',
    type: data.type || ''
  };
};

export const muteChannel = async (sid): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.CHAT}/${sid}/mute`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};

export const unmuteChannel = async (sid): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.CHAT}/${sid}/unmute`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};

export const getChannels = async (): Promise<Record<string, any>> => {
  // CHAT_V1
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.CHAT_V1}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  const local = {};
  data.chats.forEach((c) => {
    local[c.id] = {
      sid: c.id,
      title: c.group_name,
      muted: c.is_muted,
      sectionId: c.section_id,
      lastMessage: {
        date: moment(c.last_received_message.date_sent).toISOString(),
        message: c.last_received_message.message,
        user: {
          firstname: c.last_received_message.user.first_name,
          lastname: c.last_received_message.user.last_name,
          userId: c.last_received_message.user.user_id,
          image: c.last_received_message.user.profile_image_url
        }
      },
      thumbnail: c.thumbnail,
      members: c.users.map((u) => ({
        firstname: u.first_name,
        lastname: u.last_name,
        userId: u.user_id,
        image: u.profile_image_url,
        role: u.role,
        roleId: u.role_id,
        isOnline: u.is_online
      }))
    };
  });
  return local;
};

export const leaveChat = async ({ sid }: { sid: string }): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.CHAT}/${sid}/leave`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const blockChatUser = async ({
  blockedUserId
}: {
  blockedUserId: string;
}): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.CHAT}/block`,
    {
      blocked_user_id: Number(blockedUserId)
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};

export const getGroupMembers = async ({ chatId }: { chatId: string }): Promise<Array<ChatUser>> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.CHAT}/${chatId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  const { users = [] } = data;
  return users.map((user) => ({
    registered: user.registered || false,
    firstName: user.first_name || '',
    hours: user.hours || 0,
    role: user.role || '',
    roleId: user.role_id || 0,
    joined: user.joined || '',
    lastName: user.last_name || '',
    profileImageUrl: user.profile_image_url || '',
    rank: user.rank || 0,
    scholarshipPoints: user.scholarship_points || 0,
    schoolId: user.school_id || 0,
    state: user.state || '',
    userId: user.user_id ? String(user.user_id) : '',
    isOnline: user.is_online
  }));
};

export const addGroupMembers = async ({
  chatId,
  users
}: {
  chatId: string;
  users: Array<number>;
}): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.CHAT}/${chatId}/members`,
    {
      users
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};

export const getShareLink = async (chatId: string): Promise<string> => {
  const token = await getToken();
  const response = await axios.post(
    `${API_ROUTES.CHAT_SHARE_LINK}`,
    {
      chat_id: chatId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return get(response, 'data.url', '');
};

// Fetches chat id with the given hashed chat id
export const getChatIdFromHash = async (hashId: string): Promise<string> => {
  const token = await getToken();
  const response = await axios.post(
    `${API_ROUTES.CHAT_JOIN_LINK}`,
    {
      hid: hashId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return get(response, 'data.chat_id', '');
};

export const apiUpdateChat = async (attributes: Record<string, any>): Promise<void> => {
  const token = await getToken();
  await axios.put(`${API_ROUTES.CHAT}`, attributes, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const apiGetCommunityShareLink = async (community_id): Promise<{ url: string }> =>
  callApi({
    url: `${API_URL}/community/link`,
    method: 'POST',
    data: { community_id }
  });
