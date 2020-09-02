// @flow

export const AUTH0_DOMAIN =
  process.env.REACT_APP_STAGE === 'production'
    ? 'circlein-production.us.auth0.com'
    : 'circlein-dev.us.auth0.com'

export const AUTH0_CLIENT_ID =
  process.env.REACT_APP_STAGE === 'production'
    ? 'Fm9qMmK1krorvq9yRz1KAsI3O24V6KV5'
    : 'Bps2iaRf3iIxDeTVJa9zOQI20937s7Dj'

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
