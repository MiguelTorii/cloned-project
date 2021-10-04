import axios from "axios";
import { API_ROUTES } from "../constants/routes";
import { callApi } from "./api_base";
import { getToken } from "./utils";
export const getCommunities = async () => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.GET_COMMUNITY}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    return null;
  }
};
export const getCommunityChannels = async ({
  communityId
}: {
  communityId: number;
}) => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.GET_COMMUNITY_V1}/${communityId}/channels`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    return null;
  }
};
export const getCommunityTemplates = async () => callApi({
  url: `${API_ROUTES.GET_COMMUNITY_V1}/template/1`,
  method: 'GET'
});
export const batchMessage = async ({
  message,
  chatIds
}) => {
  callApi({
    url: API_ROUTES.BATCH_MESSAGE,
    data: {
      message,
      chat_ids: chatIds
    },
    method: 'post'
  });
};