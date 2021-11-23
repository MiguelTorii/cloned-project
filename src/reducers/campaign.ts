import update from 'immutability-helper';
import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type CampaignState = {
  chatLanding: boolean;
  landingPageCampaign: any;
  newFlashcardsExperience: boolean;
  newNotesScreen: any;
  showScholarshipTracker: boolean;
  showSupportCenter: boolean;
  newClassExperience: boolean;

  /**
   * If the campaign has not yet loaded, return null.
   * Once the campaign has loaded, return true or false.
   * Don't return false before the campaign has loaded otherwise
   * if the campaign is set to true, the wrong UI layout will flash
   * and then disappear when the campaign finally loads.
   */
  hud: boolean | null;
};

const VARIATION_KEY = {
  HIDDEN: 'hidden'
};

const defaultState = {
  chatLanding: false,
  landingPageCampaign: null,
  newFlashcardsExperience: true,
  newNotesScreen: null,
  showScholarshipTracker: false,
  showSupportCenter: false,
  newClassExperience: false,
  hud: null
};

export default (state: CampaignState = defaultState, action: Action): CampaignState => {
  switch (action.type) {
    case campaignActions.GET_CAMPAIGN:
      return update(state, {
        [action.payload.campaign]: {
          $set: action.payload.active
        }
      });

    case campaignActions.GET_FLASHCARDS_CAMPAIGN: {
      return update(state, {
        newFlashcardsExperience: {
          $set: action.payload.variation_key === 'visible'
        }
      });
    }

    case campaignActions.GET_CHAT_LANDING_CAMPAIGN: {
      return update(state, {
        chatLanding: {
          $set: action.payload.variation_key === 'chat'
        }
      });
    }

    case campaignActions.GET_HUD_CAMPAIGN: {
      return update(state, {
        hud: {
          $set: action.payload.variation_key === 'visible'
        }
      });
    }

    case campaignActions.GET_LEADERBOARD_AND_SUPPORTCENTER_VISIBILITY_CAMPAIGN: {
      const { is_disabled, variation_key } = action.payload;
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
};
