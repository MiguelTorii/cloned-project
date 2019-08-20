// @flow

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

export const AMPLITUDE =
  process.env.REACT_APP_STAGE === 'production'
    ? 'ce9b8375920be83a09140c26bec6384f'
    : '06c93d893f3b14995223804062799b99';

export const AMPLITUDE_NEW =
  process.env.REACT_APP_STAGE === 'production'
    ? '4fa052782766cac0dd349d2ba4ff6aae'
    : '43f28fcb53bd0ad98609f28d1567dcba';

export const GOOGLE_ANALYTICS =
  process.env.REACT_APP_STAGE === 'production'
    ? 'UA-124636271-1'
    : 'UA-124026444-1';

export const SENTRY =
  'https://300ac9c2204b4d1eb492ca7bbf75f052@sentry.io/1263172';

export const ENV =
  process.env.REACT_APP_STAGE === 'production' ? 'prod' : 'dev';

export const RELEASE = 'V2.0.13';
