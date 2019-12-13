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

export const getGrandPrizeScores = async () => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.LEADERBOARD_V2_BOARD_TWO, {
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

export const getTuesdayPrizeScores = async () => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.LEADERBOARD_V2_BOARD_ONE, {
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
