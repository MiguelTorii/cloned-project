import { StorySection } from './StorySection';
import {
  ACHIEVEMENTS_MAIN_AREA,
  REWARDS_STORE_AREA,
  FLASHCARDS_AREA,
  LEADERBOARD_AREA,
  PROFILE_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  CALENDAR_AREA
} from '../navigationState/hudNavigation';
import { hudEventNames } from '../events/hudEventNames';

const introToOnboarding: StorySection = {
  triggerEventName: hudEventNames.START_ONBOARDING,
  statements: ['Study with your classmates to earn points and win rewards.'],
  completionEvent: hudEventNames.SHOW_NAVIGATION_TO_WORKFLOW,
  isPersistent: true
};

const goToWorkflowNudge: StorySection = {
  triggerEventName: hudEventNames.SHOW_NAVIGATION_TO_WORKFLOW,
  highlightRootAreaId: STUDY_TOOLS_MAIN_AREA,
  highlightLeafAreaId: CALENDAR_AREA,
  statements: ["Let's go to your Workflow study tool."],
  isPersistent: true
};

const workflowIntro: StorySection = {
  leafAreaId: CALENDAR_AREA,
  statements: ['Track your study progress using the Workflow board and earn points.'],
  completionEvent: hudEventNames.SHOW_NAVIGATION_TO_LEADERBOARD,
  isPersistent: true
};

const goToFlashcardsNudge: StorySection = {
  triggerEventName: hudEventNames.SHOW_NAVIGATION_TO_FLASHCARDS,
  highlightRootAreaId: STUDY_TOOLS_MAIN_AREA,
  highlightLeafAreaId: FLASHCARDS_AREA,
  statements: ["Let's go to Flashcards."],
  isPersistent: true
};
const flashcardsIntro: StorySection = {
  leafAreaId: FLASHCARDS_AREA,
  statements: [
    'You can create flashcards to help you study.  You can even use your own images to make the concepts more memorable.'
  ],
  isPersistent: true
};

const goToLeaderboardNudge: StorySection = {
  triggerEventName: hudEventNames.SHOW_NAVIGATION_TO_LEADERBOARD,
  highlightRootAreaId: ACHIEVEMENTS_MAIN_AREA,
  highlightLeafAreaId: LEADERBOARD_AREA,
  statements: [
    "Earn points towards rewards with every study action!  Let's go to the Leaderboard."
  ],
  isPersistent: true
};

const leaderboardIntro: StorySection = {
  leafAreaId: LEADERBOARD_AREA,
  statements: [
    'Your points for your Monthly Rewards and Scholarships opportunities are tracked here.',
    'Once you earn 8 MVPs in one term, you are eligible for scholarships.'
  ],
  completionEvent: hudEventNames.SHOW_NAVIGATION_TO_REWARDS_STORE,
  isPersistent: true
};

const goToRewardsStoreNudge: StorySection = {
  triggerEventName: hudEventNames.SHOW_NAVIGATION_TO_REWARDS_STORE,
  highlightRootAreaId: PROFILE_MAIN_AREA,
  highlightLeafAreaId: REWARDS_STORE_AREA,
  statements: ["Let's go to the Rewards Store so you can select the rewards you want to win."],
  isPersistent: true
};

const rewardsStoreNoSelections: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_EMPTY,
  leafAreaId: REWARDS_STORE_AREA,
  statements: [
    'Select your favorite rewards stores below to receive e-gift cards to your favorite places when you earn rewards on CircleIn.'
  ],
  isPersistent: true
};

const rewardsStorePartialSelections: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_PARTIALLY_FILLED,
  leafAreaId: REWARDS_STORE_AREA,
  statements: ['Great! You have picked your first reward.  What other rewards would you like?'],
  isPersistent: true
};

const rewardsStoreFullSelections: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_FILLED,
  leafAreaId: REWARDS_STORE_AREA,
  statements: ['Great job setting up your rewards!'],
  completionEvent: hudEventNames.ONBOARDING_COMPLETED,
  isPersistent: true
};

const onboardingCompleted: StorySection = {
  triggerEventName: hudEventNames.ONBOARDING_COMPLETED,
  statements: ['Congratulations!  You earned 100 points for completing CircleIn Onboarding.'],
  isPersistent: true
};

export const onboardingStorySections: StorySection[] = [
  introToOnboarding,
  goToWorkflowNudge,
  workflowIntro,
  goToFlashcardsNudge,
  flashcardsIntro,
  goToLeaderboardNudge,
  leaderboardIntro,
  goToRewardsStoreNudge,
  rewardsStoreNoSelections,
  rewardsStorePartialSelections,
  rewardsStoreFullSelections,
  onboardingCompleted
];
