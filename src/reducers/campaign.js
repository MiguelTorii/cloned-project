/**
 * @format
 * @flow
 */
// import update from 'immutability-helper';
import update from 'immutability-helper';
import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type CampaignState = {
};

const defaultState = {};

export default (state: CampaignState = defaultState, action: Action): CampaignState => {
  switch (action.type) {
  case campaignActions.GET_CAMPAIGN:
    return update(state, {
      [action.payload.id]: { $set: action.payload }
    });
  default:
    return state;
  }
};
