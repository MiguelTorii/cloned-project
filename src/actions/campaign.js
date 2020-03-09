/* eslint-disable import/prefer-default-export */
// @flow

import { campaignActions } from '../constants/action-types';
import type { Action } from '../types/action';
import { getCampaign } from '../api/campaign'
import type { Dispatch } from '../types/store';

const requestGetCampaign = ({ id, isDisabled }: {
  id: string,
  isDisabled: boolean
}): Action => ({
  type: campaignActions.GET_CAMPAIGN,
  payload: {
    id,
    isDisabled
  }
});


export const requestCampaign = ({ campaignId }: { campaignId: string }) => async (dispatch: Dispatch, getState: Function) => {
  try {
    const { campaign } = getState()

    if(!campaign[campaignId]) {
      const { campaign_id: id, is_disabled: isDisabled } = await getCampaign({ campaignId })
      dispatch(requestGetCampaign({ id, isDisabled }));
    }
  } catch(e) {
    dispatch(requestGetCampaign({ id: campaignId, isDisabled: true }));
  }
};

