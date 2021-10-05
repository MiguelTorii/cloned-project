/* eslint-disable import/prefer-default-export */
import { authActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { ReferralData, School } from '../types/models';

const setRole = ({ role }): Action => ({
  type: authActions.UPDATE_AUTH_ROLE,
  payload: {
    role
  }
});

export const updateRole =
  ({ role }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      setRole({
        role
      })
    );
  };

const setSchool = ({ school }: { school: School | null | undefined }): Action => ({
  type: authActions.UPDATE_AUTH_SCHOOL_REQUEST,
  payload: {
    school
  }
});

export const updateSchool =
  ({ school }: { school: School | null | undefined }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      setSchool({
        school
      })
    );
  };

const setReferralData = ({ referralData }: { referralData: ReferralData }): Action => ({
  type: authActions.UPDATE_REFERRAL_DATA,
  payload: {
    referralData
  }
});

export const updateReferralData =
  ({ referralData }: { referralData: ReferralData }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      setReferralData({
        referralData
      })
    );
  };
