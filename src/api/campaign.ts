import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getCampaign = async ({
  campaignId
}: {
  campaignId: number;
}): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.CAMPAIGN}/${campaignId}/variations/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  return data;
};
