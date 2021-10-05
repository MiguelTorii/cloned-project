import { APIAvailableReward } from './APIAvailableReward';
import { APISlot } from './APISlot';

export type APIRewards = {
  available_rewards: APIAvailableReward[];
  slots: APISlot[];
};
