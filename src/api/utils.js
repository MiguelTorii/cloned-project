// @flow
import axios from 'axios';
import store from 'store';
import { API_ROUTES } from '../constants/routes';

export const getToken = async (): Promise<string> => {
  const token = store.get('REFRESH_TOKEN');
  const userId = store.get('USER_ID');
  const segment = store.get('SEGMENT');
  if (segment === '' || userId === '' || token === '' || !userId) {
    return '';
  }

  const result = await axios.post(API_ROUTES.REFRESH, {
    user_id: Number(userId),
    token,
    segment
  });
  const { data = {} } = result;
  // eslint-disable-next-line camelcase
  const { jwt_token = '' } = data;
  // eslint-disable-next-line camelcase
  return jwt_token;
};

export const asd = 'asd';
