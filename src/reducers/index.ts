import { combineReducers } from 'redux';
import { connectRouter, go, goBack, goForward, push, replace } from 'connected-react-router';
import type { BrowserHistory } from 'history';
import user from './user';
import chat from './chat';
import feed from './feed';
import auth from './auth';
import campaign from './campaign';
import leaderboard from './leaderboard';
import webNotifications from './web-notifications';
import notifications from './notifications';
import dialog from './dialog';
import onboarding from './onboarding';
import notes from './notes';
import api from './api';
import hudStory from '../hud/storyState/hudStoryReducers';
import hudChat from '../hud/chatState/hudChatReducers';
import hudNavigation from '../hud/navigationState/hudNavigationReducers';
import hudExperience from '../hud/experienceBarState/hudExperienceReducers';
import hudRightPanel from '../hud/rightPanelState/hudRightPanelReducers';

const routerActions = {
  push: typeof push,
  replace: typeof replace,
  go: typeof go,
  goBack: typeof goBack,
  goForward: typeof goForward
};
const reducers = {
  api,
  user,
  chat,
  feed,
  auth,
  campaign,
  router: routerActions,
  webNotifications,
  notifications,
  leaderboard,
  dialog,
  onboarding,
  notes,
  hudStory,
  hudChat,
  hudNavigation,
  hudExperience,
  hudRightPanel
};
export type Reducers = typeof reducers;
export default (history: BrowserHistory) =>
  combineReducers({ ...reducers, router: connectRouter(history) });
