// @flow

export const AUTH0_DOMAIN =
  process.env.REACT_APP_STAGE === 'production'
    ? 'circlein-production.us.auth0.com'
    : 'circlein-dev.us.auth0.com'

export const AUTH0_CLIENT_ID =
  process.env.REACT_APP_STAGE === 'production'
    ? 'Fm9qMmK1krorvq9yRz1KAsI3O24V6KV5'
    : 'Bps2iaRf3iIxDeTVJa9zOQI20937s7Dj'

export const AMPLITUDE_IDS =
  process.env.REACT_APP_STAGE === 'production'
    ? ['4fa052782766cac0dd349d2ba4ff6aae', 'ce9b8375920be83a09140c26bec6384f']
    : ['06c93d893f3b14995223804062799b99']

export const ALGOLIA_APP_ID =
  process.env.REACT_APP_STAGE === 'production' ? 'GBPN91RQFL' : 'GBPN91RQFL';

export const ALGOLIA_API_KEY =
  process.env.REACT_APP_STAGE === 'production'
    ? 'c31cce53b626fbf3bfbcdb702424db4a'
    : 'c31cce53b626fbf3bfbcdb702424db4a';

export const ALGOLIA_INDEX =
  process.env.REACT_APP_STAGE === 'production' ? 'dev_tags' : 'dev_tags';

export const REDIRECT_URI =
  // eslint-disable-next-line no-nested-ternary
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://app.circleinapp.com/oauth'
    : process.env.REACT_APP_STAGE === 'demo'
      ? 'https://demo.circleinapp.com/oauth'
      : 'https://dev-app2.circleinapp.com/oauth';

export const GOOGLE_ANALYTICS =
  process.env.REACT_APP_STAGE === 'production'
    ? 'UA-124636271-1'
    : 'UA-124026444-1';

export const SENTRY =
  'https://300ac9c2204b4d1eb492ca7bbf75f052@sentry.io/1263172';

export const HOTJAR_ID = 1763746;

export const HOTJAR_SV  = 6;

export const ENV =
  process.env.REACT_APP_STAGE === 'production' ? 'prod' : 'dev';

export const IOS_REDIRECT_URI =
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://redirect.circleinapp.com/login'
    : 'https://redirect-dev.circleinapp.com/login';

export const IOS_13_REDIRECT_URI =
  process.env.REACT_APP_STAGE === 'production'
    ? 'https://redirect.circleinapp.com/login'
    : 'https://redirect-dev.circleinapp.com/login';

export const ANDROID_REDIRECT_URI =
  process.env.REACT_APP_STAGE === 'production'
    ? 'circleinapp://app.circleinapp.com/oauth'
    : 'circleinapp://dev-app2.circleinapp.com/oauth';

export const RELEASE = 'V2.0.30';

export const TIME_ZONE = 'America/New_York';

export const INTERVAL = {
  SECOND: 1000,
  MINUTE: 60 * 1000
};

export const DURATION_REPLACE_TEXT = '{{ time_left }}';

export const APP_ROOT_PATH = window.location.origin;

export const UPLOAD_MEDIA_TYPES = {
  FLASHCARDS: 6,
  POST_FEED: 1,
  PROFILE_IMAGE: 2
};

export const LOG_EVENT_CATEGORIES = {
  CHAT: 'Chat',
  VIDEO: 'Video',
  POST: 'Post',
  FLASHCARD: 'Flashcard',
  FLASHCARD_REVIEW: 'Flashcard Review',
  FLASHCARD_QUIZ: 'Flashcard Quiz',
  IN_APP_NOTES: 'In-App Notes',
  WORKFLOW: 'Workflow',
  MY_CLASSES: 'My Classes',
  PROFILE: 'Profile',
  LEADERBOARD: 'Leaderboard',
  REWARDS_STORE: 'Rewards Store',
  CLASS_FEED: 'Class Feed',
  CREATE_NEW_POST: 'Create New Post',
  NOTIFICATION: 'Notification',
}

export const EVENT_TYPES = {
  SEND_MESSAGE: 'Send Message',
  START_VIDEO: 'Start Video',
  END_VIDEO: 'End Video',
  SESSION_LENGTH: 'Session Length',
  VIEWED: 'Viewed',
  EXITED: 'Exited',
}

export const CIRCLEIN_EVENT_NAMES = [
  'Chat- Send Message',
  'Video- Start Video',
  'Video- End Video',
  'Video- Session Length',
  'Post- Viewed',
  'Flashcard Review- Viewed',
  'Flashcard Quiz- Exited',
  'Flashcard- Viewed',
  'In-App Notes- Viewed',
  'Workflow- Viewed',
  'My Classes- Viewed',
  'Profile- Viewed',
  'Leaderboard- Viewed',
  'Rewards Store- Viewed',
  'Class Feed- Viewed',
  'Create New Post- Viewed',
  'Notification- Viewed',
  'Chat- Viewed',
];

export const CAMPAIGN_IDS = {
  FLASHCARD_VERSION: 14
};

export const MEMBER_ROLES = {
  TUTOR: 'Tutor',
  ORIENTATION_LEADER: 'Orientation Leader',
  EXPERT: 'Expert'
}

export const GONDOR_URL = 'https://siteadmin.circleinapp.com';
