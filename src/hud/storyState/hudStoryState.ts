export type HudStoryState = {
  currentStatement: string;
  isShowingOnboardingPopup: boolean;
  onboardingFlowTriggered: boolean;
};

export const defaultState: HudStoryState = {
  currentStatement: '',
  isShowingOnboardingPopup: false,
  onboardingFlowTriggered: false
};
