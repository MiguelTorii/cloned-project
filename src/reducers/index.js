// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { BrowserHistory } from 'history';
import user from './user';
import chat from './chat';
import webNotifications from './web-notifications';

const reducers = {
  user,
  chat,
  webNotifications
};

export type Reducers = typeof reducers;

export default (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });
