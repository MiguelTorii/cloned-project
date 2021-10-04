/* eslint-disable import/prefer-default-export */
import axios from "axios";
import moment from "moment";
import get from "lodash/get";
import { API_ROUTES } from "../constants/routes";
import type { CreateChat, ChatUser } from "../types/models";
import { callApi } from "./api_base";
import { getToken } from "./utils";
export const sendMessage = async ({
  message,
  chatId,
  imageKey,
  isVideoNotification,
  files,
  source = 'big_chat'
}: {
  message: string;
  chatId: array;
  imageKey: string;
  isVideoNotification: boolean;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.SEND_MESSAGE}`, {
      message,
      chat_id: chatId,
      image_url: imageKey,
      is_video_notification: isVideoNotification,
      files,
      source
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    return null;
  }
};
export const removeUser = async (userId, chatId) => callApi({
  url: `${API_ROUTES.CHAT}/${chatId}/class/members?chat_id=${userId}`,
  method: 'DELETE'
});
export const sendBatchMessage = async ({
  message,
  chatIds
}: {
  message: string;
  chatIds: array;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.BATCH_MESSAGE}`, {
      message,
      chat_ids: chatIds
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    return null;
  }
};
export const getClassmates = async ({
  classId,
  sectionId
}: {
  classId: string;
  sectionId: string;
}): Promise<Array<Record<string, any>>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.CLASSES}/${classId}/${sectionId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        members
      }
    } = result;
    return members.map(m => ({
      notRegistered: !m.registered,
      firstName: m.first_name,
      lastName: m.last_name,
      userId: m.user_id,
      image: m.profile_image_url,
      isOnline: m.is_online
    }));
  } catch (err) {
    return null;
  }
};
export const renewTwilioToken = async ({
  userId
}: {
  userId: string;
}): Promise<string> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.TWILIO_TOKEN}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const {
      accessToken = ''
    } = data;
    return accessToken;
  } catch (err) {
    console.log(err);
    return '';
  }
};
export const createChannel = async ({
  users,
  groupName,
  type,
  thumbnailUrl
}: {
  users: Array<number>;
  groupName: string;
  type: string;
  thumbnailUrl: string | null | undefined;
}): Promise<CreateChat> => {
  try {
    const token = await getToken();
    const result = await axios.post(API_ROUTES.CHAT, {
      users,
      group_name: groupName,
      type,
      thumbnail: thumbnailUrl !== '' ? thumbnailUrl : null
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return {
      chatId: String((data.chat_id as string) || ''),
      groupName: String((data.group_name as string) || ''),
      isNewChat: Boolean((data.is_new_chat as boolean) || false),
      thumbnailUrl: String((data.thumbnail_url as string) || ''),
      type: String((data.type as string) || '')
    };
  } catch (err) {
    console.log(err);
    return {
      chatId: '',
      groupName: '',
      isNewChat: false,
      thumbnailUrl: '',
      type: ''
    };
  }
};
export const muteChannel = async (sid): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.CHAT}/${sid}/mute`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const unmuteChannel = async (sid): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.CHAT}/${sid}/unmute`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getChannels = async (): Promise<Record<string, any>> => {
  try {
    // CHAT_V1
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.CHAT_V1}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const local = {};
    data.chats.forEach(c => {
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
        members: c.users.map(u => ({
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
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const leaveChat = async ({
  sid
}: {
  sid: string;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.CHAT}/${sid}/leave`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const blockChatUser = async ({
  blockedUserId
}: {
  blockedUserId: string;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.CHAT}/block`, {
      blocked_user_id: Number(blockedUserId)
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getGroupMembers = async ({
  chatId
}: {
  chatId: string;
}): Promise<Array<ChatUser>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.CHAT}/${chatId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const {
      users = []
    } = data;
    return users.map(user => ({
      registered: Boolean(user.registered || false),
      firstName: String((user.first_name as string) || ''),
      hours: Number((user.hours as number) || 0),
      role: String((user.role as string) || ''),
      roleId: Number((user.role_id as number) || 0),
      joined: String((user.joined as string) || ''),
      lastName: String((user.last_name as string) || ''),
      profileImageUrl: String((user.profile_image_url as string) || ''),
      rank: Number((user.rank as number) || 0),
      scholarshipPoints: Number((user.scholarship_points as number) || 0),
      schoolId: Number((user.school_id as number) || 0),
      state: String((user.state as string) || ''),
      userId: String((user.user_id as string) || ''),
      isOnline: Boolean(user.is_online || false)
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const addGroupMembers = async ({
  chatId,
  users
}: {
  chatId: string;
  users: Array<number>;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.CHAT}/${chatId}/members`, {
      users
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getShareLink = async (chatId: string) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${API_ROUTES.CHAT_SHARE_LINK}`, {
      chat_id: chatId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return get(response, 'data.url', '');
  } catch (err) {
    return '';
  }
};
// Fetches chat id with the given hashed chat id
export const getChatIdFromHash = async (hashId: string) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${API_ROUTES.CHAT_JOIN_LINK}`, {
      hid: hashId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return get(response, 'data.chat_id', '');
  } catch (err) {
    return '';
  }
};
export const apiUpdateChat = async (chatId: string, attributes: Record<string, any>) => {
  try {
    const token = await getToken();
    const response = await axios.put(`${API_ROUTES.CHAT}`, attributes, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    return null;
  }
};