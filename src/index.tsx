import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import axios from 'axios';
import { init as sentryInit } from '@sentry/browser';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import defaultKatexRender from './utils/quill';
import './wdyr';
import reduxStore from './configureStore';
import * as serviceWorker from './serviceWorker';
import UserInitializer from './containers/UserInitializer/UserInitializer';
import { GOOGLE_ANALYTICS, SENTRY, ENV, RELEASE } from './constants/app';
import './index.css';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import MasqueradeFrame from './containers/MasqueradeFrame/MasqueradeFrame';
import { theme } from './withRoot';
import ProviderGroup from './providers';
import Routes from './Routes';

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
    <Provider store={reduxStore}>
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider maxSnack={3}>
            <ProviderGroup>
              <CssBaseline />
              <UserInitializer />
              <MasqueradeFrame />
              <Routes />
            </ProviderGroup>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);
serviceWorker.unregister();
