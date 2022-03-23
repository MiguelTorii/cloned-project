import type { APIAvailableReward } from './APIAvailableReward';
import type { APISlot } from './APISlot';

export type APIRewards = {
  available_rewards: APIAvailableReward[];
  slots: APISlot[];
};
