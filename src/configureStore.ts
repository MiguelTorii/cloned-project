import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';
import apiActionCreator from './middlewares/apiActionCreator';

export const history = createBrowserHistory();
const composeEnhancers =
  (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const reduxStore = createStore(
  createRootReducer(history),
  {},
  composeEnhancers(applyMiddleware(routerMiddleware(history), thunk, apiActionCreator))
);
export default reduxStore;
