import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { LastLocationProvider } from 'react-router-last-location';
import { history } from 'redux/store';
import Home from './containers/Home/Home';
import ClassesPage from './pages/Classes/ClassesPage';
import StorePage from './pages/Store/StorePage';
import FeedPage from './pages/Feed/FeedPage';
import WorkflowPage from './pages/Workflow/WorkflowPage';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import SharePage from './pages/Share/SharePage';
import Post from './pages/View/Post';
import PostPage from './pages/View/PostPage';
import ShareLinkPage from './pages/View/ShareLinkPage';
import Question from './pages/View/QuestionPage';
import CreateQuestion from './pages/Create/CreateQuestionPage';
import CreateNotes from './pages/Create/CreateNotesPage';
import CreateShareLink from './pages/Create/ShareLink';
import CreatePostPage from './pages/Create/CreatePostPage';
import ProfilePage from './pages/Profile/ProfilePage';
import VideoCallPage from './pages/VideoCall/VideoCallPage';
import StartVideoPage from './pages/StartVideo/StartVideoPage';
import FloatingChatContainer from './containers/FloatingChat/FloatingChatContainer';
import Referral from './containers/Referrals/Referral';
import Saml from './containers/Auth/Saml';
import StudyPage from './pages/Study/StudyPage';
import AuthPage from './pages/Auth/AuthPage';
import AuthRedirectPage from './pages/AuthRedirect/AuthRedirectPage';
import SignInPage from './pages/SignIn/SignInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import OAuthPage from './pages/OAuthRedirect/OAuthPage';
import CanvasPage from './pages/Canvas/CanvasPage';
import TermsOfUsePage from './pages/TermsOfUse/TermsOfUsePage';
import RedirectPage from './pages/Redirect/RedirectPage';
import Sandbox from './pages/Sandbox/Sandbox';
import Miss from './pages/Miss/Miss';
import UserNotes from './pages/UserNotes/UserNotes';
import withTracker from './withTracker';
import ChatPage from './pages/Chat/ChatPage';
import ChatChannelPage from './pages/ChatChannel/ChatChannelPage';
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage';
import FlashcardsShowPage from './pages/Flashcards/FlashcardsShowPage';
import FlashcardsEditPage from './pages/Flashcards/FlashcardsEditPage';
import HomePage from './pages/Home/HomePage';
import Gondor from './containers/Auth/Gondor';

const BrowserRoutes = () => (
  <ConnectedRouter history={history}>
    <LastLocationProvider>
      <div>
        <FloatingChatContainer />
        <Switch>
          {/* Redirect to a default route based on context */}
          <Route exact path="/" component={withTracker(Home)} />

          {/* Signed in routes: Community routes */}
          <Route exact path="/create_post" component={withTracker(CreatePostPage)} />
          <Route exact path="/classes" component={withTracker(ClassesPage)} />
          <Route exact path="/feed" component={withTracker(FeedPage)} />
          <Route exact path="/bookmarks" component={withTracker(FeedPage)} />
          <Route exact path="/my_posts" component={withTracker(FeedPage)} />

          {/* Signed in routes: Study Tools routes */}
          <Route exact path="/notes" component={withTracker(UserNotes)} />
          <Route exact path="/workflow" component={withTracker(WorkflowPage)} />
          <Route exact path="/flashcards" component={withTracker(FlashcardsListPage)} />
          <Route
            exact
            path="/flashcards/:flashcardId"
            component={withTracker(FlashcardsShowPage)}
          />
          <Route
            exact
            path="/edit/flashcards/:flashcardId"
            component={withTracker(FlashcardsEditPage)}
          />
          <Route exact path="/create/notes" component={withTracker(CreateNotes)} />
          <Route exact path="/edit/notes/:noteId" component={withTracker(CreateNotes)} />

          <Route exact path="/post/:postId" component={withTracker(Post)} />
          <Route exact path="/edit/post/:postId" component={withTracker(CreatePostPage)} />
          <Route exact path="/notes/:noteId" component={withTracker(PostPage)} />
          <Route exact path="/sharelink/:sharelinkId" component={withTracker(ShareLinkPage)} />
          <Route
            exact
            path="/edit/sharelink/:sharelinkId"
            component={withTracker(CreateShareLink)}
          />
          <Route exact path="/question/:questionId" component={withTracker(Question)} />
          <Route exact path="/create/question" component={withTracker(CreateQuestion)} />
          <Route exact path="/edit/question/:questionId" component={withTracker(CreateQuestion)} />
          <Route exact path="/create/sharelink" component={withTracker(CreateShareLink)} />
          <Route
            exact
            path="/edit/sharelink/:sharelinkId"
            component={withTracker(CreateShareLink)}
          />
          <Route exact path="/study" component={withTracker(StudyPage)} />

          <Route exact path="/notifications" component={withTracker(NotificationsPage)} />
          <Route exact path="/share/:code" component={withTracker(SharePage)} />

          {/* Signed in routes: Home routes */}
          <Route exact path="/home" component={withTracker(HomePage)} />

          {/* Signed in routes: Achievements routes */}
          <Route exact path="/leaderboard" component={withTracker(LeaderBoard)} />

          {/* Signed in routes: Profile routes */}
          <Route exact path="/profile/:userId/:tab?" component={withTracker(ProfilePage)} />
          <Route exact path="/store" component={withTracker(StorePage)} />

          {/* Signed in routes: Chat routes */}
          <Route exact path="/chat/:hashId" component={withTracker(ChatChannelPage)} />
          <Route exact path="/chat" component={withTracker(ChatPage)} />
          <Route exact path="/video-call/:roomId" component={withTracker(VideoCallPage)} />
          <Route exact path="/video-call" component={withTracker(StartVideoPage)} />

          {/* Non-signed in routes */}
          <Route exact path="/new" component={withTracker(AuthRedirectPage)} />
          <Route exact path="/oauth" component={withTracker(OAuthPage)} />
          <Route exact path="/auth" component={withTracker(AuthRedirectPage)} />
          <Route exact path="/reset_password" component={withTracker(AuthRedirectPage)} />
          <Route exact path="/old" component={withTracker(AuthPage)} />
          <Route exact path="/login" component={withTracker(SignInPage)} />
          <Route exact path="/login/:schoolId" component={withTracker(AuthRedirectPage)} />
          <Route exact path="/signup" component={withTracker(SignUpPage)} />
          <Route exact path="/saml" component={withTracker(Saml)} />
          <Route exact path="/gondor" component={withTracker(Gondor)} />
          <Route exact path="/referral/:code" component={withTracker(Referral)} />
          <Route exact path="/forgot_password" component={withTracker(ForgotPasswordPage)} />
          <Route exact path="/terms-of-use" component={withTracker(TermsOfUsePage)} />
          <Route exact path="/canvas/:nonce" component={withTracker(CanvasPage)} />
          <Route exact path="/redirect" component={RedirectPage} />
          <Route exact path="/sandbox" component={Sandbox} />

          {/* Show a message and then in 1 sec redirect to "/" */}
          <Route component={Miss} />
        </Switch>
      </div>
    </LastLocationProvider>
  </ConnectedRouter>
);

export default BrowserRoutes;
