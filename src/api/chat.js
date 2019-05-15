/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const renewTwilioToken = async ({
  userId
}: {
  userId: string
}): Promise<string> => {
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
};

export const getBlockedUsers = async ({
  userId
}: {
  userId: string
}): Promise<string> => {
  const token = await getToken();

  const result = await axios.get(
    `${API_ROUTES.GET_BLOCKED_USERS}/${userId}?token=NA`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  const { users = [] } = data;
  return users.map(user => ({ userId: String(user.user_id) }));
};

export const blockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string,
  blockedUserId: string
}): Promise<string> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.BLOCK_USER}/${userId}`,
    {
      blocked_user_id: Number(blockedUserId),
      token: 'NA'
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

export const searchUsers = async ({
  schoolId,
  userId,
  query
}: {
  schoolId?: number,
  userId: string,
  query: string
}): Promise<string> => {
  const token = await getToken();
  const url = schoolId
    ? `${API_ROUTES.SEARCH_USERS}/${schoolId}/users`
    : `${API_ROUTES.SEARCH_USERS}/users`;

  const result = await axios.get(
    `${url}?user_id=${userId}&token=NA&index=0&limit=50&query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  const { users = [] } = data;
  return users.map(user => ({
    firstName: user.first_name,
    grade: user.grade,
    lastName: user.last_name,
    profileImageUrl: user.profile_image_url,
    school: user.school,
    userId: user.user_id
  }));
};
