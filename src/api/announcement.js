/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getAnnouncement = async (campaignId: number): Promise<Object> => {
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
        subtitle,
        title,
        variation_id: variationId,
      } = result.data;

      return {
        hourlyReward,
        imageUrl,
        popupTitle,
        subtitle,
        title,
        variationId,
      };
    };

    return null;
  } catch (err) {
    return null;
  }
};