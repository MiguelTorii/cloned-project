/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { ChatPoints, CreateChat } from '../types/models';
import { getToken } from './utils';

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
    console.log(data);
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
        blocked_user_id: blockedUserId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    console.log(data);
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
