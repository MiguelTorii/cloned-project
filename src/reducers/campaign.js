/**
 * @format
 * @flow
 */
// import update from 'immutability-helper';
import update from 'immutability-helper';
import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type CampaignState = {
  newClassExperience: boolean,
  newFlashcardsExperience: boolean
};

const defaultState = {
  newClassExperience: null,
  newFlashcardsExperience: true,
  newNotesScreen: null,
  landingPageCampaign: null
};

export default (state: CampaignState = defaultState, action: Action): CampaignState => {
  switch (action.type) {
  case campaignActions.GET_CAMPAIGN:
    return update(state, {
      [action.payload.campaign]: { $set: action.payload.active }
    });
  case campaignActions.GET_FLASHCARDS_CAMPAIGN: {
    return update(state, {
      newFlashcardsExperience: { $set: action.payload.variation_key === 'visible' }
    });
  }
  default:
    return state;
  }
};
