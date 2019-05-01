// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';
import type { PresignedURL } from '../types/models';

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

export const getPresignedURL = async ({
  userId,
  type,
  mediaType
}: {
  userId: string,
  type: number,
  mediaType: string
}): Promise<PresignedURL> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.MEDIA_URL}/${type}?user_id=${userId}&media_type=${mediaType}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  const presignedURL = {
    url: String((data.url: string) || ''),
    readUrl: String((data.read_url: string) || ''),
    mediaId: String((data.media_id: string) || '')
  };
  return presignedURL;
};
