// @flow

import axios from 'axios';
import { API_ROUTES } from '../constants/routes';

import { getToken } from './utils';

export const getCommunities = async () => {
  try {
    const token = await getToken();

    const result = await axios.get(`${API_ROUTES.GET_COMMUNITY}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;
    return data;
  } catch (err) {
    return null;
  }
};

export const getCommunityChannels = async ({
  communityId
}: {
  communityId: number
}) => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.GET_COMMUNITY_V1}/${communityId}/channels`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;
    return data;
  } catch (err) {
    return null;
  }
};

export const getCommunityTemplates = async () => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.GET_COMMUNITY_V1}/template/1`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;
    return data;
  } catch (err) {
    return null;
  }
};

export const batchMessage = async ({ message, chatIds }) => {
  const token = await getToken();
  const result = await axios.post(
    API_ROUTES.BATCH_MESSAGE,
    {
      message,
      chat_ids: chatIds
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return result;
};
