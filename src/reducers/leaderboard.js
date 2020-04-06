/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import {
  leaderboardActions,
  rootActions
} from '../constants/action-types';
import type { Action } from '../types/action';

export type StudentType = {
  position: number,
  score: string,
  firstName: string,
  lastName: string,
  userId: number,
  profileImage: string
};

export type PrizeSlots = {
  slot: number,
  company: string,
  name: string,
  logo: string,
  thumbnail: string
};

export type LeaderBoardStudents = {
  position: number,
  score: string,
  firstName: string,
  lastName: string,
  userId: number,
  profileImg: string
};

export type LeaderBoardState = {
  data: {
    general: {
      tuesday: {
        timeLeft: {
          time: string,
          label: string
        },
        slots: Array<PrizeSlots>,
        currentMonthPointsDisplayName: string
      },
      grand: {
        timeLeft: {
          time: string,
          label: string
        },
        logo: string,
        text: string
      }
    },
    tuesday: {
      boardName: string,
      scoreLabel: string,
      students: Array<LeaderBoardStudents>
    },
    grand: {
      boardName: string,
      scoreLabel: string,
      students: Array<LeaderBoardStudents>
    },
    grandDialog: {
      logoUrl: string,
      description: string,
      text: string
    }
  }
};

const defaultState = {
  data: {
    general: {
      tuesday: {
        timeLeft: {
          time: '',
          label: ''
        },
        slots: [],
        currentMonthPointsDisplayName: '',
      },
      grand: {
        timeLeft: {
          time: '',
          label: ''
        },
        logo: '',
        text: '',
      }
    },
    grand: {
      boardName: '',
      scoreLabel: '',
      students: [],
    },
    tuesday: {
      boardName: '',
      scoreLabel: '',
      students: [],
    },
    grandDialog: {
      logoUrl: '',
      description: '',
      text: ''
    }
  }
};

export default (
  state: LeaderBoardState = defaultState,
  action: Action
): LeaderBoardState => {
  switch (action.type) {
  case leaderboardActions.UPDATE_LEADERBOARD_REQUEST:
    if(action && action.payload && action.payload.leaderboards)
      return update(state, {
        data: {
          general: { $set: action.payload.leaderboards },
        }
      });
    return state;
  case leaderboardActions.UPDATE_LEADERBOARD_GRAND_INFO_RESQUEST:
    if(action && action.payload && action.payload.grandInfo)
      return update(state, {
        data: {
          grandDialog: { $set: action.payload.grandInfo },
        }
      });
    return state;
  case leaderboardActions.UPDATE_LEADERBOARD_GRAND_REQUEST:
    if(action && action.payload && action.payload.leaderboards)
      return update(state, {
        data: {
          grand: { $set: action.payload.leaderboards },
        }
      });
    return state;
  case leaderboardActions.UPDATE_LEADERBOARD_TUESDAY_REQUEST:
    if(action && action.payload && action.payload.leaderboards)
      return update(state, {
        data: {
          tuesday: { $set: action.payload.leaderboards },
        }
      });
    return state;
  case rootActions.CLEAR_STATE:
    return defaultState;
  default:
    return state;
  }
};
