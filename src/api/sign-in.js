// @flow
import axios from 'axios';
import store from 'store';
import { API_ROUTES } from '../constants/routes';
import type { User } from '../types/models';

export const signInUser = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await axios.post(API_ROUTES.LOGIN, {
    email,
    password
  });
  const { data } = result;
  return data;
};

export const checkUser = async (): User | {} => {
  const token = store.get('REFRESH_TOKEN');
  const userId = store.get('USER_ID');
  const segment = store.get('SEGMENT');
  if (segment === '' || userId === '' || token === '' || !userId) {
    return {};
  }

  const result = await axios.post(API_ROUTES.REFRESH, {
    user_id: Number(userId),
    token,
    segment
  });
  const { data = {} } = result;
  return (data: User | {});
};
