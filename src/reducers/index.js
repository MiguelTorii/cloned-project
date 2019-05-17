// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { BrowserHistory } from 'history';
import user from './user';

const reducers = {
  user
};

export type Reducers = typeof reducers;

export default (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });
