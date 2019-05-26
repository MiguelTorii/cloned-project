// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './configureStore';
import * as serviceWorker from './serviceWorker';
import Index from './pages/Home';
import Store from './pages/Store';
import Feed from './pages/Feed';
import Share from './pages/Share';
import FlashCards from './pages/View/Flashcards';
import PhotoNote from './pages/View/Notes';
import ShareLink from './pages/View/ShareLink';
import Question from './pages/View/Question';
import CreateFlashcards from './pages/Create/Flashcards';
import CreateQuestion from './pages/Create/Question';
import CreateNotes from './pages/Create/Notes';
import CreateShareLink from './pages/Create/ShareLink';
import EditQuestion from './pages/Edit/Question';
import Profile from './pages/Profile';
import Reminders from './pages/Reminders';
import VideoCall from './pages/VideoCall';
import StartVideo from './pages/StartVideo';
import FloatingChat from './containers/FloatingChat';
import DailyRewards from './containers/DailyRewards';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OAuth from './pages/OAuth';
import { init as analyticsInit } from './api/analytics';
import { AMPLITUDE, AMPLITUDE_NEW } from './constants/app';

const store = configureStore();

analyticsInit(AMPLITUDE, AMPLITUDE_NEW);

ReactDOM.render(
  <Provider store={store}>
    <FloatingChat />
    <DailyRewards />
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={Index} />
        <Route exact path="/store" render={Store} />
        <Route exact path="/feed" render={Feed} />
        <Route exact path="/share/:code" render={Share} />
        <Route exact path="/flashcards/:flashcardId" render={FlashCards} />
        <Route exact path="/notes/:noteId" render={PhotoNote} />
        <Route exact path="/sharelink/:sharelinkId" render={ShareLink} />
        <Route exact path="/question/:questionId" render={Question} />
        <Route exact path="/create/flashcards" render={CreateFlashcards} />
        <Route exact path="/create/question" render={CreateQuestion} />
        <Route exact path="/create/notes" render={CreateNotes} />
        <Route exact path="/create/sharelink" render={CreateShareLink} />
        <Route exact path="/edit/question/:id" render={EditQuestion} />
        <Route exact path="/profile/:userId" render={Profile} />
        <Route exact path="/reminders" render={Reminders} />
        <Route exact path="/video-call/:roomId" render={VideoCall} />
        <Route exact path="/video-call" render={StartVideo} />
        <Route exact path="/login" render={SignIn} />
        <Route exact path="/signup" render={SignUp} />
        <Route exact path="/oauth" render={OAuth} />
        <Route render={() => <div>Miss</div>} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  // $FlowIgnore
  document.getElementById('root')
);

serviceWorker.unregister();
