import BaseAxios from 'axios';
import qs from 'query-string';
import { getToken } from './utils';
import { experienceActions } from '../hud/experienceBarState/hudExperienceActions';
import reduxStore from 'redux/store';

const axios = BaseAxios.create({
  timeout: 60000
});

axios.defaults.paramsSerializer = (params) =>
  qs.stringify(params, {
    skipNull: true
  });

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

    if (response.data?.points) {
      reduxStore.dispatch({
        type: experienceActions.SET_EXPERIENCE_POINTS,
        payload: {
          experiencePoints: response.data?.points
        }
      });
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default callApi;
