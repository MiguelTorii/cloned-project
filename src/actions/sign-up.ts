import { push } from "connected-react-router";
import store from "store";
import { LANDING_PAGE_CAMPAIGN } from "constants/campaigns";
import * as campaignActions from "actions/campaign";
import { signUpActions } from "../constants/action-types";
import type { Action } from "../types/action";
import type { Dispatch } from "../types/store";
import type { User, UpdateProfile } from "../types/models";
import { createAccount, setReferral } from "../api/sign-up";

const requestSignUp = (): Action => ({
  type: signUpActions.SIGN_UP_USER_REQUEST
});

const setUser = ({
  user
}: {
  user: User;
}): Action => ({
  type: signUpActions.SIGN_UP_USER_SUCCESS,
  payload: {
    user
  }
});

const setError = ({
  title,
  body,
  action = ''
}: {
  title: string;
  body: string;
  action: string;
}): Action => ({
  type: signUpActions.SIGN_UP_USER_ERROR,
  payload: {
    title,
    action,
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
  grade: number;
  school: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  segment: string;
  referralCode: string;
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
      userId: (result.user_id as string) || '',
      nonce: (result.nonce as string) || '',
      email: (result.email as string) || '',
      firstName: (result.first_name as string) || '',
      lastName: (result.last_name as string) || '',
      school: (result.school as string) || '',
      schoolId: (result.school_id as number) || 0,
      segment: (result.segment as string) || '',
      twilioToken: (result.twilio_token as string) || '',
      canvasUser: (result.canvas_user as boolean) || false,
      grade: (result.grade_id as number) || 0,
      jwtToken: (result.jwt_token as string) || '',
      refreshToken: (result.refresh_token as string) || '',
      profileImage: (result.profile_image_url as string) || '',
      rank: (result.rank as number) || 0,
      referralCode: (result.referral_code as string) || '',
      updateProfile: (result.update_profile as Array<UpdateProfile>) || [],
      lmsTypeId: (result.lms_type_id as number) || -1,
      lmsUser: (result.lms_user as boolean) || false
    };
    store.set('TOKEN', user.jwtToken);
    store.set('REFRESH_TOKEN', user.refreshToken);
    store.set('USER_ID', user.userId);
    store.set('SEGMENT', user.segment);
    await dispatch(setUser({
      user
    }));
    await dispatch(campaignActions.requestCampaign({
      campaignId: LANDING_PAGE_CAMPAIGN,
      reset: true
    }));

    try {
      if (referralCode !== '') {
        setReferral({
          userId: user.userId,
          referralCode
        });
      }
    } catch (err) {
      console.log(err);
    }

    return dispatch(push('/'));
  } catch (err) {
    //   const { response = {} } = err;
    return dispatch(setError({
      title: 'Unknown error',
      body: 'Please contact us'
    }));
  }
};
export const updateError = ({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: string;
}) => async (dispatch: Dispatch) => dispatch(setError({
  title,
  body,
  action
}));
export const clearSignUpError = () => async (dispatch: Dispatch) => dispatch(clearError());