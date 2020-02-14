// @flow

import { combineReducers } from 'redux';
import {
  connectRouter, go, goBack, goForward,
  push, replace
} from 'connected-react-router';

import type { BrowserHistory } from 'history';
import user from './user';
import chat from './chat';
import feed from './feed';
import auth from './auth';
import leaderboard from './leaderboard';
import webNotifications from './web-notifications';
import notifications from './notifications';

const routerActions = {
  push: typeof push,
  replace: typeof replace,
  go: typeof go,
  goBack: typeof goBack,
  goForward: typeof goForward,
};

const reducers = {
  user,
  chat,
  feed,
  auth,
  router: routerActions,
  webNotifications,
  notifications,
  leaderboard
};

export type Reducers = typeof reducers;

export default (history: BrowserHistory) =>
  combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
