import type { APIAbout } from './APIAbout';
import type { APIUserProfile } from './APIUserProfile';
import type { APIUserStatistic } from './APIUserStatistics';

export type APIProfile = {
  user_profile: APIUserProfile;
  about: APIAbout[];
  user_statistics: APIUserStatistic[];
};
