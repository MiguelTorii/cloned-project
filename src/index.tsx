import 'core-js/stable';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import axios from 'axios';
import { init as sentryInit } from '@sentry/browser';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { LastLocationProvider } from 'react-router-last-location';
import Home from './containers/Home/Home';
import Classes from './pages/Classes/ClassesPage';
import defaultKatexRender from './utils/quill';
import './wdyr';
import reduxStore, { history } from './configureStore';
import * as serviceWorker from './serviceWorker';
import Store from './pages/Store/StorePage';
import Feed from './pages/Feed/FeedPage';
import Workflow from './pages/Workflow/WorkflowPage';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Notifications from './pages/Notifications/NotificationsPage';
import Share from './pages/Share/SharePage';
import Post from './pages/View/Post';
import PhotoNote from './pages/View/PostPage';
import ShareLink from './pages/View/ShareLinkPage';
import Question from './pages/View/QuestionPage';
import CreateFlashcards from './pages/Create/CreateShareLinkPage';
import CreateQuestion from './pages/Create/CreateQuestionPage';
import CreateNotes from './pages/Create/CreateNotesPage';
import CreateShareLink from './pages/Create/ShareLink';
import CreatePost from './pages/Create/CreatePostPage';
import Profile from './pages/Profile/ProfilePage';
import Reminders from './pages/Reminders/RemindersPage';
import VideoCall from './pages/VideoCall/VideoCallPage';
import StartVideo from './pages/StartVideo/StartVideoPage';
import FloatingChat from './containers/FloatingChat/Chat';
import UserInitializer from './containers/UserInitializer/UserInitializer';
import Referral from './containers/Referrals/Referral';
import Saml from './containers/Auth/Saml';
import StudyCirclein from './pages/Study/StudyPage';
import Auth from './pages/Auth/AuthPage';
import AuthRedirect from './pages/AuthRedirect/AuthRedirectPage';
import SignIn from './pages/SignIn/SignInPage';
import SignUp from './pages/SignUp/SignUpPage';
import ForgotPassword from './pages/ForgotPassword/ForgotPasswordPage';
import OAuthRedirect from './pages/OAuthRedirect/OAuthPage';
import Canvas from './pages/Canvas/CanvasPage';
import TermsOfUse from './pages/TermsOfUse/TermsOfUsePage';
import Redirect from './pages/Redirect/RedirectPage';
import Sandbox from './pages/Sandbox/Sandbox';
import Miss from './pages/Miss/Miss';
import UserNotes from './pages/UserNotes/UserNotes';
import { GOOGLE_ANALYTICS, SENTRY, ENV, RELEASE } from './constants/app';
import withTracker from './withTracker';
import Chat from './pages/Chat/ChatPage';
import ChatChannel from './pages/ChatChannel/ChatChannelPage';
import './index.css';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import OnboardingPopup from './containers/OnboardingPopup/OnboardingPopup';
import MasqueradeFrame from './containers/MasqueradeFrame/MasqueradeFrame';
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage';
import FlashcardsShowPage from './pages/Flashcards/FlashcardsShowPage';
import FlashcardsEditPage from './pages/Flashcards/FlashcardsEditPage';
import Flashcards from './pages/View/FlashcardsPage';
import HomePage from './pages/Home/Home';
import Gondor from './containers/Auth/Gondor';
import { theme } from './withRoot';
import JoinCommunity from './pages/JoinCommunity/JoinCommunity';
import ProviderGroup from './providers';

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
              <OnboardingPopup />
              <UserInitializer />
              <MasqueradeFrame />
              <ConnectedRouter history={history}>
                <LastLocationProvider>
                  <div>
                    <FloatingChat />
                    <Switch>
                      <Route exact path="/" component={withTracker(Home)} />
                      <Route exact path="/create_post" component={withTracker(CreatePost)} />
                      <Route exact path="/notes" component={withTracker(UserNotes)} />
                      <Route exact path="/classes" component={withTracker(Classes)} />
                      <Route exact path="/feed" component={withTracker(Feed)} />
                      <Route exact path="/workflow" component={withTracker(Workflow)} />
                      <Route exact path="/chat/:hashId" component={withTracker(ChatChannel)} />
                      <Route exact path="/chat" component={withTracker(Chat)} />
                      <Route path="/community/:hashId" component={withTracker(JoinCommunity)} />
                      <Route exact path="/bookmarks" component={withTracker(Feed)} />
                      <Route exact path="/my_posts" component={withTracker(Feed)} />
                      <Route exact path="/study" component={withTracker(StudyCirclein)} />
                      <Route exact path="/store" component={withTracker(Store)} />
                      <Route exact path="/leaderboard" component={withTracker(LeaderBoard)} />
                      <Route exact path="/notifications" component={withTracker(Notifications)} />
                      <Route exact path="/share/:code" component={withTracker(Share)} />
                      <Route exact path="/home" component={withTracker(HomePage)} />
                      <Route exact path="/flashcards" component={withTracker(FlashcardsListPage)} />
                      <Route
                        exact
                        path="/flashcards/old/:flashcardId"
                        component={withTracker(Flashcards)}
                      />
                      <Route
                        exact
                        path="/flashcards/:flashcardId"
                        component={withTracker(FlashcardsShowPage)}
                      />
                      <Route exact path="/post/:postId" component={withTracker(Post)} />
                      <Route exact path="/edit/post/:postId" component={withTracker(CreatePost)} />
                      <Route exact path="/notes/:noteId" component={withTracker(PhotoNote)} />
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
                      <Route exact path="/question/:questionId" component={withTracker(Question)} />
                      <Route
                        exact
                        path="/create/flashcards"
                        component={withTracker(CreateFlashcards)}
                      />
                      <Route
                        exact
                        path="/edit/flashcards/:flashcardId"
                        component={withTracker(FlashcardsEditPage)}
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
                      <Route exact path="/create/notes" component={withTracker(CreateNotes)} />
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
                      <Route exact path="/profile/:userId/:tab?" component={withTracker(Profile)} />
                      <Route exact path="/reminders" component={withTracker(Reminders)} />
                      <Route exact path="/video-call/:roomId" component={withTracker(VideoCall)} />
                      <Route exact path="/video-call" component={withTracker(StartVideo)} />
                      <Route exact path="/new" component={withTracker(AuthRedirect)} />
                      <Route exact path="/oauth" component={withTracker(OAuthRedirect)} />
                      <Route exact path="/auth" component={withTracker(AuthRedirect)} />
                      <Route exact path="/reset_password" component={withTracker(AuthRedirect)} />
                      <Route exact path="/old" component={withTracker(Auth)} />
                      <Route exact path="/login" component={withTracker(SignIn)} />
                      <Route exact path="/login/:schoolId" component={withTracker(AuthRedirect)} />
                      <Route exact path="/signup" component={withTracker(SignUp)} />
                      <Route exact path="/saml" component={withTracker(Saml)} />
                      <Route exact path="/gondor" component={withTracker(Gondor)} />
                      <Route exact path="/referral/:code" component={withTracker(Referral)} />
                      <Route
                        exact
                        path="/forgot_password"
                        component={withTracker(ForgotPassword)}
                      />
                      <Route exact path="/terms-of-use" component={withTracker(TermsOfUse)} />
                      <Route exact path="/canvas/:nonce" component={withTracker(Canvas)} />
                      <Route exact path="/redirect" component={Redirect} />
                      <Route exact path="/sandbox" component={Sandbox} />
                      <Route component={Miss} />
                    </Switch>
                  </div>
                </LastLocationProvider>
              </ConnectedRouter>
            </ProviderGroup>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);
serviceWorker.unregister();
