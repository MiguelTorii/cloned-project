/* eslint-disable import/prefer-default-export */
// @flow

import { NEW_CLASSES_CAMPAIGN } from 'constants/campaigns'
import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';
import { getCampaign } from '../api/campaign'
import type { Dispatch } from '../types/store';

const requestGetCampaign = ({ campaign, active }: {
  campaign: string,
  active: boolean
}): Action => ({
  type: campaignActions.GET_CAMPAIGN,
  payload: {
    campaign,
    active
  }
});


export const requestCampaign = ({ campaignId, reset }: { reset: boolean, campaignId: string }) => async (dispatch: Dispatch, getState: Function) => {
  try {
    const { campaign } = getState()

    if (campaign.newClassExperience === null || reset) {
      const { id, is_disabled: isDisabled } = await getCampaign({ campaignId })

      if (campaignId === NEW_CLASSES_CAMPAIGN) 
        dispatch(requestGetCampaign({ campaign: 'newClassExperience', active: !isDisabled && id === 3 }));
    }
  } catch(e) {
    if (campaignId === NEW_CLASSES_CAMPAIGN) 
      dispatch(requestGetCampaign({ campaign: 'newClassExperience', active: false }));
    return null
  }
  return null
};

