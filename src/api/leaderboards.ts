import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import { callApi } from './api_base';
import { getToken } from './utils';

import type { LeaderboardResponse } from 'types/models';

export const getLeaderboards = async (): Promise<LeaderboardResponse> =>
  callApi({
    url: API_ROUTES.LEADERBOARD_V2
  });
export const getGrandPrizeInfo = async () => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.LEADERBOARD_GRAND_PRIZE_INFO, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;
    return data;
  } catch (err) {
    return [];
  }
};
export const getGrandPrizeScores = async (sectionId, index) => {
  try {
    const sectionQuery = sectionId ? `&section_id=${sectionId}` : '';
    const indexQuery = index ? `&index=${index}&limit=100` : '';
    const result = await callApi({
      url: `${API_ROUTES.LEADERBOARD_V2_BOARD_TWO}${sectionQuery}${indexQuery}`,
      method: 'GET'
    });
    return result;
  } catch (err) {
    return [];
  }
};
export const getMoreGrandStudents = async (sectionId, index) => {
  try {
    const sectionQuery = sectionId ? `&section_id=${sectionId}` : '';
    const indexQuery = index ? `&index=${index}&limit=100` : '';
    const result = await callApi({
      url: `${API_ROUTES.LEADERBOARD_V2_BOARD_TWO}${sectionQuery}${indexQuery}`,
      method: 'GET'
    });
    const { students = [] } = result;
    const studentsCamel = students.map((s) => ({
      position: s.position,
      score: s.score,
      firstName: s.first_name,
      lastName: s.last_name,
      userId: s.user_id,
      profileImg: s.profile_image_url
    }));
    return studentsCamel;
  } catch (err) {
    return [];
  }
};
export const getTuesdayPrizeScores = async (sectionId, index) => {
  try {
    const sectionQuery = sectionId ? `&section_id=${sectionId}` : '';
    const indexQuery = index ? `&index=${index}&limit=100` : '';
    const result = await callApi({
      url: `${API_ROUTES.LEADERBOARD_V2_BOARD_ONE}${sectionQuery}${indexQuery}`,
      method: 'GET'
    });
    return result;
  } catch (err) {
    return [];
  }
};
export const getMoreTuesdayStudents = async (sectionId, index) => {
  try {
    const sectionQuery = sectionId ? `&section_id=${sectionId}` : '';
    const indexQuery = index ? `&index=${index}&limit=100` : '';
    const result = await callApi({
      url: `${API_ROUTES.LEADERBOARD_V2_BOARD_ONE}${sectionQuery}${indexQuery}`,
      method: 'GET'
    });
    const { students = [] } = result;
    const studentsCamel = students.map((s) => ({
      position: s.position,
      score: s.score,
      firstName: s.first_name,
      lastName: s.last_name,
      userId: s.user_id,
      profileImg: s.profile_image_url
    }));
    return studentsCamel;
  } catch (err) {
    return [];
  }
};
