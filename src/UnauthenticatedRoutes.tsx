import { LastLocationProvider } from 'react-router-last-location';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Route, Switch } from 'react-router';
import { history } from 'redux/store';
import FloatingChatContainer from './containers/FloatingChat/FloatingChatContainer';
import withTracker from './withTracker';
import Home from './containers/Home/Home';
import AuthRedirectPage from './pages/AuthRedirect/AuthRedirectPage';
import OAuthPage from './pages/OAuthRedirect/OAuthPage';
import AuthPage from './pages/Auth/AuthPage';
import SignInPage from './pages/SignIn/SignInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import Saml from './containers/Auth/Saml';
import Gondor from './containers/Auth/Gondor';
import Referral from './containers/Referrals/Referral';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import TermsOfUsePage from './pages/TermsOfUse/TermsOfUsePage';
import CanvasPage from './pages/Canvas/CanvasPage';
import RedirectPage from './pages/Redirect/RedirectPage';
import Sandbox from './pages/Sandbox/Sandbox';

const UnauthenticatedRoutes = () => (
  <ConnectedRouter history={history}>
    <LastLocationProvider>
      <FloatingChatContainer />
      <Switch>
        {/* Redirect to a default route based on context */}
        <Route exact path="/" component={withTracker(Home)} />

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
      </Switch>
    </LastLocationProvider>
  </ConnectedRouter>
);

export default UnauthenticatedRoutes;
