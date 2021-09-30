import BaseAxios from "axios";
import qs from "query-string";
import { getToken } from "./utils";
const axios = BaseAxios.create({
  timeout: 60000
});

axios.defaults.paramsSerializer = params => qs.stringify(params, {
  skipNull: true
});

export const callApi = async apiConfig => {
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
    throw error;
  }
};
export default callApi;
