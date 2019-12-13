// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { BrowserHistory } from 'history';
import user from './user';
import chat from './chat';
import feed from './feed';
import auth from './auth';
import leaderboard from './leaderboard';
import webNotifications from './web-notifications';
import notifications from './notifications';

const reducers = {
  user,
  chat,
  feed,
  auth,
  webNotifications,
  notifications,
  leaderboard
};

export type Reducers = typeof reducers;

export default (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });
