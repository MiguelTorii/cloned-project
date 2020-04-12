/* eslint-disable import/prefer-default-export */
// @flow

import { authActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { ReferralData, School } from '../types/models';

const setSchool = ({ school }: { school: ?School }): Action => ({
  type: authActions.UPDATE_AUTH_SCHOOL_REQUEST,
  payload: {
    school
  }
});

export const updateSchool = ({ school }: { school: ?School }) => async (
  dispatch: Dispatch
) => {
  dispatch(setSchool({ school }));
};

const setReferralData = ({ referralData }: { referralData: ReferralData }): Action => ({
  type: authActions.UPDATE_REFERRAL_DATA,
  payload: {
    referralData
  }
});

export const updateReferralData = ({ referralData }: { referralData: ReferralData }) =>
  async (dispatch: Dispatch) => {
    dispatch(setReferralData({ referralData }));
  };

