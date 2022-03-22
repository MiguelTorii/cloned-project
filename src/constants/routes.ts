/* eslint-disable no-nested-ternary */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}`
  : process.env.REACT_APP_STAGE === 'production'
  ? 'https://api.circleinapp.com'
  : 'https://dev-api.circleinapp.com';
export const API_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/v1`
  : process.env.REACT_APP_STAGE === 'production'
  ? 'https://api.circleinapp.com/v1'
  : 'https://dev-api.circleinapp.com/v1';
export const API_URL_V1_1 = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/v1.1`
  : process.env.REACT_APP_STAGE === 'production'
  ? 'https://api.circleinapp.com/v1.1'
  : 'https://dev-api.circleinapp.com/v1.1';
export const API_URL_V1_2 = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/v1.2`
  : process.env.REACT_APP_STAGE === 'production'
  ? 'https://api.circleinapp.com/v1.2'
  : 'https://dev-api.circleinapp.com/v1.2';
export const API_URL_V2 = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/v2`
  : process.env.REACT_APP_STAGE === 'production'
  ? 'https://api.circleinapp.com/v2'
  : 'https://dev-api.circleinapp.com/v2';
export const VIDEO_SHARE_URL = process.env.REACT_APP_SELF_URL
  ? `${process.env.REACT_APP_SELF_URL}/video-call`
  : process.env.REACT_APP_STAGE === 'production'
  ? 'https://app.circleinapp.com/video-call'
  : process.env.REACT_APP_STAGE === 'demo'
  ? 'https://demo.circleinapp.com/video-call'
  : 'https://dev-app2.circleinapp.com/video-call';
/* eslint-enable no-nested-ternary */

export const API_ROUTES = {
  SEND_MESSAGE: `${API_URL}/chat/messages`,
  REQUEST: `${API_URL}/request`,
  BATCH_MESSAGE: `${API_URL_V1_1}/batch/chat/message`,
  BATCH_MESSAGE_V1: `${API_URL_V1_2}/batch/chat/message`,
  CHAT_SHARE_LINK: `${API_URL}/chat/link`,
  CHAT_JOIN_LINK: `${API_URL}/chat/link/join`,
  FEEDBACK: `${API_URL}/feedback`,
  NOTES: `${API_URL_V1_1}/notes`,
  TODO: `${API_URL_V1_1}/todo`,
  EVENT: `${API_URL}/event`,
  SYNC: `${API_URL}/user/sync`,
  LOGIN: `${API_URL}/auth/login`,
  SIGNUP: `${API_URL}/auth/register`,
  REFRESH: `${API_URL}/auth/refresh`,
  SEND_CODE: `${API_URL}/auth/send_code`,
  VERIFY_EMAIL: `${API_URL}/auth/verify_code`,
  SEND_SMS_CODE: `${API_URL}/auth/send_sms_code`,
  VERIFY_CODE: `${API_URL}/auth/verify_sms_code`,
  RESET_PASSWORD: `${API_URL}/auth/password_reset`,
  CHANGE_PASSWORD: `${API_URL}/auth/change_password`,
  SAML_LOGIN: `${API_URL}/auth/saml/login`,
  SAML_LOGIN_V1_1: `${API_URL_V1_1}/auth/saml/login`,
  LMS_SCHOOLS: `${API_URL}/lms/schools`,
  LMS_USER: `${API_URL}/lms/oauth2/token`,
  LMS_LOGIN: `${API_URL}/lms/auth/login`,
  CANVAS_SCHOOLS: `${API_URL}/canvas/schools`,
  CANVAS_USER: `${API_URL}/canvas/oauth2/token`,
  CANVAS_LOGIN: `${API_URL}/canvas/auth/login`,
  FEED: `${API_URL}/feed`,
  FEED_V1_1: `${API_URL_V1_1}/feed`,
  RECOMMENDATIONS: `${API_URL}/feed/recommendations`,
  USER_CLASSES_V1_1: `${API_URL_V1_1}/user/classes`,
  CREATELINK: `${API_URL}/feed/link/post`,
  USER: `${API_URL}/user`,
  CHECK_EMAIL: `${API_URL}/user/email/verify`,
  USER_REFERRAL: `${API_URL}/user/referral`,
  USER_CLASS: `${API_URL}/user/class`,
  USER_CLASSES: `${API_URL}/user/classes`,
  GET_BLOCKED_USERS: `${API_URL}/user/blocks`,
  BLOCK_USER: `${API_URL}/user/blocks/create`,
  UNBLOCK_USER: `${API_URL}/user/blocks/destroy`,
  CLASSES: `${API_URL}/classes`,
  SUBJECTS: `${API_URL_V1_2}/school/subjects`,
  SECTIONS: `${API_URL_V1_2}/school/classes/sections`,
  MEDIA_URL: `${API_URL}/media/url`,
  POST: `${API_URL}/post`,
  BATCH_POST: `${API_URL}/batch/post`,
  PHOTO_NOTE: `${API_URL_V1_1}/photo_note`,
  BATCH_PHOTO_NOTE: `${API_URL_V1_1}/batch/photo_note`,
  BATCH_DECK: `${API_URL}/batch/deck`,
  BATCH_LINK: `${API_URL}/batch/link`,
  BATCH_QUESTION: `${API_URL}/batch/question`,
  QUESTION: `${API_URL}/question`,
  DECK: `${API_URL}/deck`,
  FLASHCARDS: `${API_URL_V1_1}/deck`,
  SHARELINK: `${API_URL}/link`,
  STUDY_CIRCLE: `${API_URL}/study_circle`,
  COMMENT: `${API_URL}/comment`,
  REPORT: `${API_URL}/log/report`,
  REPORT_REASONS: `${API_URL}/log/report/reasons`,
  FETCH_SCHOOLS: `${API_URL}/schools`,
  TWILIO_TOKEN: `${API_URL}/twilio/access_token`,
  SEARCH_USERS: `${API_URL}/search`,
  NOTIFICATIONS: `${API_URL}/notifications`,
  PING: `${API_URL}/ping`,
  SCHOOL_USERS: `${API_URL}/school`,
  CHAT: `${API_URL}/chat`,
  CHAT_V1: `${API_URL_V1_1}/chat`,
  CHAT_V2: `${API_URL_V2}/chat`,
  LEADERBOARD: `${API_URL_V1_1}/leaderboard`,
  HOME: `${API_URL}/home`,
  HOME_V1_1: `${API_URL_V1_1}/home`,
  STORE: `${API_URL}/store`,
  VIDEO_INITIATOR: `${API_URL}/video/initiator`,
  VIDEO_SESSION: `${API_URL}/video/session`,
  VIDEO_SESSION_CHECK: `${API_URL}/video/session_check`,
  SEARCH: `${API_URL}/search`,
  SEARCH_SCHOOLS: `${API_URL}/search/school`,
  GET_SCHOOL: `${API_URL}/school`,
  SEARCH_CLASS: `${API_URL}/search/class`,
  QUESTS: `${API_URL}/quests`,
  INVITE: `${API_URL}/invite`,
  CURRENT_SEASON: `${API_URL}/season/current`,
  LEADERBOARD_V2: `${API_URL_V1_2}/leaderboard`,
  LEADERBOARD_V2_BOARD_ONE: `${API_URL_V1_2}/leaderboard/leaders?board_id=1`,
  LEADERBOARD_V2_BOARD_TWO: `${API_URL_V1_2}/leaderboard/leaders?board_id=2`,
  LEADERBOARD_GRAND_PRIZE_INFO: `${API_URL}/store/grand_prize `,
  EVENTS: `${API_URL}/event`,
  REFERRAL: `${API_URL}/referral`,
  ANNOUNCEMENT: `${API_URL}/announcement`,
  ONBOARDING_STATUS: `${API_URL}/onboarding/status`,
  GET_COMMUNITY: `${API_URL_V1_1}/community`,
  GET_COMMUNITY_V1: `${API_URL}/community`,
  WEEKLY_STUDY_GOALS: `${API_URL_V1_2}/home/study_goals`,
  HOME_GREETINGS: `${API_URL_V1_2}/home/greeting`
};
