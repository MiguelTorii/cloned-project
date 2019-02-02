// @flow

export const API_URL =
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://api.circleinapp.com/v1'
    : 'https://dev-api.circleinapp.com/v1';

export const API_ROUTES = {
  LOGIN: `${API_URL}/auth/login`,
  SIGNUP: `${API_URL}/auth/register`,
  REFRESH: `${API_URL}/auth/refresh`,
  FEED: `${API_URL}/feed`,
  USER_CLASSES: `${API_URL}/user/classes`,
  SEND_SMS_CODE: `${API_URL}/auth/send_sms_code`,
  VERIFY_CODE: `${API_URL}/auth/verify_sms_code`,
  RESET_PASSWORD: `${API_URL}/auth/password_reset`,
  CHANGE_PASSWORD: `${API_URL}/auth/change_password`,
  VERIFY_EMAIL: `${API_URL}/auth/verify_code`,
  SEND_CODE: `${API_URL}/auth/send_code`
};
