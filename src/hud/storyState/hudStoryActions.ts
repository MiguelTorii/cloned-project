import type { Action } from 'types/action';

export const hudStoryActions = {
  SET_CURRENT_STATEMENT: 'SET_CURRENT_STATEMENT',
  CURRENT_STORY_COMPLETED: 'CURRENT_STORY_COMPLETED',
  OPEN_ONBOARDING_INTRO_POPUP: 'OPEN_ONBOARDING_INTRO_POPUP',
  CLOSE_ONBOARDING_POPUP: 'CLOSE_ONBOARDING_POPUP',
  OPEN_ONBOARDING_COMPLETE_POPUP: 'OPEN_ONBOARDING_COMPLETE_POPUP'
};

export const setCurrentStatement = (currentStatement: string): Action => ({
  type: hudStoryActions.SET_CURRENT_STATEMENT,
  payload: {
    currentStatement
  }
});

export const currentStoryCompleted = (): Action => ({
  type: hudStoryActions.CURRENT_STORY_COMPLETED,
  payload: {}
});

export const openOnboardingPopup = (): Action => ({
  type: hudStoryActions.OPEN_ONBOARDING_INTRO_POPUP,
  payload: {}
});

export const closeOnboardingPopup = (onboardingFlowTriggered?: boolean): Action => ({
  type: hudStoryActions.CLOSE_ONBOARDING_POPUP,
  payload: {
    onboardingFlowTriggered
  }
});

export const openOnboardingCompletedPopup = (): Action => ({
  type: hudStoryActions.OPEN_ONBOARDING_COMPLETE_POPUP,
  payload: {}
});
