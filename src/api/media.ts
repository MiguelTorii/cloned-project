import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import { getToken } from './utils';

import type { APIPresignedURL } from './models/APIPresignedURL';
import type { PresignedURL } from 'types/models';

export const getPresignedURLs = async ({
  userId,
  type,
  fileNames
}: {
  userId: string;
  type: number;
  fileNames: Array<string>;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const fileArray = fileNames.map((item) => `&file_name=${item}`).join('');
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
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getPresignedURL = async ({
  userId,
  type,
  mediaType
}: {
  userId: string;
  type: number;
  mediaType: string;
}): Promise<PresignedURL> => {
  try {
    const token = await getToken();
    const result: { data: APIPresignedURL } = await axios.get(
      `${API_ROUTES.MEDIA_URL}/${type}?user_id=${userId}&media_type=${mediaType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;
    const presignedURL = {
      url: data.url || '',
      readUrl: data.read_url || '',
      mediaId: data.media_id || ''
    };
    return presignedURL;
  } catch (err) {
    console.log(err);
    return {
      url: '',
      readUrl: '',
      mediaId: ''
    };
  }
};
