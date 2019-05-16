// @flow

export const API_URL =
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://api.circleinapp.com/v1'
    : 'https://dev-api.circleinapp.com/v1';

export const API_URL_V1_1 =
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://api.circleinapp.com/v1.1'
    : 'https://dev-api.circleinapp.com/v1.1';

export const VIDEO_SHARE_URL =
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://app.circleinapp.com/video-call'
    : 'https://dev-app2.circleinapp.com/video-call';

export const API_ROUTES = {
  LOGIN: `${API_URL}/auth/login`,
  SIGNUP: `${API_URL}/auth/register`,
  REFRESH: `${API_URL}/auth/refresh`,
  FEED: `${API_URL}/feed`,
  USER: `${API_URL}/user`,
  CLASSES: `${API_URL}/classes`,
  USER_CLASS: `${API_URL}/user/class`,
  USER_CLASSES: `${API_URL}/user/classes`,
  SEND_SMS_CODE: `${API_URL}/auth/send_sms_code`,
  VERIFY_CODE: `${API_URL}/auth/verify_sms_code`,
  RESET_PASSWORD: `${API_URL}/auth/password_reset`,
  CHANGE_PASSWORD: `${API_URL}/auth/change_password`,
  VERIFY_EMAIL: `${API_URL}/auth/verify_code`,
  SEND_CODE: `${API_URL}/auth/send_code`,
  MEDIA_URL: `${API_URL}/media/url`,
  PHOTO_NOTE: `${API_URL_V1_1}/photo_note`,
  QUESTION: `${API_URL}/question`,
  DECK: `${API_URL}/deck`,
  FLASHCARDS: `${API_URL}/temporary_deck`,
  SHARELINK: `${API_URL}/link`,
  CREATELINK: `${API_URL}/feed/link/post`,
  STUDY_CIRCLE: `${API_URL}/study_circle`,
  COMMENT: `${API_URL}/comment`,
  REPORT: `${API_URL}/log/report`,
  CANVAS_SCHOOLS: `${API_URL}/canvas/schools`,
  CANVAS_USER: `${API_URL}/canvas/oauth2/token`,
  FETCH_SCHOOLS: `${API_URL}/schools`,
  TWILIO_TOKEN: `${API_URL}/twilio/access_token`,
  GET_BLOCKED_USERS: `${API_URL}/user/blocks`,
  BLOCK_USER: `${API_URL}/user/blocks/create`,
  SEARCH_USERS: `${API_URL}/search`
};
