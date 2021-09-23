// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getReferralCodeInfo = async (code: string): Promise<Object> => {
  try {
    const result = await axios.get(`${API_ROUTES.REFERRAL}/${code}`);

    const {
      data: { name, school, school_id: schoolId }
    } = result;
    return { name, school, schoolId };
  } catch (err) {
    return null;
  }
};

export const getReferralProgram = async (): Promise<Object> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.REFERRAL}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (result && result.data) {
      return result.data;
    }

    return null;
  } catch (err) {
    return null;
  }
};

export const getReferralStatus = async (): Promise<Object> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.REFERRAL}/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (result && result.data) {
      return result.data;
    }

    return null;
  } catch (err) {
    return null;
  }
};
