export const campaignActions = {
  GET_CAMPAIGN: 'GET_CAMPAIGN'
}

export const userActions = {
  UPDATE_CLASSES: 'UPDATE_CLASSES',
  UPDATE_TOUR: 'UPDATE_TOUR',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  CONFIRM_TOOLITP_SUCCESS: 'CONFIRM_TOOLITP_SUCCESS',
  UPDATE_ONBOARDING: 'UPDATE_ONBOARDING',
};

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

export const leaderboardActions = {
  UPDATE_LEADERBOARD_REQUEST: 'UPDATE_LEADERBOARD_REQUEST',
  UPDATE_LEADERBOARD_TUESDAY_REQUEST: 'UPDATE_LEADERBOARD_TUESDAY_REQUEST',
  UPDATE_LEADERBOARD_GRAND_REQUEST: 'UPDATE_LEADERBOARD_GRAND_REQUEST',
  UPDATE_LEADERBOARD_GRAND_INFO_RESQUEST: 'UPDATE_LEADERBOARD_GRAND_INFO_RESQUEST'
};

export const chatActions = {
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST:
    'OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST',
  START_CHANNEL_WITH_ENTITY_REQUEST: 'START_CHANNEL_WITH_ENTITY_REQUEST',
  INIT_CLIENT_CHAT: 'INIT_CLIENT_CHAT',
  INIT_CHANNELS_CHAT: 'INIT_CHANNELS_CHAT',
  UPDATE_CHANNEL_CHAT: 'UPDATE_CHANNEL_CHAT',
  ADD_CHANNEL_CHAT: 'ADD_CHANNEL_CHAT',
  REMOVE_CHANNEL_CHAT: 'REMOVE_CHANNEL_CHAT',
  SHUTDOWN_CHAT: 'SHUTDOWN_CHAT',
  UPDATE_UNREAD_COUNT_CHAT: 'UPDATE_UNREAD_COUNT_CHAT',
  SET_OPEN_CHANNELS: 'SET_OPEN_CHANNELS'
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
  CLEAR_FEED_FILTER_REQUEST: 'CLEAR_FEED_FILTER_REQUEST',
  UPDATE_SCROLL_DATA: 'UPDATE_SCROLL_DATA',
  RESET_SCROLL_DATA: 'RESET_SCROLL_DATA',
};

export const authActions = {
  UPDATE_AUTH_SCHOOL_REQUEST: 'UPDATE_AUTH_SCHOOL_REQUEST',
  UPDATE_REFERRAL_DATA: 'UPDATE_REFERRAL_DATA'
};

export const notificationsActions = {
  ENQUEUE_SNACKBAR_REQUEST: 'ENQUEUE_SNACKBAR_REQUEST',
  CLOSE_SNACKBAR_REQUEST: 'CLOSE_SNACKBAR_REQUEST',
  REMOVE_SNACKBAR_REQUEST: 'REMOVE_SNACKBAR_REQUEST'
};

export const rootActions = {
  CLEAR_STATE: 'CLEAR_STATE'
};
