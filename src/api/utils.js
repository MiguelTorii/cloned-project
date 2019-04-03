// @flow
import axios from 'axios';
import store from 'store';
import decode from 'jwt-decode';
import moment from 'moment';
import { API_ROUTES } from '../constants/routes';

export const getToken = async (): Promise<string> => {
  const token = store.get('TOKEN');
  const refreshToken = store.get('REFRESH_TOKEN');
  const userId = store.get('USER_ID');
  const segment = store.get('SEGMENT');

  if (token) {
    const decoded = decode(token);
    const { exp } = decoded;
    const date = moment().subtract(2, 'minutes');
    if (exp > date.format('X')) {
      return token;
    }
  }
  if (segment === '' || userId === '' || refreshToken === '' || !userId) {
    return '';
  }

  const result = await axios.post(API_ROUTES.REFRESH, {
    user_id: Number(userId),
    token: refreshToken,
    segment
  });
  const { data = {} } = result;
  // eslint-disable-next-line camelcase
  const { jwt_token = '' } = data;
  // eslint-disable-next-line camelcase
  return jwt_token;
};

export const asd = 'asd';
