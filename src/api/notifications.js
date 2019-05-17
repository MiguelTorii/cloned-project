/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
// import type { Feed } from '../types/models';
import { getToken } from './utils';

export const getNotifications = async ({
  userId,
  isStudyCircle
}: {
  userId: string,
  isStudyCircle?: boolean
}): Promise<Object> => {
  const token = await getToken();
  let type = '';
  if (isStudyCircle) type = 'study_circle=true';
  else type = 'device_id=1';
  const result = await axios.get(
    `${API_ROUTES.NOTIFICATIONS}/${userId}?${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data } = result;

  return data;
};
