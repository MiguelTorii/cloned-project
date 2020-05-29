// @flow
import axios from 'axios';
import { API_ROUTES } from 'constants/routes';
import type { OnboardingList } from 'types/models';
import { getToken } from './utils';

export default async (): Promise<OnboardingList> => {
  try {
    const token = await getToken();

    const result = await axios.get(`${API_ROUTES.ONBOARDING_STATUS}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data || [];
  } catch (err) {
    return [];
  }
};