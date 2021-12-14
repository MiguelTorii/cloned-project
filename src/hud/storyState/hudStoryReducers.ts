import type { Action } from '../../types/action';
import { hudStoryActions } from './hudStoryActions';
import { defaultState, HudStoryState } from './hudStoryState';

export default (state: HudStoryState = defaultState, action: Action): HudStoryState => {
  switch (action.type) {
    case hudStoryActions.SET_CURRENT_STATEMENT:
      return {
        ...state,
        currentStatement: action.payload.currentStatement
      };

    case hudStoryActions.OPEN_ONBOARDING_POPUP:
      return {
        ...state,
        isShowingOnboardingPopup: true
      };

    case hudStoryActions.CLOSE_ONBOARDING_POPUP:
      return {
        ...state,
        isShowingOnboardingPopup: false,
        onboardingFlowTriggered: action.payload.onboardingFlowTriggered
      };

    default:
      return state;
  }
};
