// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { User } from '../types/models';
import { getToken } from './utils';

export const fetchFeed = async ({
  userId
}: {
  userId: number
}): Promise<User> => {
  // https://dev-api.circleinapp.com/v1/feed/383630?index=0&limit=50&school_id=40554
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.FEED}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { posts }
  } = result;
  return posts;
};

export const asd = 'asd';
