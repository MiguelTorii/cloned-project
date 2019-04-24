/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getPresignedURLs = async ({
  userId,
  type,
  fileNames
}: {
  userId: string,
  type: number,
  fileNames: Array<string>
}): Promise<Object> => {
  const token = await getToken();
  const fileArray = fileNames.map(item => `&file_name=${item}`).join('');
  const result = await axios.get(
    `${API_ROUTES.MEDIA_URL}/${type}?user_id=${userId}${fileArray}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};
