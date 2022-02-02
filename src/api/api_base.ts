import BaseAxios from 'axios';
import qs from 'query-string';
import { getToken } from './utils';
import { experienceActions } from '../hud/experienceBarState/hudExperienceActions';
import reduxStore from 'redux/store';
import { API_ROUTES } from 'constants/routes';

const axios = BaseAxios.create({
  timeout: 60000
});

axios.defaults.paramsSerializer = (params) =>
  qs.stringify(params, {
    skipNull: true
  });

// TODO Refactor: This function should not be called for every type of request
export const callApi = async (apiConfig) => {
  try {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${await getToken()}`
    };
    const response = await axios.request({
      headers,
      ...apiConfig
    });

    // TODO Refactor: there should be clear distinction between adding and setting experience point API calls
    if (response.data?.points) {
      if (apiConfig.url === `${API_ROUTES.USER}/points`) {
        reduxStore.dispatch({
          type: experienceActions.SET_EXPERIENCE_POINTS,
          payload: {
            experiencePoints: response.data?.points
          }
        });
      } else {
        reduxStore.dispatch({
          type: experienceActions.ADD_EXPERIENCE_POINTS,
          payload: {
            experiencePoints: response.data?.points
          }
        });
      }
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default callApi;
