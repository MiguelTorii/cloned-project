import { APIAbout } from './APIAbout';
import { APIUserProfile } from './APIUserProfile';
import { APIUserStatistic } from './APIUserStatistics';

export type APIProfile = {
  user_profile: APIUserProfile;
  about: APIAbout[];
  user_statistics: APIUserStatistic[];
};
