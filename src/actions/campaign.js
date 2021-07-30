/* eslint-disable import/prefer-default-export */
// @flow

import { LANDING_PAGE_CAMPAIGN } from 'constants/campaigns';
import { CAMPAIGN_IDS } from 'constants/app';
import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';
import { getCampaign } from '../api/campaign';
import type { Dispatch } from '../types/store';

const requestGetCampaign = ({
  campaign,
  active
}: {
  campaign: string,
  active: boolean
}): Action => ({
  type: campaignActions.GET_CAMPAIGN,
  payload: {
    campaign,
    active
  }
});

export const requestCampaign =
  ({ campaignId, reset }: { reset: boolean, campaignId: string }) =>
  async (dispatch: Dispatch, getState: Function) => {
    const { campaign } = getState();

    if (campaignId === LANDING_PAGE_CAMPAIGN) {
      if (campaign.newClassExperience === null || reset) {
        try {
          const { id } = await getCampaign({ campaignId });

          dispatch(
            requestGetCampaign({
              campaign: 'landingPageCampaign',
              active: id === 4
            })
          );
          dispatch(
            requestGetCampaign({
              campaign: 'newClassExperience',
              active: id !== 1
            })
          );
        } catch (e) {
          if (campaignId === LANDING_PAGE_CAMPAIGN)
            dispatch(
              requestGetCampaign({
                campaign: 'newClassExperience',
                active: false
              })
            );
        }
      }

      if (campaign.newNotesScreen === null || reset) {
        try {
          const { id } = await getCampaign({ campaignId: 11 });

          dispatch(
            requestGetCampaign({
              campaign: 'newNotesScreen',
              active: id === 2
            })
          );
        } catch (e) {
          dispatch(
            requestGetCampaign({ campaign: 'newNotesScreen', active: false })
          );
        }
      }
    }
    return null;
  };

export const getFlashcardsCampaign = () => ({
  isApiCall: true,
  type: campaignActions.GET_FLASHCARDS_CAMPAIGN,
  apiCall: () => getCampaign({ campaignId: CAMPAIGN_IDS.FLASHCARD_VERSION })
});
