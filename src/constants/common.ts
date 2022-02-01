import { commandHotkeyText, isMac } from '../utils/helpers';

const collegeGrades = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

const addSuffix = (grade) => {
  switch (grade) {
    case 1:
      return 'st';

    case 2:
      return 'nd';

    case 3:
      return 'rd';

    default:
      return 'th';
  }
};

export const gradeName = (segment, grade = 1) => {
  if (segment === 'College') {
    return collegeGrades[grade - 1];
  }

  return `${grade}${addSuffix(grade)} Grade`;
};
export const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];
export const workflowCategories = [
  {
    name: 'Overdue',
    categoryId: 1,
    bgcolor: '#C45961',
    buttonColor: '#6F343C'
  },
  {
    name: 'Upcoming',
    categoryId: 2,
    bgcolor: '#EBAF64',
    buttonColor: '#5F472B'
  },
  {
    name: 'In Progress',
    categoryId: 3,
    bgcolor: '#4781B3',
    buttonColor: '#2D5170'
  },
  {
    name: 'Done',
    categoryId: 4,
    bgcolor: '#74C182',
    buttonColor: '#2F5139'
  }
];
export const remiderTime = {
  60: {
    label: '1 minute before',
    type: 'minutes',
    value: 1 * 60
  },
  300: {
    label: '5 minutes before',
    type: 'minutes',
    value: 5 * 60
  },
  600: {
    label: '10 minutes before',
    type: 'minutes',
    value: 10 * 60
  },
  900: {
    label: '15 minutes before',
    type: 'minutes',
    value: 15 * 60
  },
  1800: {
    label: '30 minutes before',
    type: 'minutes',
    value: 30 * 60
  },
  3600: {
    label: '1 hour before',
    type: 'hour',
    value: 60 * 60
  },
  7200: {
    label: '2 hours before',
    type: 'hour',
    value: 120 * 60
  },
  86400: {
    label: '1 day before',
    type: 'day',
    value: 24 * 60 * 60
  },
  172800: {
    label: '2 days before',
    type: 'day',
    value: 24 * 120 * 60
  }
};
export const PERMISSIONS = {
  EXPERT_MODE_ACCESS: 'expert_mode_access',
  MAIN_APPLICATION_ACCESS: 'main_application_access',
  EDIT_GROUP_PHOTO_ACCESS: 'edit_group_photo_access',
  RENAME_GROUP_CHAT_ACCESS: 'rename_group_chat_access',
  ONE_TOUCH_SEND_CHAT: 'one_touch_send_chat',
  ONE_TOUCH_SEND_POSTS: 'one_touch_send_posts',
  DASHBOARD_ACCESS: 'dashboard_access',
  DASHBOARD_TUTOR_TAB_ACCESS: 'dashboard_tutor_tab_access',
  DASHBOARD_CAN_SEE_REAL_NAMES: 'dashboard_can_see_real_names',
  DASHBOARD_ONBOARDING_CHECKLIST: 'dashboard_onboarding_checklist',
  EARN_POINTS: 'earn_points',
  REWARD_STORE_ACCESS: 'reward_store_access',
  PROFILE_BADGE_APPEARS: 'profile_badge_appears',
  VIDEO_ACCESS: 'video_access',
  ALL_COURSE_ACCESS: 'all_course_access',
  REMOVE_USER_GROUP_CHAT_ACCESS: 'remove_user_group_chat_access'
};
export const TIMEOUT = {
  FLASHCARD_REVEIW: 1 * 60 * 1000,
  POST_ITEM: 3 * 60 * 1000
};
export const fileContent = {
  '3gp': 'Video File',
  aac: 'File Extension',
  aif: 'Audio File',
  asf: 'Media Audio File',
  avi: 'Video File',
  cvs: 'CSV File',
  doc: 'Word Document',
  docx: 'Word Document',
  flv: 'Adobe Flash',
  html: 'HTML File',
  m4v: 'Video File',
  mov: 'Video File',
  mp3: 'Audio File',
  mp4: 'Audio File',
  odp: 'OpenOffice.org',
  odt: 'Word Processing Applications',
  ogg: 'Audio File',
  ops: 'Microsoft Office Suite',
  pdf: 'PDF Document',
  ppt: 'PowerPoint Presentation',
  pptx: 'PowerPoint Presentation',
  rtf: 'Rich Text Format',
  txt: 'Text File',
  wav: 'Wav Audio File',
  webm: 'Webm File',
  wmv: 'Wmv File',
  xls: 'Excel File',
  xlsx: 'Excel File',
  zip: 'Zip File',
  pages: 'Pages File',
  'binary-default': 'Binary File',
  'code-default': 'Code',
  'other-default': 'File'
};
export const POST_WRITER = {
  ME: 'me',
  CLASSMATES: 'classmates',
  ANYONE: 'anyone'
};
export const DEFAULT_DEBOUNCE_DURATION_IN_MS = 500;
export const FEED_NAVIGATION_TABS = {
  CLASS_FEED: 'class_feed',
  MY_POSTS: 'my_posts',
  BOOKMARKS: 'bookmarks'
};
export const QUILL_TOOLBAR_SHORT_KEYS = {
  BOLD: `Bold (${commandHotkeyText('B')})`,
  ITALIC: `Italic (${commandHotkeyText('I')})`,
  UNDERLINE: `Underline (${commandHotkeyText('U')})`,
  EMOJI: `Emoji (${isMac() ? '⌘J' : 'CTRL + ALT + J'})`,
  IMAGE: `Image (${commandHotkeyText('P')})`
};
export const PROFILE_PAGE_SOURCE = {
  CHAT: 'Chat',
  POST: 'Post',
  COMMENT: 'Comment',
  URL: 'Url',
  CLASSMATES_MODAL: 'Classmates Modal',
  LEADERBOARD: 'Leaderboard',
  FLASHCARD: 'Flashcard',
  STUDY_CIRCLE: 'Study Circle'
};
export const DEFAULT_EMOJI_REACTIONS = [':rocket:', ':raised_hands:', ':heart:', ':tada:'];
export const MessageItemType = {
  DATE: 'date',
  OWN: 'own',
  MESSAGE: 'message',
  END: 'end'
};
export const ERROR_MODAL_TITLE = {
  404: 'Not Found',
  401: 'Not Authorized',
  500: 'Something went wrong!'
};
export const FETCH_POINTS_INTERVAL = 15 * 60 * 1000;
export const COMMUNITY_SCROLL_CONTAINER_ID = 'community-scroll-container';
export const RECOMMENDATION_FETCH_UNIT = 5;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const ANONYMOUS_USER_ID = -1;
export const CIRCLEIN101_SECTION_ID = 1;
export const CIRCLEIN101_TC =
  'By posting to CircleIn101, you acknowledge and agree to make your profile public to the CircleIn Student Network. This will allow any Student on CircleIn to view your profile,which includes your real name, and the school you attend, and allow them to communicate with you.';
