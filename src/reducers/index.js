// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { BrowserHistory } from 'history';
import user from './user';
import notifications from './notifications';

const reducers = {
  user,
  notifications
};

export type Reducers = typeof reducers;

export default (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });
