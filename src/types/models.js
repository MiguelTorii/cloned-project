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
  updateProfile: Array<UpdateProfile>
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

export type UserClass = {
  className: string,
  classId: number,
  section: Array<number>,
  subjectId: number
};

export type UserClasses = Array<UserClass>;

export type SelectType = {
  label: string,
  value: string
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
  postInfo: {
    date: string,
    feedId: number,
    postId: number,
    questionsCount: number,
    thanksCount: number,
    userId: string,
    viewCount: number
  },
  rank: number,
  reports: number,
  school: string,
  subject: string,
  thanked: boolean,
  title: string,
  typeId: number,
  userId: string,
  userProfileUrl: string
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

export type PresignedURL = {
  url: string,
  readUrl: string,
  mediaId: string
};

export type LMSSchool = {
  clientId: string,
  school: string,
  uri: string
};

export type LMSSchools = Array<LMSSchool>;
