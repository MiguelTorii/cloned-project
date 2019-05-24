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
  SEND_CODE: `${API_URL}/auth/send_code`,
  VERIFY_EMAIL: `${API_URL}/auth/verify_code`,
  SEND_SMS_CODE: `${API_URL}/auth/send_sms_code`,
  VERIFY_CODE: `${API_URL}/auth/verify_sms_code`,
  RESET_PASSWORD: `${API_URL}/auth/password_reset`,
  CHANGE_PASSWORD: `${API_URL}/auth/change_password`,
  CANVAS_SCHOOLS: `${API_URL}/canvas/schools`,
  CANVAS_USER: `${API_URL}/canvas/oauth2/token`,
  FEED: `${API_URL}/feed`,
  CREATELINK: `${API_URL}/feed/link/post`,
  USER: `${API_URL}/user`,
  USER_CLASS: `${API_URL}/user/class`,
  USER_CLASSES: `${API_URL}/user/classes`,
  GET_BLOCKED_USERS: `${API_URL}/user/blocks`,
  BLOCK_USER: `${API_URL}/user/blocks/create`,
  UNBLOCK_USER: `${API_URL}/user/blocks/destroy`,
  CLASSES: `${API_URL}/classes`,
  MEDIA_URL: `${API_URL}/media/url`,
  PHOTO_NOTE: `${API_URL_V1_1}/photo_note`,
  QUESTION: `${API_URL}/question`,
  DECK: `${API_URL}/deck`,
  FLASHCARDS: `${API_URL}/temporary_deck`,
  SHARELINK: `${API_URL}/link`,
  STUDY_CIRCLE: `${API_URL}/study_circle`,
  COMMENT: `${API_URL}/comment`,
  REPORT: `${API_URL}/log/report`,
  FETCH_SCHOOLS: `${API_URL}/schools`,
  TWILIO_TOKEN: `${API_URL}/twilio/access_token`,
  SEARCH_USERS: `${API_URL}/search`,
  NOTIFICATIONS: `${API_URL}/notifications`,
  SCHOOL_USERS: `${API_URL}/school`,
  CHAT: `${API_URL}/chat`,
  LEADERBOARD: `${API_URL}/leaderboard`,
  HOME: `${API_URL}/home`,
  HOME_V1_1: `${API_URL_V1_1}/home`,
  STORE: `${API_URL}/store`,
  VIDEO_INITIATOR: `${API_URL}/video/initiator`,
  VIDEO_SESSION: `${API_URL}/video/session`,
  VIDEO_SESSION_CHECK: `${API_URL}/video/session_check`
};
