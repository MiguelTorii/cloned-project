import 'core-js/stable';
import React from 'react';

import { init as sentryInit } from '@sentry/browser';
import axios from 'axios';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';

import { GOOGLE_ANALYTICS, SENTRY, ENV, RELEASE } from 'constants/app';
import defaultKatexRender from 'utils/quill';

import App from 'App';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import store from 'redux/store';
import * as serviceWorker from 'serviceWorker';

import './index.css';

defaultKatexRender('White');
ReactGA.initialize(GOOGLE_ANALYTICS);

if (process.env.NODE_ENV !== 'development') {
  sentryInit({
    dsn: SENTRY,
    environment: process.env.REACT_APP_SENTRY_ENV || ENV,
    release: process.env.REACT_APP_SENTRY_RELEASE || RELEASE
  });
}

axios.defaults.headers.common['x-client-version'] = RELEASE;

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);

serviceWorker.unregister();
