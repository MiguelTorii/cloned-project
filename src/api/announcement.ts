/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';
export const getAnnouncement = async (campaignId: number): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.ANNOUNCEMENT}/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (result && result.data) {
      const {
        hourly_reward: hourlyReward,
        image_url: imageUrl,
        popup_title: popupTitle,
        popup_content: popupContent,
        popup_title_image: popupTitleImage,
        subtitle,
        title,
        variation_id: variationId
      } = result.data;
      return {
        hourlyReward,
        imageUrl,
        popupTitle,
        popupTitleImage,
        popupContent,
        subtitle,
        title,
        variationId
      };
    }

    return null;
  } catch (err) {
    return null;
  }
};
export const getAnnouncementCampaign = async (): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.GET_ANNOUNCEMENT_CAMPAIGN}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return result.data;
  } catch (err) {
    return null;
  }
};
