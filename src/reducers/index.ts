import { connectRouter, go, goBack, goForward, push, replace } from 'connected-react-router';
import { combineReducers } from 'redux';

import hudChat from 'hud/chatState/hudChatReducers';
import hudExperience from 'hud/experienceBarState/hudExperienceReducers';
import hudNavigation from 'hud/navigationState/hudNavigationReducers';
import hudRightPanel from 'hud/rightPanelState/hudRightPanelReducers';
import hudStory from 'hud/storyState/hudStoryReducers';

import api from './api';
import auth from './auth';
import chat from './chat';
import dialog from './dialog';
import feed from './feed';
import leaderboard from './leaderboard';
import notes from './notes';
import notifications from './notifications';
import onboarding from './onboarding';
import user from './user';
import webNotifications from './web-notifications';

import type { History } from 'history';

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
export default (history: History) =>
  combineReducers({ ...reducers, router: connectRouter(history) });
