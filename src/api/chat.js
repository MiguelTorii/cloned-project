/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import moment from 'moment'
import { API_ROUTES } from '../constants/routes';
import type { ChatPoints, CreateChat, ChatUser } from '../types/models';
import { getToken } from './utils';

export const getClassmates = async ({
  classId,
  sectionId
}: {
  classId: string,
  sectionId: string
}): Promise<Array<Object>> => {
  try {
    const token = await getToken();
    const result = await axios.get(
      `${API_ROUTES.CLASSES}/${classId}/${sectionId}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const {
      data: {
        members
      }
    } = result

    return members.map(m => ({
      firstName: m.first_name,
      lastName: m.last_name,
      userId: m.user_id,
      image: m.profile_image_url
    }));
  } catch (err) {
    return null;
  }
};

export const renewTwilioToken = async ({
  userId
}: {
  userId: string
}): Promise<string> => {
  try {
    const token = await getToken();
    const result = await axios.get(
      `${API_ROUTES.TWILIO_TOKEN}?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    const { accessToken = '' } = data;
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
  users: Array<number>,
  groupName: string,
  type: string,
  thumbnailUrl: ?string
}): Promise<CreateChat> => {
  try {
    const token = await getToken();
    const result = await axios.post(
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
    const { data = {} } = result;
    return {
      chatId: String((data.chat_id: string) || ''),
      groupName: String((data.group_name: string) || ''),
      isNewChat: Boolean((data.is_new_chat: boolean) || false),
      thumbnailUrl: String((data.thumbnail_url: string) || ''),
      type: String((data.type: string) || '')
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

export const getChannels = async (): Promise<Object> => {
  try {
    const token = await getToken();
    const result = await axios.get(
      `${API_ROUTES.CHAT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    const local = {}
    data.chats.forEach(c => {
      local[c.id] = {
        sid: c.id,
        title: c.group_name,
        lastMessage: {
          date: moment(c.last_received_message.date_sent).toISOString(),
          message: c.last_received_message.message,
          user: {
            firstname: c.last_received_message.user.first_name,
            lastname: c.last_received_message.user.last_name,
            userId: c.last_received_message.user.user_id,
            image: c.last_received_message.user.profile_image_url,
          },
        },
        thumbnail: c.thumbnail,
        members: c.users.map(u => ({
          firstname: u.first_name,
          lastname: u.last_name,
          userId: u.user_id,
          image: u.profile_image_url,
        }))
      }
    });
    return local
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const leaveChat = async ({ sid }: { sid: string }): Promise<Object> => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const blockChatUser = async ({
  blockedUserId
}: {
  blockedUserId: string
}): Promise<Object> => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const postMessageCount = async ({
  userId,
  count,
  sid
}: {
  userId: string,
  count: number,
  sid: string
}): Promise<ChatPoints> => {
  try {
    const token = await getToken();
    const result = await axios.post(
      `${API_ROUTES.CHAT}/${userId}/messages/count`,
      {
        user_id: userId,
        message_count: count,
        channel_sid: sid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;

    return {
      currentWeekCount: Number((data.current_week_count: number) || 0),
      logId: Number((data.log_id: number) || 0),
      points: Number((data.points: number) || 0)
    };
  } catch (err) {
    console.log(err);
    return {
      currentWeekCount: 0,
      logId: 0,
      points: 0
    };
  }
};

export const getGroupMembers = async ({
  chatId
}: {
  chatId: string
}): Promise<Array<ChatUser>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.CHAT}/${chatId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;
    const { users = [] } = data;

    return users.map(user => ({
      firstName: String((user.first_name: string) || ''),
      hours: Number((user.hours: number) || 0),
      joined: String((user.joined: string) || ''),
      lastName: String((user.last_name: string) || ''),
      profileImageUrl: String((user.profile_image_url: string) || ''),
      rank: Number((user.rank: number) || 0),
      scholarshipPoints: Number((user.scholarship_points: number) || 0),
      schoolId: Number((user.school_id: number) || 0),
      state: String((user.state: string) || ''),
      userId: String((user.user_id: string) || '')
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
  chatId: string,
  users: Array<number>
}): Promise<Object> => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};
