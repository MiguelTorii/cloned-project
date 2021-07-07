/* eslint-disable import/prefer-default-export */
// @flow

import { leaderboardActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import {
  getLeaderboards,
  getGrandPrizeScores,
  getGrandPrizeInfo,
  getTuesdayPrizeScores
} from '../api/leaderboards'


const updateLeaderboardRequest = ({ leaderboards }): Action => ({
  type: leaderboardActions.UPDATE_LEADERBOARD_REQUEST,
  payload: {
    leaderboards
  }
});

const updateLeaderboards = () => async (dispatch: Dispatch) => {
  try {
    const res: Object = await getLeaderboards()
    const {
      first_tuesday_reward: {
        time_left: {
          time: timeTuesday,
          label: labelTuesday,
        },
        slots,
        current_month_points_display_name: currentMonthPointsDisplayName
      },
      grand_prize: {
        time_left: {
          time: timeGrand,
          label: labelGrand
        },
        logo_url: logo,
        grand_prize_text: text
      }
    } = res
    const camelSlots = slots.map(s => ({
      slot: s.slot,
      company: s.company,
      name: s.displa_name,
      logo: s.image_url,
      thumbnail: s.thumbnail_url
    }))

    const leaderboards = {
      tuesday: {
        timeLeft: {
          time: timeTuesday,
          label: labelTuesday,
        },
        slots: camelSlots,
        currentMonthPointsDisplayName,
      },
      grand: {
        timeLeft: {
          time: timeGrand,
          label: labelGrand
        },
        logo,
        text
      }
    }

    dispatch(
      updateLeaderboardRequest({ leaderboards })
    );
  } catch(e) {
    console.log(e)
  }
};

const updateTuesdayLeaderboardRequest = ({ leaderboards }): Action => ({
  type: leaderboardActions.UPDATE_LEADERBOARD_TUESDAY_REQUEST,
  payload: {
    leaderboards
  }
});

const camelCaseLeaderboard = (res: Object) => {
  const {
    board_name: boardName,
    score_type_label: scoreLabel,
    students
  }=res

  const studentsCamel = students.map(s => ({
    position: s.position,
    score: s.score,
    firstName: s.first_name,
    lastName: s.last_name,
    userId: s.user_id,
    profileImg: s.profile_image_url

  }))

  return {
    boardName,
    scoreLabel,
    students: studentsCamel
  }
}

const updateTuesdayLeaderboard = (sectionId, limit) => async (dispatch: Dispatch) => {
  try{
    const res: Object = await getTuesdayPrizeScores(sectionId, limit)
    const leaderboards = camelCaseLeaderboard(res)

    dispatch(
      updateTuesdayLeaderboardRequest({ leaderboards })
    );
  } catch(e) {
    console.log(e)
  }
};

const updateGrandLeaderboardRequest = ({ leaderboards }): Action => ({
  type: leaderboardActions.UPDATE_LEADERBOARD_GRAND_REQUEST,
  payload: {
    leaderboards
  }
});

const updateGrandLeaderboards = (sectionId, limit) => async (dispatch: Dispatch) => {
  try {
    const res = await getGrandPrizeScores(sectionId, limit)
    const leaderboards = camelCaseLeaderboard(res)
    dispatch(
      updateGrandLeaderboardRequest({ leaderboards })
    );
  } catch(e) {
    console.log(e)
  }
};


const updateLeaderboardGrandInfoRequest = ({ grandInfo }): Action => ({
  type: leaderboardActions.UPDATE_LEADERBOARD_GRAND_INFO_RESQUEST,
  payload: {
    grandInfo
  }
});

const updateLeaderboardGrandInfo = () => async (dispatch: Dispatch) => {
  try {
    const res: Object = await getGrandPrizeInfo()
    const grandInfo = {
      logoUrl: res.logo_url,
      description: res.description,
      text: res.grand_prize_text,
      amount: res.amount,
      numberOfWinners: res.number_of_winners,
      eligibility: res.eligibility,
      eligibilitySubtitle: res.eligibility_subtitle,
      eligibilityDialog: res.eligibility_dialog,
      eligibilitySubtitleDialog: res.eligibility_subtitle_dialog,
    }
    dispatch(
      updateLeaderboardGrandInfoRequest({ grandInfo })
    );
  } catch(e) {
    console.log(e)
  }
};

export default {
  updateLeaderboards,
  updateLeaderboardGrandInfo,
  updateTuesdayLeaderboard,
  updateGrandLeaderboards
}
