/**
 * @format
 * @flow
 */
// import update from 'immutability-helper';
import update from 'immutability-helper';
import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type CampaignState = {
  newClassExperience: boolean
};

const defaultState = {
  newClassExperience: null
};

export default (state: CampaignState = defaultState, action: Action): CampaignState => {
  switch (action.type) {
  case campaignActions.GET_CAMPAIGN:
    return update(state, {
      [action.payload.campaign]: { $set: action.payload.active }
    });
  default:
    return state;
  }
};
