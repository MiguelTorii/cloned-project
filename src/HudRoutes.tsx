import React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { LastLocationProvider } from 'react-router-last-location';

import { CHAT_PATH_EXP, URL } from 'constants/navigation';

import { useNotifier, useMessageNotifier } from 'hooks';
import { useHudRouteUpdater } from 'hud/frame/useHudRoutes';
import useOnboarding from 'hud/storyState/useOnboarding';
import { history } from 'redux/store';

import Gondor from './containers/Auth/Gondor';
import Saml from './containers/Auth/Saml';
import Home from './containers/Home/Home';
import Referral from './containers/Referrals/Referral';
import HudFrame from './hud/frame/HudFrame';
import AuthPage from './pages/Auth/AuthPage';
import AuthRedirectPage from './pages/AuthRedirect/AuthRedirectPage';
import CanvasChat from './pages/CanvasChat';
import CanvasPage from './pages/CanvasPage/CanvasPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import JoinWithReferralCode from './pages/JoinWithReferralCode/JoinWithReferralCode';
import LoginPopupClose from './pages/LoginPopupClose';
import Miss from './pages/Miss/Miss';
import OAuthPage from './pages/OAuthRedirect/OAuthPage';
import RedirectPage from './pages/Redirect/RedirectPage';
import Sandbox from './pages/Sandbox/Sandbox';
import SharePage from './pages/Share/SharePage';
import SignInPage from './pages/SignIn/SignInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import StartVideoPage from './pages/StartVideo/StartVideoPage';
import TermsOfUsePage from './pages/TermsOfUse/TermsOfUsePage';
import VideoCallPage from './pages/VideoCall/VideoCallPage';
import { CREATE_POST_PATHNAME } from './routeConstants';
import withTracker from './withTracker';

const HudRoutes = () => (
  <ConnectedRouter history={history}>
    <LastLocationProvider>
      <div>
        <HudRouteWrappers>
          <Switch>
            {/* Redirect to a default route based on context */}
            <Route exact path="/" component={withTracker(Home)} />

            {/* Signed in routes: Community routes */}
            {/**
             * TODO
             * HudFrame should be a simple container above the routes
             * As it is, HudFrame unmounts and remounts on every page change
            causing every hook and logic to re-run
             */}
            <Route exact path={CREATE_POST_PATHNAME} component={withTracker(HudFrame)} />
            <Route exact path="/classes" component={withTracker(HudFrame)} />
            <Route exact path="/feed" component={withTracker(HudFrame)} />
            <Route exact path="/bookmarks" component={withTracker(HudFrame)} />
            <Route exact path="/my_posts" component={withTracker(HudFrame)} />
            <Route exact path="/post/:postId" component={withTracker(HudFrame)} />
            <Route exact path="/edit/post/:postId" component={withTracker(HudFrame)} />
            <Route exact path="/sharelink/:sharelinkId" component={withTracker(HudFrame)} />
            <Route exact path="/edit/sharelink/:sharelinkId" component={withTracker(HudFrame)} />
            <Route exact path="/question/:questionId" component={withTracker(HudFrame)} />
            <Route exact path="/create/question" component={withTracker(HudFrame)} />
            <Route exact path="/edit/question/:questionId" component={withTracker(HudFrame)} />
            <Route exact path="/create/sharelink" component={withTracker(HudFrame)} />
            <Route exact path="/edit/sharelink/:sharelinkId" component={withTracker(HudFrame)} />
            <Route exact path="/share/:code" component={withTracker(SharePage)} />

            {/* Signed in routes: Study Tools routes */}
            <Route exact path="/notes" component={withTracker(HudFrame)} />
            <Route exact path="/create/notes" component={withTracker(HudFrame)} />
            <Route exact path="/edit/notes/:noteId" component={withTracker(HudFrame)} />
            <Route exact path="/notes/:noteId" component={withTracker(HudFrame)} />
            <Route exact path="/workflow" component={withTracker(HudFrame)} />
            <Route exact path="/flashcards" component={withTracker(HudFrame)} />
            <Route exact path="/flashcards/:flashcardId" component={withTracker(HudFrame)} />
            <Route exact path="/edit/flashcards/:flashcardId" component={withTracker(HudFrame)} />
            <Route exact path="/study" component={withTracker(HudFrame)} />

            {/* Signed in routes: Home routes */}
            <Route exact path="/home" component={withTracker(HudFrame)} />

            {/* Signed in routes: Achievements routes */}
            <Route exact path="/leaderboard" component={withTracker(HudFrame)} />

            {/* Signed in routes: Profile routes */}
            <Route exact path="/profile" component={withTracker(HudFrame)} />
            <Route exact path="/profile/:userId/:tab?" component={withTracker(HudFrame)} />
            <Route exact path="/pointsHistory" component={withTracker(HudFrame)} />
            <Route exact path="/store" component={withTracker(HudFrame)} />

            {/* Signed in routes: More routes */}
            <Route exact path="/feedback" component={withTracker(HudFrame)} />
            <Route exact path="/getTheMobileApp" component={withTracker(HudFrame)} />

            {/* Signed in routes: Chat routes */}
            <Route exact path="/chat/s/:hashId" component={withTracker(HudFrame)} />
            <Route exact path={CHAT_PATH_EXP} component={withTracker(HudFrame)} />

            <Route exact path="/video-call/:roomId" component={withTracker(VideoCallPage)} />
            <Route exact path="/video-call" component={withTracker(StartVideoPage)} />

            {/* Signed in routes: Small Chat for Canvas */}
            <Route exact path="/canvas-chat" component={withTracker(CanvasChat)} />
            <Route exact path={URL.LOGIN_POPUP_CLOSE} component={withTracker(LoginPopupClose)} />

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
            <Route exact path="/invite/:code/login/:schoolId" component={JoinWithReferralCode} />

            {/* Show a message and then in 1 sec redirect to "/" */}
            <Route component={Miss} />
          </Switch>
        </HudRouteWrappers>
      </div>
    </LastLocationProvider>
  </ConnectedRouter>
);

const HudRouteWrappers = ({ children }) => {
  useNotifier();
  useMessageNotifier();
  useOnboarding();
  useHudRouteUpdater();
  return children;
};

export default HudRoutes;
