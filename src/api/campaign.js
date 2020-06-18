// @flow

import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

// eslint-disable-next-line
export const getCampaign = async ({ campaignId }: {
  campaignId: string
}): Promise<Object> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.CAMPAIGN}/${campaignId}/variations/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;

    return data
  } catch (err) {
    if (
      err?.response?.status === 401 &&
      (window.location.pathname !== '/auth' || window.location.pathname !== '/oauth')
    ) window.location = '/auth'

    return null;
  }
};

