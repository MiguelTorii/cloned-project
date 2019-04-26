// @flow

export const ALGOLIA_APP_ID =
  process.env.REACT_APP_STAGE === 'production' ? 'GBPN91RQFL' : 'GBPN91RQFL';

export const ALGOLIA_API_KEY =
  process.env.REACT_APP_STAGE === 'production'
    ? 'c31cce53b626fbf3bfbcdb702424db4a'
    : 'c31cce53b626fbf3bfbcdb702424db4a';

export const ALGOLIA_INDEX =
  process.env.REACT_APP_STAGE === 'production' ? 'dev_tags' : 'dev_tags';
