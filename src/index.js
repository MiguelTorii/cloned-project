// @flow

import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import axios from 'axios';
import { init as sentryInit } from '@sentry/browser';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import { hotjar } from 'react-hotjar';
// import Tour from 'components/Tour'
import Home from 'containers/Home'
import Classes from 'pages/Classes';
import './wdyr'
import configureStore, { history } from './configureStore';
import * as serviceWorker from './serviceWorker';
import Store from './pages/Store';
import Feed from './pages/Feed';
import Workflow from './pages/Workflow';
import LeaderBoard from './pages/LeaderBoard';
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
import Profile from './pages/Profile';
import Reminders from './pages/Reminders';
import VideoCall from './pages/VideoCall';
import StartVideo from './pages/StartVideo';
// import StudyCircle from './pages/StudyCircle';
import FloatingChat from './containers/FloatingChat';
import UpdateLMSUser from './containers/UpdateLMSUser';
import { Referral } from './containers/Referrals';
import Saml from './containers/Auth/Saml';
// import TwoWeekNotesContest from './containers/TwoWeekNotesContest';
import Auth from './pages/Auth';
import AuthRedirect from './pages/AuthRedirect';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuth from './pages/OAuth';
import OAuthRedirect from './pages/OAuthRedirect';
import Canvas from './pages/Canvas';
import TermsOfUse from './pages/TermsOfUse';
import Redirect from './pages/Redirect';
import Sandbox from './pages/Sandbox';
import Miss from './pages/Miss'
import UserNotes from './pages/UserNotes'
import {
  GOOGLE_ANALYTICS,
  SENTRY,
  ENV,
  RELEASE,
  HOTJAR_ID,
  HOTJAR_SV
} from './constants/app';
import withTracker from './withTracker';
import Chat from './pages/Chat'
import './index.css'

const store = configureStore();

ReactGA.initialize(GOOGLE_ANALYTICS);

if (ENV !== 'dev') {
  hotjar.initialize(HOTJAR_ID, HOTJAR_SV);
}

if (process.env.NODE_ENV !== 'development') {
  sentryInit({
    dsn: SENTRY,
    environment: process.env.REACT_APP_SENTRY_ENV || ENV,
    release: process.env.REACT_APP_SENTRY_RELEASE || RELEASE
  });
}

axios.defaults.headers.common['x-client-version'] = RELEASE;

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider>
      {/* <Tour /> */}
      <UpdateLMSUser />
      <ConnectedRouter history={history}>
        <div>
          <FloatingChat />
          <Switch>
            <Route exact path="/" component={withTracker(Home)} />
            <Route exact path="/notes" component={withTracker(UserNotes)} />
            <Route exact path="/classes" component={withTracker(Classes)} />
            <Route exact path="/feed" component={withTracker(Feed)} />
            <Route exact path="/workflow" component={withTracker(Workflow)} />
            <Route exact path="/chat" component={withTracker(Chat)} />
            <Route exact path="/bookmarks" component={withTracker(Feed)} />
            <Route exact path="/my_posts" component={withTracker(Feed)} />
            <Route exact path="/store" component={withTracker(Store)} />
            <Route exact path="/leaderboard" component={withTracker(LeaderBoard)} />
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
            <Route
              exact
              path="/notes/:noteId"
              component={withTracker(PhotoNote)}
            />
            <Route
              exact
              path="/sharelink/:sharelinkId"
              component={withTracker(ShareLink)}
            />
            <Route
              exact
              path="/edit/sharelink/:sharelinkId"
              component={withTracker(CreateShareLink)}
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
              path="/edit/flashcards/:flashcardId"
              component={withTracker(CreateFlashcards)}
            />
            <Route
              exact
              path="/create/question"
              component={withTracker(CreateQuestion)}
            />
            <Route
              exact
              path="/edit/question/:questionId"
              component={withTracker(CreateQuestion)}
            />
            <Route
              exact
              path="/create/notes"
              component={withTracker(CreateNotes)}
            />
            <Route
              exact
              path="/edit/notes/:noteId"
              component={withTracker(CreateNotes)}
            />
            <Route
              exact
              path="/create/sharelink"
              component={withTracker(CreateShareLink)}
            />
            <Route
              exact
              path="/edit/sharelink/:sharelinkId"
              component={withTracker(CreateShareLink)}
            />
            <Route
              exact
              path="/profile/:userId/:tab?"
              component={withTracker(Profile)}
            />
            <Route exact path="/reminders" component={withTracker(Reminders)} />
            <Route
              exact
              path="/video-call/:roomId"
              component={withTracker(VideoCall)}
            />
            <Route exact path="/video-call" component={withTracker(StartVideo)} />
            {/* <Route */}
            {/* exact */}
            {/* path="/study-circle" */}
            {/* component={withTracker(StudyCircle)} */}
            {/* /> */}
            <Route exact path="/new" component={withTracker(AuthRedirect)} />
            <Route exact path="/new-oauth" component={withTracker(OAuthRedirect)} />
            <Route exact path="/auth" component={withTracker(Auth)} />
            <Route exact path="/login" component={withTracker(SignIn)} />
            <Route exact path="/signup" component={withTracker(SignUp)} />
            <Route exact path="/saml" component={withTracker(Saml)} />
            <Route exact path="/referral/:code" component={withTracker(Referral)} />
            <Route
              exact
              path="/forgot_password"
              component={withTracker(ForgotPassword)}
            />
            <Route
              exact
              path="/reset_password"
              component={withTracker(ResetPassword)}
            />
            <Route exact path="/oauth" component={withTracker(OAuth)} />
            <Route
              exact
              path="/terms-of-use"
              component={withTracker(TermsOfUse)}
            />
            <Route exact path="/canvas/:nonce" component={withTracker(Canvas)} />
            <Route exact path="/redirect" component={Redirect} />
            <Route exact path="/sandbox" component={Sandbox} />
            <Route component={Miss} />
          </Switch>
        </div>
      </ConnectedRouter>
    </SnackbarProvider>
  </Provider>,
  // $FlowIgnore
  document.getElementById('root')
);

serviceWorker.unregister();
