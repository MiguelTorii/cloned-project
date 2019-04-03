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
