// @flow

import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getLeaderboards = async () => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.LEADERBOARD_V2, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;

    return data
  } catch (err) {
    return [];
  }
};

export const getGrandPrizeInfo = async () => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.LEADERBOARD_GRAND_PRIZE_INFO, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;

    return data
  } catch (err) {
    return [];
  }
};

export const getGrandPrizeScores = async (sectionId, limit) => {
  try {
    const token = await getToken();
    const sectionQuery = sectionId ? `&section_id=${sectionId}` : ''
    const limitQuery = limit ? `&limit=${limit}` : ''

    const result = await axios.get(`${API_ROUTES.LEADERBOARD_V2_BOARD_TWO}${sectionQuery}${limitQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;

    return data
  } catch (err) {
    return [];
  }
};

export const getTuesdayPrizeScores = async (sectionId, limit) => {
  try {
    const token = await getToken();
    const sectionQuery = sectionId ? `&section_id=${sectionId}` : ''
    const limitQuery = limit ? `&limit=${limit}` : ''

    const result = await axios.get(`${API_ROUTES.LEADERBOARD_V2_BOARD_ONE}${sectionQuery}${limitQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;

    return data
  } catch (err) {
    return [];
  }
};
