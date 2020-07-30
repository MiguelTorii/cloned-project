// @flow

import { push } from 'connected-react-router';
import store from 'store';
import { LANDING_PAGE_CAMPAIGN } from 'constants/campaigns'
import * as campaignActions from 'actions/campaign'
import { signInActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { User, UpdateProfile } from '../types/models';
import { signInUser, checkUser, samlLogin as samlSignin } from '../api/sign-in';

const requestSignIn = (): Action => ({
  type: signInActions.SIGN_IN_USER_REQUEST
});

const requestUserCheck = (): Action => ({
  type: signInActions.CHECK_USER_REQUEST
});

const setUser = ({ user }: { user: User }): Action => ({
  type: signInActions.SIGN_IN_USER_SUCCESS,
  payload: {
    user
  }
});

const clearState = () => ({
  type: rootActions.CLEAR_STATE
})

const requestSignOut = (): Action => ({
  type: signInActions.SIGN_OUT_USER_REQUEST
});

const clearUser = (): Action => ({
  type: signInActions.SIGN_OUT_USER_SUCCESS
});

const setError = ({
  title,
  body,
  showSignup = false
}: {
  title: string,
  body: string,
  showSignup?: boolean
}): Action => ({
  type: signInActions.SIGN_IN_USER_ERROR,
  payload: {
    title,
    body,
    showSignup
  }
});

const clearError = (): Action => ({
  type: signInActions.SIGN_IN_USER_CLEAR_ERROR
});

export const signIn = ({
  email,
  password,
  schoolId
}: {
  email: string,
  password: string,
  schoolId: number
}) => async (dispatch: Dispatch) => {
  try {
    dispatch(requestSignIn());
    // $FlowFixMe
    const result = await signInUser(email, password, schoolId);

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
    await dispatch(campaignActions.requestCampaign({ campaignId: LANDING_PAGE_CAMPAIGN, reset: true }))
    return dispatch(push('/'));
  } catch (err) {
    const { response = {} } = err;
    const { data = {} } = response;

    if (data.code === 401)
      return dispatch(
        setError({
          title: "Something doesn't look right",
          body: data.message,
          showSignup: true
        })
      );
    return dispatch(
      setError({ title: 'Unknown error', body: 'Please contact us' })
    );
  }
};

export const samlLogin = (token: string) => async (dispatch: Dispatch) => {
  try {
    const result = await samlSignin(token);

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
    return dispatch(push('/'));
  } catch (err) {
    const { response = {} } = err;
    const { data = {} } = response;

    if (data.code === 401)
      return dispatch(
        setError({
          title: "Something doesn't look right",
          body: data.message,
          showSignup: true
        })
      );
    return dispatch(
      setError({ title: 'Unknown error', body: 'Please contact us' })
    );
  }
};

export const clearSignInError = () => async (dispatch: Dispatch) =>
  dispatch(clearError());

export const checkUserSession = () => async (dispatch: Dispatch) => {
  try {
    dispatch(requestUserCheck());
    // $FlowFixMe
    const result = await checkUser();
    const error =
      Object.entries(result).length === 0 && result.constructor === Object;
    if (!error) {
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

      dispatch(setUser({ user }));
    } else {
      store.remove('TOKEN');
      store.remove('REFRESH_TOKEN');
      store.remove('USER_ID');
      store.remove('SEGMENT');
      await dispatch(clearError());
      dispatch(push('/login'));
    }
  } catch (err) {
    dispatch(push('/login'));
  }
};

export const updateUser = ({ user }: { user: User }) => async (
  dispatch: Dispatch
) => {
  store.set('TOKEN', user.jwtToken);
  store.set('REFRESH_TOKEN', user.refreshToken);
  store.set('USER_ID', user.userId);
  store.set('SEGMENT', user.segment);

  dispatch(setUser({ user }));
};

export const signOut = () => async (dispatch: Dispatch) => {
  try {
    dispatch(clearState())
    dispatch(requestSignOut());
    store.clearAll()
    dispatch(clearUser());
    dispatch(push('/login'));
  } catch (err) {
    dispatch(push('/login'));
  }
};

export const updateError = ({
  title,
  body
}: {
  title: string,
  body: string
}) => async (dispatch: Dispatch) => {
  dispatch(setError({ title, body }));
};
