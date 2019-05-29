/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
// import type { ToDos } from '../types/models';
import { getToken } from './utils';

export const checkVideoSession = async ({
  userId
}: {
  userId: string
}): Promise<boolean> => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.VIDEO_SESSION_CHECK}?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    const { success = false } = data;
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
};
