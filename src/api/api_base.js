import BaseAxios from 'axios';
import { getToken } from './utils';

const axios = BaseAxios.create({ timeout: 60000 });

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
    return response.data;

  } catch (error) {
    // Deal with errors here
    return {}
  }
};

export default callApi;
