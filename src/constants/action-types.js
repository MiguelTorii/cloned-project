export const notesActions = {
  UPDATE_NOTES: 'UPDATE_NOTES',
  UPDATE_NOTE: 'UPDATE_NOTE',
  ADD_NOTE: 'ADD_NOTE',
  SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
  SET_SECTION_ID: 'SET_SECTION_ID',
  UPDATE_QUICKNOTE_CONTENT: 'UPDATE_QUICKNOTE_CONTENT',
  RESET_QUICKNOTE: 'RESET_QUICKNOTE',
  REMOVE_NOTE: 'REMOVE_NOTE',
  LOADING_NOTES: 'LOADING_NOTES'
};

export const campaignActions = {
  GET_CAMPAIGN: 'GET_CAMPAIGN',
  GET_FLASHCARDS_CAMPAIGN: 'GET_FLASHCARDS_CAMPAIGN'
};

export const dialogActions = {
  UPDATE_VISIBILITY: 'UPDATE_VISIBLITY'
};

export const userActions = {
  SET_BANNER_HEIGHT: 'SET_BANNER_HEIGHT',
  CLEAR_DIALOG_MESSAGE: 'CLEAR_DIALOG_MESSAGE',
  UPDATE_CLASSES: 'UPDATE_CLASSES',
  SET_EXPERT_MODE: 'SET_EXPERT_MODE',
  UPDATE_TOUR: 'UPDATE_TOUR',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  CONFIRM_TOOLITP_SUCCESS: 'CONFIRM_TOOLITP_SUCCESS',
  UPDATE_ONBOARDING: 'UPDATE_ONBOARDING',
  GET_ANNOUNCEMENT_SUCCESS: 'GET_ANNOUNCEMENT_SUCCESS',
  GET_POINTS_HISTORY: 'GET_POINTS_HISTORY',
  SET_IS_MASQUERADING: 'SET_IS_MASQUERADING',
  GET_FLASHCARDS: 'GET_FLASHCARDS',
  DELETE_FLASHCARDS: 'DELETE_FLASHCARDS',
  BOOKMARK_FLASHCARDS: 'BOOKMARK_FLASHCARDS',
  UPDATE_PROFILE_IMAGE: 'UPDATE_PROFILE_IMAGE'
};

export const signInActions = {
  SIGN_IN_USER_REQUEST: 'SIGN_IN_USER_REQUEST',
  SIGN_IN_USER_SUCCESS: 'SIGN_IN_USER_SUCCESS',
  SIGN_IN_USER_ERROR: 'SIGN_IN_USER_ERROR',
  SIGN_IN_USER_CLEAR_ERROR: 'SIGN_IN_USER_CLEAR_ERROR',
  CHECK_USER_REQUEST: 'CHECK_USER_REQUEST',
  SIGN_OUT_USER_REQUEST: 'SIGN_OUT_USER_REQUEST',
  SIGN_OUT_USER_SUCCESS: 'SIGN_OUT_USER_SUCCESS',
  SIGN_IN_GONDOR: 'SIGN_IN_GONDOR'
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
  UPDATE_LEADERBOARD_GRAND_INFO_RESQUEST:
    'UPDATE_LEADERBOARD_GRAND_INFO_RESQUEST'
};

export const chatActions = {
	SET_OPEN_ONE_TOUCH_SEND: 'SET_OPEN_ONE_TOUCH_SEND',
  SET_CURRENT_CHANNEL: 'SET_CURRENT_CHANNEL',
  SET_CURRENT_COMMUNITY_CHANNEL: 'SET_CURRENT_COMMUNITY_CHANNEL',
  SET_CURRENT_COMMUNITY: 'SET_CURRENT_COMMUNITY',
  SET_CURRENT_COURSE_ID: 'SET_CURRENT_COURSE_ID',
  SET_MAIN_MESSAGE: 'SET_MAIN_MESSAGE',
  CLOSE_NEW_CHANNEL: 'CLOSE_NEW_CHANNEL',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  CHAT_START_LOADING: 'CHAT_START_LOADING',
  MUTE_CHANNEL: 'MUTE_CHANNEL',
  CREATE_NEW_CHANNEL: 'CREATE_NEW_CHANNEL',
  OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST:
    'OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST',
  START_CHANNEL_WITH_ENTITY_REQUEST: 'START_CHANNEL_WITH_ENTITY_REQUEST',
  INIT_LOCAL_CHAT: 'INIT_LOCAL_CHAT',
  INIT_CLIENT_CHAT: 'INIT_CLIENT_CHAT',
  INIT_CHANNELS_CHAT: 'INIT_CHANNELS_CHAT',
  UPDATE_CHANNEL_CHAT: 'UPDATE_CHANNEL_CHAT',
  UPDATE_MEMBERS_CHAT: 'UPDATE_MEMBERS_CHAT',
  UPDATE_SHARE_LINK_CHAT: 'UPDATE_SHARE_LINK_CHAT',
  REMOVE_MEMBER_CHAT: 'REMOVE_MEMBER_CHAT',
  ADD_CHANNEL_CHAT: 'ADD_CHANNEL_CHAT',
  REMOVE_CHANNEL_CHAT: 'REMOVE_CHANNEL_CHAT',
  SHUTDOWN_CHAT: 'SHUTDOWN_CHAT',
  UPDATE_UNREAD_COUNT_CHAT: 'UPDATE_UNREAD_COUNT_CHAT',
  SET_OPEN_CHANNELS: 'SET_OPEN_CHANNELS',
  UPDATE_CHANNEL_ATTRIBUTES: 'UPDATE_CHANNEL_ATTRIBUTES',
  UPDATE_FRIENDLY_NAME: 'UPDATE_FRIENDLY_NAME',
  SET_COMMUNITIES: 'SET_COMMUNITIES',
  SET_COMMUNITY_CHANNELS: 'SET_COMMUNITY_CHANNELS'
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
  CLEAR_FEEDS: 'CLEAR_FEEDS'
};

export const authActions = {
  UPDATE_AUTH_ROLE: 'UPDATE_AUTH_ROLE',
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

export const onboardingActions = {
  GET_ONBOARDING_LIST_SUCCESS: 'GET_ONBOARDING_LIST_SUCCESS',
  MARK_AS_COMPLETED: 'MARK_AS_COMPLETED'
};

export const apiActions = {
  API_CALL_START: 'API_CALL_START',
  API_CALL_SUCCESS: 'API_CALL_SUCCESS',
  API_CALL_FAILURE: 'API_CALL_FAILURE'
};
