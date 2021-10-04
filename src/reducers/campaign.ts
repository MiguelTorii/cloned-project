// import update from 'immutability-helper';
import update from "immutability-helper";
import { campaignActions } from "../constants/action-types";
import type { Action } from "../types/action";
export type CampaignState = {
  newClassExperience: boolean;
  newFlashcardsExperience: boolean;
  chatLanding: boolean;
  showScholarshipTracker: boolean;
  showSupportCenter: boolean;
};
const VARIATION_KEY = {
  HIDDEN: 'hidden'
};
const defaultState = {
  newClassExperience: null,
  newFlashcardsExperience: true,
  newNotesScreen: null,
  landingPageCampaign: null,
  chatLanding: false,
  showScholarshipTracker: false,
  showSupportCenter: false
};
export default ((state: CampaignState = defaultState, action: Action): CampaignState => {
  switch (action.type) {
    case campaignActions.GET_CAMPAIGN:
      return update(state, {
        [action.payload.campaign]: {
          $set: action.payload.active
        }
      });

    case campaignActions.GET_FLASHCARDS_CAMPAIGN:
      {
        return update(state, {
          newFlashcardsExperience: {
            $set: action.payload.variation_key === 'visible'
          }
        });
      }

    case campaignActions.GET_CHAT_LANDING_CAMPAIGN:
      {
        return update(state, {
          chatLanding: {
            $set: action.payload.variation_key === 'chat'
          }
        });
      }

    case campaignActions.GET_LEADERBOARD_AND_SUPPORTCENTER_VISIBILITY_CAMPAIGN:
      {
        const {
          is_disabled,
          variation_key
        } = action.payload;
        return update(state, {
          showScholarshipTracker: {
            $set: !is_disabled && variation_key !== VARIATION_KEY.HIDDEN
          },
          showSupportCenter: {
            $set: !is_disabled && variation_key !== VARIATION_KEY.HIDDEN
          }
        });
      }

    default:
      return state;
  }
});