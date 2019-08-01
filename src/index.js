// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { init as sentryInit } from '@sentry/browser';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './configureStore';
import * as serviceWorker from './serviceWorker';
import Index from './pages/Home';
import Store from './pages/Store';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
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
import UpdateLMSUser from './containers/UpdateLMSUser';
import Auth from './pages/Auth';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuth from './pages/OAuth';
import Canvas from './pages/Canvas';
import Sandbox from './pages/Sandbox';
import { init as analyticsInit } from './api/analytics';
import {
  AMPLITUDE,
  AMPLITUDE_NEW,
  GOOGLE_ANALYTICS,
  SENTRY,
  ENV,
  RELEASE
} from './constants/app';
import withTracker from './withTracker';

const store = configureStore();

ReactGA.initialize(GOOGLE_ANALYTICS);

sentryInit({
  dsn: SENTRY,
  environment: ENV,
  release: RELEASE
});

analyticsInit(AMPLITUDE, AMPLITUDE_NEW);

ReactDOM.render(
  <Provider store={store}>
    <FloatingChat />
    <DailyRewards />
    <UpdateLMSUser />
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={withTracker(Index)} />
        <Route exact path="/store" component={withTracker(Store)} />
        <Route exact path="/feed" component={withTracker(Feed)} />
        <Route exact path="/chat" component={withTracker(Chat)} />
        <Route
          exact
          path="/notifications"
          component={withTracker(Notifications)}
        />
        <Route exact path="/share/:code" component={withTracker(Share)} />
        <Route
          exact
          path="/flashcards/:flashcardId"
          component={withTracker(FlashCards)}
        />
        <Route exact path="/notes/:noteId" component={withTracker(PhotoNote)} />
        <Route
          exact
          path="/sharelink/:sharelinkId"
          component={withTracker(ShareLink)}
        />
        <Route
          exact
          path="/question/:questionId"
          component={withTracker(Question)}
        />
        <Route
          exact
          path="/create/flashcards"
          component={withTracker(CreateFlashcards)}
        />
        <Route
          exact
          path="/create/question"
          component={withTracker(CreateQuestion)}
        />
        <Route
          exact
          path="/create/notes"
          component={withTracker(CreateNotes)}
        />
        <Route
          exact
          path="/create/sharelink"
          component={withTracker(CreateShareLink)}
        />
        <Route
          exact
          path="/edit/question/:id"
          component={withTracker(EditQuestion)}
        />
        <Route exact path="/profile/:userId" component={withTracker(Profile)} />
        <Route exact path="/reminders" component={withTracker(Reminders)} />
        <Route
          exact
          path="/video-call/:roomId"
          component={withTracker(VideoCall)}
        />
        <Route exact path="/video-call" component={withTracker(StartVideo)} />
        <Route exact path="/auth" component={withTracker(Auth)} />
        <Route exact path="/login" component={withTracker(SignIn)} />
        <Route exact path="/signup" component={withTracker(SignUp)} />
        <Route
          exact
          path="/forgot_password"
          component={withTracker(ForgotPassword)}
        />
        ç
        <Route
          exact
          path="/reset_password"
          component={withTracker(ResetPassword)}
        />
        <Route exact path="/oauth" component={withTracker(OAuth)} />
        <Route exact path="/canvas/:nonce" component={withTracker(Canvas)} />
        <Route exact path="/sandbox" component={Sandbox} />
        <Route render={() => <div>Miss</div>} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  // $FlowIgnore
  document.getElementById('root')
);

serviceWorker.unregister();
