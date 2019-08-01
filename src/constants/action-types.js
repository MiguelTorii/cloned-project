/* 
    SIGN IN ACTION TYPES
*/

export const signInActions = {
  SIGN_IN_USER_REQUEST: 'SIGN_IN_USER_REQUEST',
  SIGN_IN_USER_SUCCESS: 'SIGN_IN_USER_SUCCESS',
  SIGN_IN_USER_ERROR: 'SIGN_IN_USER_ERROR',
  SIGN_IN_USER_CLEAR_ERROR: 'SIGN_IN_USER_CLEAR_ERROR',
  CHECK_USER_REQUEST: 'CHECK_USER_REQUEST',
  SIGN_OUT_USER_REQUEST: 'SIGN_OUT_USER_REQUEST',
  SIGN_OUT_USER_SUCCESS: 'SIGN_OUT_USER_SUCCESS'
};

export const signUpActions = {
  SIGN_UP_USER_REQUEST: 'SIGN_UP_USER_REQUEST',
  SIGN_UP_USER_SUCCESS: 'SIGN_UP_USER_SUCCESS',
  SIGN_UP_USER_ERROR: 'SIGN_UP_USER_ERROR',
  SIGN_UP_USER_CLEAR_ERROR: 'SIGN_UP_USER_CLEAR_ERROR'
};

export const chatActions = {
  OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST:
    'OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST',
  START_CHANNEL_WITH_ENTITY_REQUEST: 'START_CHANNEL_WITH_ENTITY_REQUEST'
};

export const webNotificationsActions = {
  UPDATE_TITLE_REQUEST: 'UPDATE_TITLE_REQUEST',
  UPDATE_TITLE_SUCCESS: 'UPDATE_TITLE_SUCCESS',
  UPDATE_TITLE_ERROR: 'UPDATE_TITLE_ERROR'
};

export const feedActions = {
  FETCH_FEED_REQUEST: 'FETCH_FEED_REQUEST',
  FETCH_FEED_SUCCESS: 'FETCH_FEED_SUCCESS',
  FETCH_FEED_ERROR: 'FETCH_FEED_ERROR',
  CLEAR_FEED_ERROR: 'CLEAR_FEED_ERROR',
  UPDATE_BOOKMARK_REQUEST: 'UPDATE_BOOKMARK_REQUEST',
  SEARCH_FEED_REQUEST: 'SEARCH_FEED_REQUEST',
  SEARCH_FEED_SUCCESS: 'SEARCH_FEED_SUCCESS',
  SEARCH_FEED_ERROR: 'SEARCH_FEED_ERROR',
  UPDATE_FEED_FILTER_FIELD_REQUEST: 'UPDATE_FEED_FILTER_FIELD_REQUEST',
  UPDATE_FEED_LIMIT_REQUEST: 'UPDATE_FEED_LIMIT_REQUEST',
  CLEAR_FEED_FILTER_REQUEST: 'CLEAR_FEED_FILTER_REQUEST'
};

export const authActions = {
  UPDATE_AUTH_SCHOOL_REQUEST: 'UPDATE_AUTH_SCHOOL_REQUEST'
};

export const rootActions = {
  CLEAR_STATE: 'CLEAR_STATE'
};
