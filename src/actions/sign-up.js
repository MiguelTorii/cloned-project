// @flow

import { push } from 'connected-react-router';
import store from 'store';
import { NEW_CLASSES_CAMPAIGN } from 'constants/campaigns'
import * as campaignActions from 'actions/campaign'
import { signUpActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { User, UpdateProfile } from '../types/models';
import { createAccount, setReferral } from '../api/sign-up';

const requestSignUp = (): Action => ({
  type: signUpActions.SIGN_UP_USER_REQUEST
});

const setUser = ({ user }: { user: User }): Action => ({
  type: signUpActions.SIGN_UP_USER_SUCCESS,
  payload: {
    user
  }
});

const setError = ({
  title,
  body
}: {
  title: string,
  body: string
}): Action => ({
  type: signUpActions.SIGN_UP_USER_ERROR,
  payload: {
    title,
    body
  }
});

const clearError = (): Action => ({
  type: signUpActions.SIGN_UP_USER_CLEAR_ERROR
});

export const signUp = ({
  grade,
  school,
  firstName,
  lastName,
  password,
  email,
  phone,
  segment,
  referralCode
}: {
  grade: number,
  school: string,
  firstName: string,
  lastName: string,
  password: string,
  email: string,
  phone: string,
  segment: string,
  referralCode: string
}) => async (dispatch: Dispatch) => {
  try {
    dispatch(requestSignUp());
    // $FlowFixMe
    const result = await createAccount({
      grade,
      school,
      firstName,
      lastName,
      password,
      email,
      phone,
      segment,
      referralCode
    });

    const user: User = {
      userId: (result.user_id: string) || '',
      email: (result.email: string) || '',
      firstName: (result.first_name: string) || '',
      lastName: (result.last_name: string) || '',
      school: (result.school: string) || '',
      schoolId: (result.school_id: number) || 0,
      segment: (result.segment: string) || '',
      twilioToken: (result.twilio_token: string) || '',
      canvasUser: (result.canvas_user: boolean) || false,
      grade: (result.grade_id: number) || 0,
      jwtToken: (result.jwt_token: string) || '',
      refreshToken: (result.refresh_token: string) || '',
      profileImage: (result.profile_image_url: string) || '',
      rank: (result.rank: number) || 0,
      referralCode: (result.referral_code: string) || '',
      updateProfile: (result.update_profile: Array<UpdateProfile>) || [],
      lmsTypeId: (result.lms_type_id: number) || -1,
      lmsUser: (result.lms_user: boolean) || false
    };

    store.set('TOKEN', user.jwtToken);
    store.set('REFRESH_TOKEN', user.refreshToken);
    store.set('USER_ID', user.userId);
    store.set('SEGMENT', user.segment);

    await dispatch(setUser({ user }));

    await dispatch(campaignActions.requestCampaign({ campaignId: NEW_CLASSES_CAMPAIGN, reset: true }))
    try {
      if (referralCode !== '') {
        setReferral({ userId: user.userId, referralCode });
      }
    } catch (err) {
      console.log(err);
    }
    return dispatch(push('/'));
  } catch (err) {
    //   const { response = {} } = err;
    return dispatch(
      setError({ title: 'Unknown error', body: 'Please contact us' })
    );
  }
};

export const updateError = ({
  title,
  body
}: {
  title: string,
  body: string
}) => async (dispatch: Dispatch) => {
  return dispatch(setError({ title, body }));
};

export const clearSignUpError = () => async (dispatch: Dispatch) =>
  dispatch(clearError());
