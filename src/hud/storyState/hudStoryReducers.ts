import type { Action } from '../../types/action';
import { hudStoryActions, setCurrentStatement } from './hudStoryActions';
import { defaultState, HudStoryState } from './hudStoryState';

export default (state: HudStoryState = defaultState, action: Action): HudStoryState => {
  switch (action.type) {
    case hudStoryActions.SET_CURRENT_STATEMENT:
      return {
        ...state,
        currentStatement: action.payload.currentStatement,
        isStoryInProgress: !!action.payload.currentStatement
      };

    case hudStoryActions.CURRENT_STORY_COMPLETED:
      return {
        ...state,
        isStoryInProgress: false
      };

    case hudStoryActions.OPEN_ONBOARDING_INTRO_POPUP:
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

    case hudStoryActions.OPEN_ONBOARDING_COMPLETE_POPUP:
      return {
        ...state,
        isShowingOnboardingPopup: true,
        isCurrentSessionOnboardingComplete: true
      };

    default:
      return state;
  }
};
