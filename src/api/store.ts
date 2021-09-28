/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Rewards } from '../types/models';
import { getToken } from './utils';

export const getRewards = async ({ userId }: { userId: string }): Promise<Rewards> => {
  try {
    const token = await getToken();

    const result = await axios.get(`${API_ROUTES.STORE}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;

    const availableRewards = (data.available_rewards || []).map((item) => ({
      bgColor: String((item.bg_color: string) || ''),
      displayName: String((item.display_name: string) || ''),
      imageUrl: String((item.image_url: string) || ''),
      isSelected: Boolean((item.is_selected: boolean) || false),
      rewardId: Number((item.reward_id: number) || 0),
      rewardValue: Number((item.reward_value: number) || 0)
    }));
    const slots = (data.slots || []).map((item) => ({
      bgColor: String((item.bg_color: string) || ''),
      displayName: String((item.display_name: string) || ''),
      imageUrl: String((item.image_url: string) || ''),
      rewardId: Number((item.reward_id: number) || 0),
      rewardValue: Number((item.reward_value: number) || 0),
      slot: Number((item.slot: number) || 0)
    }));
    return { availableRewards, slots };
  } catch (err) {
    console.log(err);
    return { availableRewards: [], slots: [] };
  }
};

export const updateRewards = async ({
  userId,
  rewardId,
  slot
}: {
  userId: string,
  rewardId: number,
  slot: number
}): Promise<Object> => {
  try {
    const token = await getToken();

    const result = await axios.post(
      `${API_ROUTES.STORE}/${userId}`,
      {
        reward_id: rewardId,
        slot
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;

    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
