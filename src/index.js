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
import FlashCards from './pages/View/Flashcards';
import PhotoNote from './pages/View/Notes';
import ShareLink from './pages/View/ShareLink';
import Question from './pages/View/Question';
import CreateQuestion from './pages/Create/Question';
import CreateNotes from './pages/Create/Notes';
import CreateShareLink from './pages/Create/ShareLink';
import EditQuestion from './pages/Edit/Question';
import Profile from './pages/Profile';
import FloatingChat from './containers/FloatingChat';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <FloatingChat />
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={Index} />
        <Route exact path="/feed" render={Feed} />
        <Route exact path="/flashcards/:flashcardId" render={FlashCards} />
        <Route exact path="/notes/:noteId" render={PhotoNote} />
        <Route exact path="/sharelink/:sharelinkId" render={ShareLink} />
        <Route exact path="/question/:questionId" render={Question} />
        <Route exact path="/create/question" render={CreateQuestion} />
        <Route exact path="/create/notes" render={CreateNotes} />
        <Route exact path="/create/sharelink" render={CreateShareLink} />
        <Route exact path="/edit/question/:id" render={EditQuestion} />
        <Route exact path="/profile/:userId" render={Profile} />
        <Route exact path="/login" render={SignIn} />
        <Route exact path="/signup" render={SignUp} />
        <Route render={() => <div>Miss</div>} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  // $FlowIgnore
  document.getElementById('root')
);

serviceWorker.unregister();
