export type HudStoryState = {
  currentStatement: string;
  isStoryInProgress: boolean;
  isShowingOnboardingPopup: boolean;
  onboardingFlowTriggered: boolean;
  isCurrentSessionOnboardingComplete: boolean;
};

export const defaultState: HudStoryState = {
  currentStatement: '',
  isStoryInProgress: false,
  isShowingOnboardingPopup: false,
  onboardingFlowTriggered: false,
  isCurrentSessionOnboardingComplete: false
};
