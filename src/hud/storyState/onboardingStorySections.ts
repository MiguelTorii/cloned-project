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

const goToWorkflowNudge: StorySection = {
  triggerEventName: hudEventNames.START_ONBOARDING,
  highlightRootAreaId: STUDY_TOOLS_MAIN_AREA,
  highlightLeafAreaId: CALENDAR_AREA,
  statements: [
    "Study with your classmates to earn points and win rewards.  Let's go to your Workflow study tool."
  ],
  isPersistent: true
};

const workflowIntro: StorySection = {
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: CALENDAR_AREA,
  statements: ['Track your study progress using the Workflow board and earn points.'],
  completionEvent: hudEventNames.SHOW_NAVIGATION_TO_FLASHCARDS,
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
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: FLASHCARDS_AREA,
  statements: [
    'You can create flashcards to help you study.  You can even use your own images to make the concepts more memorable.'
  ],
  completionEvent: hudEventNames.SHOW_NAVIGATION_TO_LEADERBOARD,
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
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: LEADERBOARD_AREA,
  statements: ['Earn 8 MVPs in one term to be eligible for scholarships.'],
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
  statements: [
    'Select your favorite rewards stores below to receive e-gift cards to your favorite places when you earn rewards on CircleIn.'
  ],
  canSkip: true,
  isPersistent: true
};

const rewardsStorePartialSelections: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_PARTIALLY_FILLED,
  statements: ['Great! You have picked your first reward.  What other rewards would you like?'],
  canSkip: true,
  isPersistent: true
};

const rewardsStoreFullSelections: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_FILLED,
  statements: ['Great job!  You earned 100 points for completing CircleIn Onboarding.'],
  completionEvent: hudEventNames.ONBOARDING_COMPLETED,
  isPersistent: true
};

export const onboardingStorySections: StorySection[] = [
  goToWorkflowNudge,
  workflowIntro,
  goToFlashcardsNudge,
  flashcardsIntro,
  goToLeaderboardNudge,
  leaderboardIntro,
  goToRewardsStoreNudge,
  rewardsStoreNoSelections,
  rewardsStorePartialSelections,
  rewardsStoreFullSelections
];
