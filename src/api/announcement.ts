/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';
import { Announcement } from '../types/models';

export const getAnnouncement = async (campaignId: number): Promise<Announcement | null> => {
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
      variationId,
      // TODO can these come from the API call?
      id: 0,
      endDate: ''
    };
  }

  return null;
};
export const getAnnouncementCampaign = async (): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.GET_ANNOUNCEMENT_CAMPAIGN}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return result.data;
};
