import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const fetchSchools = async ({ stateId }: { stateId: number }) => {
  const result = await axios.get(`${API_ROUTES.FETCH_SCHOOLS}?state_id=${stateId}`);
  const { data = {} } = result;
  const { schools } = data;
  return schools;
};
export const sendCode = async ({ email }: { email: string }) => {
  try {
    const result = await axios.post(API_ROUTES.SEND_CODE, {
      email
    });
    const { data = {} } = result;
    return data;
  } catch (err: any) {
    const errorMessage =
      (err.response && err.response.data && err.response.data.message) || 'Error occurred';
    return {
      error: errorMessage
    };
  }
};
export const verifyCode = async ({ email, code }: { email: string; code: string }) => {
  const result = await axios.post(API_ROUTES.VERIFY_EMAIL, {
    email,
    code
  });
  const { data = {} } = result;
  return data;
};
export const createAccount = async ({
  grade,
  school,
  firstName,
  lastName,
  password,
  email,
  phone,
  segment,
  referralCode = ''
}: {
  grade: number;
  school: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  segment: string;
  referralCode: string;
}) => {
  const result = await axios.post(API_ROUTES.SIGNUP, {
    grade,
    school_id: school,
    first_name: firstName,
    last_name: lastName,
    password,
    email,
    cell: phone,
    segment,
    referral_code: referralCode
  });
  const { data = {} } = result;
  return data;
};
export const setReferral = async ({
  userId,
  referralCode
}: {
  userId: string;
  referralCode: string;
}) => {
  const token = await getToken();
  const result = await axios.post(
    API_ROUTES.USER_REFERRAL,
    {
      user_id: Number(userId),
      referral_code: referralCode
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
