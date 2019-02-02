// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import user from './user';

const reducers = {
  user
};

export type Reducers = typeof reducers;

export default history =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });
