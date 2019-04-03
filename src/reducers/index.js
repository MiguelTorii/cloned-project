// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { BrowserHistory } from 'history';
import user from './user';
import share from './share';
import notifications from './notifications';
import feed from './feed';

const reducers = {
  user,
  share,
  notifications,
  feed
};

export type Reducers = typeof reducers;

export default (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });
