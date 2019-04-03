// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './configureStore';
import * as serviceWorker from './serviceWorker';
import Index from './pages/Home';
import Feed from './pages/Feed';
import Post from './pages/Post';
import Create from './pages/Create';
import SignIn from './pages/SignIn';

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
