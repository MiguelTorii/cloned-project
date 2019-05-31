// @flow
import axios from 'axios';
import store from 'store';
import { API_ROUTES } from '../constants/routes';
import type { User } from '../types/models';

export const signInUser = async (
  email: string,
  password: string
): Promise<User | {}> => {
  try {
    const result = await axios.post(API_ROUTES.LOGIN, {
      email,
      password
    });
    const { data } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const checkUser = async (): User | {} => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const recoverPassword = async ({
  email
}: {
  email: string
}): Promise<boolean> => {
  try {
    const result = await axios.post(API_ROUTES.RESET_PASSWORD, {
      email
    });
    const { data = {} } = result;
    const { sent = false } = data;
    return sent;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const changePassword = async ({
  email,
  password,
  resetToken
}: {
  email: string,
  password: string,
  resetToken: string
}): Promise<boolean> => {
  try {
    const result = await axios.post(API_ROUTES.CHANGE_PASSWORD, {
      email,
      new_password: password,
      reset_token: resetToken
    });
    const { data = {} } = result;
    const { password_updated: passwordUpdated = false } = data;
    return passwordUpdated;
  } catch (err) {
    console.log(err);
    return false;
  }
};
