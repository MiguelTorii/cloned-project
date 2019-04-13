// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { UserProfile } from '../types/models';
import { getToken } from './utils';

export const getUserProfile = async ({
  userId
}: {
  userId: string
}): Promise<UserProfile> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.USER}/${userId}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data } = result;
  // eslint-disable-next-line camelcase
  const { user_profile = {}, about = [], user_statistics = [] } = data;

  const userProfile = {
    userId: String((user_profile.user_id: string) || ''),
    firstName: String((user_profile.first_name: string) || ''),
    lastName: String((user_profile.last_name: string) || ''),
    grade: Number((user_profile.grade: number) || 0),
    hours: Number((user_profile.hours: number) || 0),
    inStudyCircle: Boolean((user_profile.in_study_circle: boolean) || false),
    joined: String((user_profile.joined: string) || ''),
    points: Number((user_profile.points: number) || 0),
    rank: Number((user_profile.rank: number) || 0),
    school: String((user_profile.school: string) || ''),
    state: String((user_profile.state: string) || ''),
    userProfileUrl: String((user_profile.user_profile_url: string) || '')
  };

  const userStatistics = user_statistics.map(stats => ({
    seasonId: Number((stats.season_id: number) || 0),
    bestAnswers: Number((stats.best_answers: number) || 0),
    communityServiceHours: Number((stats.community_service_hours: number) || 0),
    currentSeason: Boolean((stats.current_season: boolean) || false),
    name: String((stats.name: string) || ''),
    points: Number((stats.points: number) || 0),
    rankReached: Number((stats.rank_reached: number) || 0),
    reach: Number((stats.reach: number) || 0),
    thanks: Number((stats.thanks: number) || 0)
  }));

  return { userProfile, about, userStatistics };
};

export const ads = () => 'asd';
