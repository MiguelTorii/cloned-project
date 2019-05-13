/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const renewTwilioToken = async ({
  userId
}: {
  userId: string
}): Promise<string> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.TWILIO_TOKEN}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  const { accessToken = '' } = data;
  return accessToken;
};
