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
