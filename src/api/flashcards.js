import { callApi } from 'api/api_base';
import { API_URL_V1_1 } from 'constants/routes';

/***
 *
 * @param flashcardId
 * @response
 * {
 *   match_game_id: number
 * }
 */
export const apiInitializeMatchGame = async (flashcardId) => {
  // return {
  //   match_game_id: 1
  // };
  return callApi({
    url: `${API_URL_V1_1}/deck/${flashcardId}/match`,
    method: 'POST'
  });
};

/**
 *
 * @param flashcardId: number
 * @param matchGameId: number
 * @param matches: array of card matches
 * @response
 * {
 *   logged: boolean
 * }
 */
export const apiSaveMatchGameRecords = async (
  flashcardId,
  matchGameId,
  matches
) => {
  // return { success: true }
  return callApi({
    url: `${API_URL_V1_1}/deck/${flashcardId}/match/${matchGameId}`,
    method: 'POST',
    data: {
      matches
    }
  });
};

/***
 * @param flashcardId: number
 * @param matchGameId: number
 * @param startTime: UTC timestamp in milliseconds
 * @param endTime: UTC timestamp in milliseconds
 * @param duration: number of seconds
 * @response
 * {
 *   ended: boolean
 * }
 */
export const apiEndMatchGame = async (
  flashcardId,
  matchGameId,
  startTime,
  endTime,
  duration
) => {
  return callApi({
    url: `${API_URL_V1_1}/deck/${flashcardId}/match/${matchGameId}/end`,
    method: 'POST',
    data: {
      start_time: startTime,
      end_time: endTime,
      duration
    }
  });
};

/***
 *
 * @param flashcardId: number
 * @response
 * {
 *   stats: {
 *     high_score: number
 *   }
 * }
 */
export const apiGetMatchStats = async (
  flashcardId
) => {
  return {
    stats: {
      high_score: null
    }
  };
  // return callApi({
  //   url: `${API_URL_V1_1}/deck/${flashcardId}/match/stats`,
  //   method: 'GET'
  // });
};
