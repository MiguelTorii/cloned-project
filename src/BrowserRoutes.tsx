import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { LastLocationProvider } from 'react-router-last-location';
import Home from './containers/Home/Home';
import Classes from './pages/Classes/ClassesPage';
import { history } from './configureStore';
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
import FloatingChatContainer from './containers/FloatingChat/FloatingChatContainer';
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
import HudFrame from './hud/frame/HudFrame';
import Miss from './pages/Miss/Miss';
import UserNotes from './pages/UserNotes/UserNotes';
import withTracker from './withTracker';
import ChatPage from './pages/Chat/ChatPage';
import ChatChannelPage from './pages/ChatChannel/ChatChannelPage';
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage';
import FlashcardsShowPage from './pages/Flashcards/FlashcardsShowPage';
import FlashcardsEditPage from './pages/Flashcards/FlashcardsEditPage';
import Flashcards from './pages/View/FlashcardsPage';
import HomePage from './pages/Home/Home';
import Gondor from './containers/Auth/Gondor';
import JoinCommunity from './pages/JoinCommunity/JoinCommunity';

const BrowserRoutes = () => (
  <ConnectedRouter history={history}>
    <LastLocationProvider>
      <div>
        <FloatingChatContainer />
        <Switch>
          <Route exact path="/" component={withTracker(Home)} />
          <Route exact path="/create_post" component={withTracker(CreatePost)} />
          <Route exact path="/notes" component={withTracker(UserNotes)} />
          <Route exact path="/classes" component={withTracker(Classes)} />
          <Route exact path="/feed" component={withTracker(Feed)} />
          <Route exact path="/workflow" component={withTracker(Workflow)} />
          <Route exact path="/chat/:hashId" component={withTracker(ChatChannelPage)} />
          <Route exact path="/chat" component={withTracker(ChatPage)} />
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
          <Route exact path="/flashcards/old/:flashcardId" component={withTracker(Flashcards)} />
          <Route
            exact
            path="/flashcards/:flashcardId"
            component={withTracker(FlashcardsShowPage)}
          />
          <Route exact path="/post/:postId" component={withTracker(Post)} />
          <Route exact path="/edit/post/:postId" component={withTracker(CreatePost)} />
          <Route exact path="/notes/:noteId" component={withTracker(PhotoNote)} />
          <Route exact path="/sharelink/:sharelinkId" component={withTracker(ShareLink)} />
          <Route
            exact
            path="/edit/sharelink/:sharelinkId"
            component={withTracker(CreateShareLink)}
          />
          <Route exact path="/question/:questionId" component={withTracker(Question)} />
          <Route exact path="/create/flashcards" component={withTracker(CreateFlashcards)} />
          <Route
            exact
            path="/edit/flashcards/:flashcardId"
            component={withTracker(FlashcardsEditPage)}
          />
          <Route exact path="/create/question" component={withTracker(CreateQuestion)} />
          <Route exact path="/edit/question/:questionId" component={withTracker(CreateQuestion)} />
          <Route exact path="/create/notes" component={withTracker(CreateNotes)} />
          <Route exact path="/edit/notes/:noteId" component={withTracker(CreateNotes)} />
          <Route exact path="/create/sharelink" component={withTracker(CreateShareLink)} />
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
          <Route exact path="/forgot_password" component={withTracker(ForgotPassword)} />
          <Route exact path="/terms-of-use" component={withTracker(TermsOfUse)} />
          <Route exact path="/canvas/:nonce" component={withTracker(Canvas)} />
          <Route exact path="/redirect" component={Redirect} />
          <Route exact path="/sandbox" component={Sandbox} />
          <Route exact path="/hud" component={withTracker(HudFrame)} />
          <Route component={Miss} />
        </Switch>
      </div>
    </LastLocationProvider>
  </ConnectedRouter>
);

export default BrowserRoutes;
