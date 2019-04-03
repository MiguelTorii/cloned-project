// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './configureStore';
import * as serviceWorker from './serviceWorker';
import Index from './pages/index';
import Feed from './pages/feed';
import Post from './pages/post';
import Create from './pages/create';
import SignIn from './pages/sign-in';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={Index} />
        <Route exact path="/feed" render={Feed} />
        <Route exact path="/feed/:feedId" render={Post} />
        <Route exact path="/create/:type" render={Create} />
        <Route exact path="/login" render={SignIn} />
        <Route render={() => <div>Miss</div>} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  // $FlowIgnore
  document.getElementById('root')
);

serviceWorker.unregister();
