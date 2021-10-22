export type UpdateProfile = {
  field: string;
};
export type User = {
  userId: string;
  nonce: string;
  email: string;
  firstName: string;
  lastName: string;
  school: string;
  schoolId: number;
  segment: string;
  twilioToken: string;
  canvasUser: boolean;
  grade: number;
  jwtToken: string;
  refreshToken: string;
  profileImage: string;
  rank: number;
  referralCode: string;
  updateProfile: Array<UpdateProfile>;
  lmsTypeId: number;
  lmsUser: boolean;
  permission?: string;
};
export type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  grade: number;
  hours: number;
  inStudyCircle: boolean;
  joined: string;
  points: number;
  rank: number;
  roleId: number;
  role: string;
  school: string;
  state: string;
  userProfileUrl: string;
  isOnline: boolean;
};
export type About = {
  id: number;
  section: string;
  answer: string;
};
export type UserStatistic = {
  seasonId: number;
  bestAnswers: number;
  communityServiceHours: number;
  currentSeason: boolean;
  name: string;
  points: number;
  rankReached: number;
  reach: number;
  thanks: number;
};
export type Profile = {
  userProfile: UserProfile;
  about: Array<About>;
  userStatistics: Array<UserStatistic>;
};
export type ClassSection = {
  firstName: string;
  lastName: string;
  section: string;
  sectionId: number;
  subject: string;
  sectionDisplayName: string;
  instructorDisplayName: string;
};
export type UserClass = {
  className: string;
  classId: number;
  permissions: PermissionMetadata;
  section: Array<ClassSection>;
  subjectId: number;
  courseDisplayName: string;
  class: string;
  bgColor: string;
  didInviteClassmates: boolean;
  didHideFeedEmptyState: boolean;
  isCurrent: boolean;
};
export type Permissions = {
  canAddClasses: boolean;
};
export type PermissionMetadata = {
  canLeave: boolean;
  canCreate: boolean;
};
export type UserClasses = {
  classes: Array<UserClass>;
  permissions: Permissions;
  emptyState: Record<string, any>;
  pastClasses: Array<UserClass>;
};
export type AvailableClasses = Record<string, UserClasses>;
export type SelectType = {
  label: string;
  value: string;
};
export type PostInfo = {
  date: string;
  feedId: number;
  postId: number;
  questionsCount: number;
  thanksCount: number;
  userId: string;
  viewCount: number;
};
export type Post = {
  body: string;
  summary: string;
  bookmarked: boolean;
  classId: number;
  classroomName: string;
  courseDisplayName: string;
  created: string;
  feedId: number;
  grade: number;
  inStudyCircle: boolean;
  name: string;
  postId: number;
  postInfo: PostInfo;
  rank: number;
  reports: number;
  roleId: number;
  role: string;
  school: string;
  subject: string;
  thanked: boolean;
  title: string;
  typeId: number;
  userId: string;
  userProfileUrl: string;
  readOnly: boolean;
  bestAnswer: boolean;
  sectionId: number;
  content: string;
};
export type RecommendedPost = {
  id: number;
  postId: number;
  typeId: number;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  created: string;
  thanksCount: number;
  viewCount: number;
};
export type Tag = {
  description: string;
  id: number;
  name: string;
};
export type PostMetaData = {
  recommendedPosts: Array<RecommendedPost>;
  tags: Array<Tag>;
};
export type Note = {
  fullNoteUrl: string;
  note: string;
  noteUrl: string;
};
export type PhotoNote = Post & {
  notes: Array<Note>;
  title: string;
  classId: number;
  tags?: Array<SelectType>;
  body: string;
};
export type Question = Post & {};
export type Flashcard = {
  id?: number;
  question: string;
  answer: string;
  questionImageUrl?: string;
  answerImageUrl?: string;
  answerImage?: string;
  questionImage?: string;
};
export type Flashcards = Post & {
  deck: Array<Flashcard>;
};
export type ShareLink = Post & {
  uri: string;
};
export type CommentUser = {
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  hours: number;
  joined: string;
  rank: number;
  scholarshipPoints: number;
  schoolId: number;
  state: string;
};
export type Comment = {
  accepted: boolean;
  comment: string;
  created: string;
  id: number;
  parentCommentId: number;
  reportsCount: number;
  rootCommentId: number;
  thanked: boolean;
  thanksCount: number;
  user: CommentUser;
};
export type Comments = {
  parentCommentsCount: number;
  comments: Array<Comment>;
};
export type PostResponse = {
  communityServiceHours: number;
  linkId: number;
  linksLeft: number;
  points: number;
  questionId: number;
  questionsLeft: number;
  isFirstNote: boolean;
  notesLeft: number;
  photoNoteId: number;
  decksLeft: number;
  fcId: number;
  user: {
    firstName: string;
    hours: number;
    joined: string;
    lastName: string;
    profileImageUrl: string;
    rank: number;
    scholarshipPoints: number;
    schoolId: number;
    state: string;
    userId: string;
  };
  classes: string[];
  postId: number;
  postsLeft: number;
};
export type PresignedURL = {
  url: string;
  readUrl: string;
  mediaId: string;
};
export type LMSSchool = {
  id: number;
  clientId: string;
  school: string;
  uri: string;
  authUri: string;
  lmsTypeId: number;
};
export type School = {
  id: number;
  clientId: string;
  school: string;
  uri: string;
  authUri: string;
  lmsTypeId: number;
  emailRestriction: boolean;
  emailDomain: Array<string>;
  scope: string;
  launchType: string;
  studentLive?: number;
  connection?: string;
  redirect_message: string;
};
export type ReferralData = {
  code: string;
  name: string;
  schoolId: number;
  school: string;
};
export type Announcement = {
  id: number;
  endDate: string;
  hourlyReward: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  popupTitleImage: string;
  popupTitle: string;
  popupContent: string;
  variationId: number;
};
export type ChatMessageListItem = {
  sid: string;
  body: string;
  imageKey: string;
  isVideoNotification: boolean;
  firstName: string;
  lastName: string;
  createdAt: string;
};
export type ChatMessage = {
  type: string;
  id: string;
  name: string;
  author: string;
  body: string;
  imageKey: string;
  date: string;
  messageList: Array<Record<string, any>>;
  files?: string[];
};
export type ChatMessages = Array<ChatMessage>;
export type ChatUser = {
  firstName: string;
  hours: number;
  joined: string;
  lastName: string;
  profileImageUrl: string;
  rank: number;
  scholarshipPoints: number;
  schoolId: number;
  state: string;
  userId: string;
  registered?: boolean;
  roleId?: number;
  role?: string;
  isOnline?: boolean;
};
export type ChatChannel = {
  sid: string;
};
export type ChatChannels = Array<ChatChannel>;
export type BlockedUser = {
  userId: string;
  profileImageUrl: string;
  name: string;
};
export type BlockedUsers = Array<BlockedUser>;
export type FeedItem = {
  userId: string;
  typeId: number;
  numberOfNotes: number;
  feedId: number;
  postId: number;
  roleId: number;
  role: string;
  courseDisplayName: string;
  bookmarked: boolean;
  deck: Array<Flashcard>;
  noteUrl: string;
  name: string;
  created: string;
  userProfileUrl: string;
  rank: number;
  subject: string;
  classroomName: string;
  classId: number;
  title: string;
  body: string;
  readOnly: boolean;
  postInfo: PostInfo;
  tags: Array<Tag>;
  uri: string;
  notes: Array<Note>;
  bestAnswer: string;
  thanked: boolean;
  isOnline: boolean;
};
export type ToDo = {
  due: number;
  dueDate: number;
  id: number;
  label: number;
  status: number;
  title: string;
};
export type StudyCircleItem = {
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  userId: string;
  typeId: number;
};
export type StudyCircle = Array<StudyCircleItem>;
export type UserStats = {
  communityServiceHours: number;
  reach: number;
  scholarshipPoints: number;
  weeklyNotesGoal: number;
  weeklyNotesGoalProgress: number;
};
export type CalendarEvent = {
  id: number;
  title: string;
  start: Record<string, any>;
  end: Record<string, any>;
  label: number;
  status: number;
  due: string;
};
export type CalendarEvents = Array<CalendarEvent>;
export type AvailableReward = {
  bgColor: string;
  displayName: string;
  imageUrl: string;
  isSelected: boolean;
  rewardId: number;
  rewardValue: number;
};
export type Slot = {
  bgColor: string;
  displayName: string;
  imageUrl: string;
  rewardId: number;
  rewardValue: number;
  slot: number;
};
export type Rewards = {
  availableRewards: Array<AvailableReward>;
  slots: Array<Slot>;
};
export type Notification = {
  actorFirstName: string;
  actorId: string;
  actorLastName: string;
  createdOn: string;
  entityId: number;
  entityType: number;
  feedPostTitle: string;
  fileName: string;
  fullNoteUrl: string;
  id: number;
  noteUrl: string;
  notificationText: string;
  postId: number;
  postTypeId: number;
  deckSize: number;
  profileImageUrl: string;
  state: number;
};
export type CustomNotification = {
  title: string;
  body: string;
  details: string;
  created: string;
};
export type Notifications = {
  notifications: Array<Notification>;
  unreadCount: number;
};
export type CardStyle = {
  substring: string;
  textColor: string;
  weight: string;
};
export type HomeCardSlot = {
  bgColor: string;
  company: string;
  displayName: string;
  imageUrl: string;
  rewardId: number;
  rewardValue: number;
  slot: number;
  thumbnailUrl: string;
};
export type HomeCardOrder = {
  cardId: number;
  hidden: boolean;
};
export type HomeCard = {
  title: string;
  subtitle: {
    text: string;
    style: Array<CardStyle>;
  };
  slots: Array<HomeCardSlot>;
  order: Array<HomeCardOrder>;
};
export type Quest = {
  id: number;
  iconUrl: string;
  pointsAvailable: number;
  status: string;
  task: string;
  action: {
    name: string;
    value: string;
    attributes: {
      feedFilter: {
        classId: number;
      };
    };
  };
};
export type QuestsCard = {
  activeQuests: Array<Quest>;
  availablePointsText: {
    text: string;
    style: Array<CardStyle>;
  };
  progressText: {
    text: string;
    style: Array<CardStyle>;
  };
};
export type CurrentSeasonCard = {
  seasonId: number;
  bestAnswers: string;
  grandPrizeText: string;
  logoUrl: string;
  points: string;
  reach: string;
  serviceHours: string;
  thanks: string;
};
export type InviteCard = {
  imageUrl: string;
  referralCode: string;
  subtitle: {
    text: string;
    style: Array<CardStyle>;
  };
  title: string;
};
export type CreateChat = {
  chatId: string;
  groupName: string;
  isNewChat: boolean;
  thumbnailUrl: string;
  type: string;
};
export type EventData = {
  category: string;
  durationMs?: number;
  objectId: string;
  position?: number;
  rating?: number;
  recommendationType?: 'notification';
  source?: 'feed_banner' | 'side_menu';
  type: string;
  variationId?: number;
  sectionId?: number;
  user_id?: any;
};
export type Class = {
  courseDisplayName: string;
  extraInformation: string;
  sectionId: number;
};
export type OnboardingListItem = {
  completed: boolean;
  id: number;
  text: string;
};
export type OnboardingList = {
  checklist: Array<OnboardingListItem>;
  visible: boolean;
};
export type StudyRoomOnboardingStepData = {
  imageUrl: string;
  title: string;
  text: string;
  actionText: string;
  title1: string; // This might actually be a typo rather than another property
  backText: any;
};
export type PointsHistoryItem = {
  user_id: number;
  points_type_id: number;
  points_title: string;
  points_icon_url: string;
  points: number;
  date: string;
};
export type SyncSuccessData = {
  display: boolean;
  helpLink: string;
  largeLogo: string;
  smallLogo: string;
  resourcesBody: string;
  resourcesTitle: string;
  viewedOnboarding: boolean;
  viewedTooltips: Array<number>;
};
export type Member = {
  firstname: string;
  image: string;
  isOnline: boolean;
  lastname: string;
  registered: boolean;
  role: string;
  roleId: number;
  userId: number;
};
export type ChatMessageItem = {
  sid: string;
  index: number;
  imageKey: string;
  createdAt: string;
  body: string;
  files: any[];
  isVideoNotification: boolean;
  firstName: string;
  lastName: string;
};
