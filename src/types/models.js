// @flow

export type UpdateProfile = {
  field: string
};

export type User = {
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  school: string,
  schoolId: number,
  segment: string,
  twilioToken: string,
  canvasUser: boolean,
  grade: number,
  jwtToken: string,
  refreshToken: string,
  profileImage: string,
  rank: number,
  referralCode: string,
  updateProfile: Array<UpdateProfile>,
  lmsTypeId: number,
  lmsUser: boolean
};

export type UserProfile = {
  userId: string,
  firstName: string,
  lastName: string,
  grade: number,
  hours: number,
  inStudyCircle: boolean,
  joined: string,
  points: number,
  rank: number,
  school: string,
  state: string,
  userProfileUrl: string
};

export type About = {
  id: number,
  section: string,
  answer: string
};

export type UserStatistic = {
  seasonId: number,
  bestAnswers: number,
  communityServiceHours: number,
  currentSeason: boolean,
  name: string,
  points: number,
  rankReached: number,
  reach: number,
  thanks: number
};

export type Profile = {
  userProfile: UserProfile,
  about: Array<About>,
  userStatistics: Array<UserStatistic>
};

export type ClassSection = {
  firstName: string,
  lastName: string,
  section: string,
  sectionId: number,
  subject: string
};

export type UserClass = {
  className: string,
  classId: number,
  permissions: {
    canLeave: boolean,
    canCreate: boolean
  },
  section: Array<ClassSection>,
  subjectId: number
};

export type Permissions = {
  canAddClasses: boolean
};

export type UserClasses = {
  classes: Array<UserClass>,
  permissions: Permissions
};

export type AvailableClasses = {
  [key: string]: UserClasses
};

export type SelectType = {
  label: string,
  value: string
};

export type PostInfo = {
  date: string,
  feedId: number,
  postId: number,
  questionsCount: number,
  thanksCount: number,
  userId: string,
  viewCount: number
};

export type Post = {
  body: string,
  bookmarked: boolean,
  classId: number,
  classroomName: string,
  created: string,
  feedId: number,
  grade: number,
  inStudyCircle: boolean,
  name: string,
  postId: number,
  postInfo: PostInfo,
  rank: number,
  reports: number,
  school: string,
  subject: string,
  thanked: boolean,
  title: string,
  typeId: number,
  userId: string,
  userProfileUrl: string,
  readOnly: boolean,
  bestAnswer: boolean
};

export type RecommendedPost = {
  id: number,
  postId: number,
  typeId: number,
  userId: string,
  firstName: string,
  lastName: string,
  title: string,
  description: string,
  created: string,
  thanksCount: number,
  viewCount: number
};

export type Tag = {
  description: string,
  id: number,
  name: string
};

export type PostMetaData = {
  recommendedPosts: Array<RecommendedPost>,
  tags: Array<Tag>
};

export type Note = {
  fullNoteUrl: string,
  note: string,
  noteUrl: string
};

export type PhotoNote = Post & {
  notes: Array<Note>
};

export type Question = Post & {};

export type Flashcard = {
  question: string,
  answer: string
};

export type Flashcards = Post & {
  deck: Array<Flashcard>
};

export type ShareLink = Post & {
  uri: string
};

export type CommentUser = {
  userId: string,
  firstName: string,
  lastName: string,
  profileImageUrl: string,
  hours: number,
  joined: string,
  rank: number,
  scholarshipPoints: number,
  schoolId: number,
  state: string
};

export type Comment = {
  accepted: boolean,
  comment: string,
  created: string,
  id: number,
  parentCommentId: number,
  reportsCount: number,
  rootCommentId: number,
  thanked: boolean,
  thanksCount: number,
  user: CommentUser
};

export type Comments = {
  parentCommentsCount: number,
  comments: Array<Comment>
};

export type PostResponse = {
  communityServiceHours: number,
  linkId: number,
  linksLeft: number,
  points: number,
  questionId: number,
  questionsLeft: number,
  isFirstNote: boolean,
  notesLeft: number,
  photoNoteId: number,
  decksLeft: number,
  fcId: number,
  user: {
    firstName: string,
    hours: number,
    joined: string,
    lastName: string,
    profileImageUrl: string,
    rank: number,
    scholarshipPoints: number,
    schoolId: number,
    state: string,
    userId: string
  }
};

export type PresignedURL = {
  url: string,
  readUrl: string,
  mediaId: string
};

export type LMSSchool = {
  id: number,
  clientId: string,
  school: string,
  uri: string,
  authUri: string,
  lmsTypeId: number
};

export type LMSSchools = Array<LMSSchool>;

export type ChatMessageListItem = {
  sid: string,
  body: string,
  imageKey: string,
  isVideoNotification: boolean,
  firstName: string,
  lastName: string,
  createdAt: string
};

export type ChatMessage = {
  type: string,
  id: string,
  name: string,
  author: string,
  body: string,
  imageKey: string,
  date: string,
  messageList: Array<Object>
};

export type ChatMessages = Array<ChatMessage>;

export type ChatChannel = {
  sid: string
};

export type ChatChannels = Array<ChatChannel>;

export type BlockedUser = {
  userId: string,
  profileImageUrl: string,
  name: string
};

export type BlockedUsers = Array<BlockedUser>;

export type FeedItem = {
  userId: string,
  typeId: number,
  feedId: number,
  postId: number,
  courseDisplayName: string,
  bookmarked: boolean,
  deck: Array<Flashcard>,
  noteUrl: string,
  name: string,
  created: string,
  userProfileUrl: string,
  rank: number,
  subject: string,
  classroomName: string,
  title: string,
  body: string,
  readOnly: boolean,
  postInfo: PostInfo,
  tags: Array<Tag>
};

export type Feed = Array<FeedItem>;

export type LeaderboardItem = {
  userId: string,
  points: number,
  username: string
};

export type Leaderboard = Array<LeaderboardItem>;

export type ToDo = {
  due: number,
  dueDate: number,
  id: number,
  label: number,
  status: number,
  title: string
};

export type ToDos = Array<ToDo>;

export type StudyCircleItem = {
  firstName: string,
  lastName: string,
  profileImageUrl: string,
  userId: string,
  typeId: number
};

export type StudyCircle = Array<StudyCircleItem>;

export type UserStats = {
  communityServiceHours: number,
  reach: number,
  scholarshipPoints: number,
  weeklyNotesGoal: number,
  weeklyNotesGoalProgress: number
};

export type CalendarEvent = {
  id: number,
  title: string,
  start: Object,
  end: Object,
  label: number,
  status: number,
  due: string
};

export type CalendarEvents = Array<CalendarEvent>;

export type DailyRewards = {
  givenPoints: number,
  pointsLeft: number,
  stage: number
};

export type AvailableReward = {
  bgColor: string,
  displayName: string,
  imageUrl: string,
  isSelected: boolean,
  rewardId: number,
  rewardValue: number
};

export type Slot = {
  bgColor: string,
  displayName: string,
  imageUrl: string,
  rewardId: number,
  rewardValue: number,
  slot: number
};

export type Rewards = {
  availableRewards: Array<AvailableReward>,
  slots: Array<Slot>
};

export type Notification = {
  actorFirstName: string,
  actorId: string,
  actorLastName: string,
  createdOn: string,
  entityId: number,
  entityType: number,
  feedPostTitle: string,
  fileName: string,
  fullNoteUrl: string,
  id: number,
  noteUrl: string,
  notificationText: string,
  postId: number,
  postTypeId: number,
  deckSize: number,
  profileImageUrl: string,
  state: number
};

export type Notifications = {
  notifications: Array<Notification>,
  unreadCount: number
};

export type HomeCardStyle = {
  substring: string,
  textColor: string,
  weight: string
};

export type HomeCardQuest = {
  item: string,
  status: string,
  action: {
    name: string,
    value: string,
    attributes: {
      feedFilter: {
        classId: number
      }
    }
  }
};

export type HomeCard = {
  cardId: string,
  title: string,
  data: {
    message: {
      text: string,
      style: Array<HomeCardStyle>
    },
    progressMessage: {
      text: string,
      style: Array<HomeCardStyle>
    },
    quests: Array<HomeCardQuest>,
    imageUrl: string
  }
};

export type HomeCards = Array<HomeCard>;

export type ChatPoints = {
  currentWeekCount: number,
  logId: number,
  points: number
};

export type CreateChat = {
  chatId: string,
  groupName: string,
  isNewChat: boolean,
  thumbnailUrl: string,
  type: string
};
