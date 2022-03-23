/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import { getToken } from './utils';

import type { APIAvailableReward } from './models/APIAvailableReward';
import type { APIRewards } from './models/APIRewards';
import type { APISlot } from './models/APISlot';
import type { Rewards } from 'types/models';

export const getRewards = async ({ userId }: { userId: string }): Promise<Rewards> => {
  try {
    const token = await getToken();
    const result: { data: APIRewards } = await axios.get(`${API_ROUTES.STORE}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;
    const availableRewards = data.available_rewards.map((item: APIAvailableReward) => ({
      bgColor: item.bg_color || '',
      displayName: item.display_name || '',
      imageUrl: item.image_url || '',
      isSelected: item.is_selected || false,
      rewardId: item.reward_id || 0,
      rewardValue: item.reward_value || 0
    }));
    const slots = data.slots.map((item: APISlot) => ({
      bgColor: item.bg_color || '',
      displayName: item.display_name || '',
      imageUrl: item.image_url || '',
      rewardId: item.reward_id || 0,
      rewardValue: item.reward_value || 0,
      slot: item.slot || 0
    }));
    return {
      availableRewards,
      slots
    };
  } catch (err) {
    console.log(err);
    return {
      availableRewards: [],
      slots: []
    };
  }
};
export const updateRewards = async ({
  userId,
  rewardId,
  slot
}: {
  userId: string;
  rewardId: number;
  slot: number;
}): Promise<Record<string, any>> => {
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
