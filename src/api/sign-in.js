// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { User } from '../types/models';

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

export const asd = 'asd';
