import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { OnboardingList } from '../types/models';
import { getToken, onboardingToCamelCase } from './utils';

export const completeOnboardingList = async (): Promise<void> => {
  const token = await getToken();
  await axios.post(
    `${API_ROUTES.ONBOARDING_STATUS}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
export const fetchOnboardingList = async (): Promise<OnboardingList> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.ONBOARDING_STATUS}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return onboardingToCamelCase(result.data);
};
