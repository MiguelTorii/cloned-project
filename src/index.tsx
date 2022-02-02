import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import store from 'redux/store';
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import axios from 'axios';
import { init as sentryInit } from '@sentry/browser';

import defaultKatexRender from 'utils/quill';
import { GOOGLE_ANALYTICS, SENTRY, ENV, RELEASE } from 'constants/app';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';

import 'wdyr';
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
