import { hudEventNames } from '../events/hudEventNames';
import {
  ACHIEVEMENTS_MAIN_AREA,
  REWARDS_STORE_AREA,
  LEADERBOARD_AREA,
  STUDY_TOOLS_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  FEEDS_AREA,
  CHAT_AREA,
  CHAT_MAIN_AREA
} from '../navigationState/hudNavigation';

import type { StorySection } from './StorySection';

export const STUDY_TOOL_HOVER_EXPERIENCE_DELAY_IN_MS = 10000;
export const CHAT_EXPERIENCE_DELAY_IN_MS = 15000;

export const introToOnboarding: StorySection = {
  statements: ['Hi, I’m Kobe and I’ll give you a quick tour on how to use CircleIn.']
};

const initialIntroAndNudgeToLeaderboard: StorySection = {
  triggerEventName: hudEventNames.START_ONBOARDING,
  highlightRootAreaId: ACHIEVEMENTS_MAIN_AREA,
  highlightLeafAreaId: LEADERBOARD_AREA,
  statements: [
    'Here at CircleIn, you can earn points and win rewards! Click on the <strong>Leaderboard</strong> above to learn more.'
  ]
};

const leaderboardIntroAndNudgeToRewardsStore: StorySection = {
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: LEADERBOARD_AREA,
  highlightLeafAreaId: REWARDS_STORE_AREA,
  statements: [
    'On the <strong>Leaderboard</strong>, you can see how close you and other students are to qualifying for the <strong>Monthly Rewards</strong> and <strong>Scholarships</strong>. Click the button above to set your preferences for your monthly rewards.'
  ]
};

const rewardsStoreNoOrPartialSelections: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_EMPTY_OR_PARTIALLY_FILLED,
  statements: [
    'Select your top three reward preferences for your <strong>Monthly Rewards</strong> to go to the next step (Chipotle is my personal favorite 😋).'
  ],
  canSkip: true
};

const rewardsStoreFullSelectionsAndNudgeToStoryTools: StorySection = {
  triggerEventName: hudEventNames.REWARDS_SELECTIONS_FILLED,
  highlightRootAreaId: STUDY_TOOLS_MAIN_AREA,
  statements: [
    'Curious how to earn points, you may ask?️ Your study tool icons above allow you to earn points on CircleIn in so many ways while keeping all of your class content in one place! Hover over each tool to learn more.'
  ],
  sequenceDelay: STUDY_TOOL_HOVER_EXPERIENCE_DELAY_IN_MS,
  completionEvent: hudEventNames.SHOW_NAVIGATION_TO_CLASS_FEED
};

const nudgeToClassFeed: StorySection = {
  triggerEventName: hudEventNames.SHOW_NAVIGATION_TO_CLASS_FEED,
  highlightRootAreaId: COMMUNITIES_MAIN_AREA,
  highlightLeafAreaId: FEEDS_AREA,
  statements: [
    'Click on the <strong>Classes</strong> tab to navigate to your <strong>Class Feed</strong> to learn more.'
  ]
};

const classFeedIntroAndNudgeToChat: StorySection = {
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: FEEDS_AREA,
  highlightRootAreaId: CHAT_MAIN_AREA,
  highlightLeafAreaId: CHAT_AREA,
  statements: [
    'Your <strong>Class Feed</strong> is the place to be to share and view study resources! Let’s go to <strong>Chat</strong> next! You can chat and connect with your peers anywhere, any time.'
  ]
};

const chatIntro: StorySection = {
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: CHAT_AREA,
  statements: [
    'Introduce yourself to meet your classmates! Share something about yourself like your favorite 🎵 music or 🌯 food.'
  ],
  sequenceDelay: CHAT_EXPERIENCE_DELAY_IN_MS,
  completionEvent: hudEventNames.ONBOARDING_COMPLETED
};

export const onboardingCompleted: StorySection = {
  statements: [
    'You made it! The tour is officially over. If you want to learn more, visit https://support.circleinapp.com.'
  ]
};

export const onboardingStorySections: StorySection[] = [
  initialIntroAndNudgeToLeaderboard,
  leaderboardIntroAndNudgeToRewardsStore,
  rewardsStoreNoOrPartialSelections,
  rewardsStoreFullSelectionsAndNudgeToStoryTools,
  nudgeToClassFeed,
  classFeedIntroAndNudgeToChat,
  chatIntro
];
