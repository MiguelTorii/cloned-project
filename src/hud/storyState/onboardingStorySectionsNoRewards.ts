import {
  ACHIEVEMENTS_MAIN_AREA,
  CHAT_AREA,
  CHAT_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  FEEDS_AREA,
  LEADERBOARD_AREA,
  STUDY_TOOLS_MAIN_AREA
} from '../navigationState/hudNavigation';
import { StorySection } from './StorySection';
import { hudEventNames } from '../events/hudEventNames';
import {
  CHAT_EXPERIENCE_DELAY_IN_MS,
  STUDY_TOOL_HOVER_EXPERIENCE_DELAY_IN_MS
} from './onboardingStorySections';

const LEADERBOARD_INTRO_DELAY_IN_MS = 5000;

const initialIntroAndNudgeToLeaderboard: StorySection = {
  triggerEventName: hudEventNames.START_ONBOARDING,
  highlightRootAreaId: ACHIEVEMENTS_MAIN_AREA,
  highlightLeafAreaId: LEADERBOARD_AREA,
  statements: [
    'Here at CircleIn, you can earn points and win rewards! Click on the <strong>Leaderboard</strong> above to learn more.'
  ]
};

const leaderboardIntro: StorySection = {
  triggerEventName: hudEventNames.NAVIGATED_TO_AREA,
  leafAreaId: LEADERBOARD_AREA,
  statements: [
    'On the <strong>Leaderboard</strong>, you can see how close you and other students are to qualifying for rewards.'
  ],
  sequenceDelay: LEADERBOARD_INTRO_DELAY_IN_MS,
  completionEvent: hudEventNames.INTRO_TO_STUDY_TOOLS
};

const introToStudyTools: StorySection = {
  triggerEventName: hudEventNames.INTRO_TO_STUDY_TOOLS,
  highlightRootAreaId: STUDY_TOOLS_MAIN_AREA,
  statements: [
    'Your study tool icons above allow you to earn points while keeping all of your class content in one place! Hover over each tool to learn more.'
  ],
  sequenceDelay: STUDY_TOOL_HOVER_EXPERIENCE_DELAY_IN_MS,
  completionEvent: hudEventNames.SHOW_INTRO_TO_CLASS_FEED
};

const nudgeToClassFeed: StorySection = {
  triggerEventName: hudEventNames.SHOW_INTRO_TO_CLASS_FEED,
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
    'Your <strong>Class Feed</strong> is the place to be to share and view study resources!  Let’s go to <strong>Chat</strong> next! You can chat and connect with your peers anywhere, any time...'
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

export const onboardingStorySectionsNoRewards: StorySection[] = [
  initialIntroAndNudgeToLeaderboard,
  leaderboardIntro,
  introToStudyTools,
  nudgeToClassFeed,
  classFeedIntroAndNudgeToChat,
  chatIntro
];
