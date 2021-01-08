// @flow

import { push } from 'connected-react-router';
import store from 'store';
import { LANDING_PAGE_CAMPAIGN } from 'constants/campaigns'
import * as campaignActions from 'actions/campaign'
import { redirectNonce } from 'api/utils'
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

const setUser = ({ user, expertMode, isExpert }: {
  user: User,
  expertMode: boolean,
    isExpert: boolean
}): Action => ({
  type: signInActions.SIGN_IN_USER_SUCCESS,
  payload: {
    user,
    expertMode,
    isExpert
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
  schoolId,
  role
}: {
  email: string,
  password: string,
  role: string,
  schoolId: number
}) => async (dispatch: Dispatch) => {
  try {
    dispatch(requestSignIn());
    // $FlowFixMe
    let appId = 1
    if (role === 'faculty') {
      appId = 2
    }
    if(role === 'tutor') {
      appId = 3
    }
    const result = await signInUser(email, password, schoolId, appId);

    const user: User = {
      appAccess: (result.app_access) || [1],
      userId: (result.user_id: string) || '',
      redirectUri: (result.redirect_uri: string) || '',
      nonce: (result.nonce: string) || '',
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

    const redirected = redirectNonce(user)
    if (redirected) return  () => {}

    store.set('TOKEN', user.jwtToken);
    store.set('REFRESH_TOKEN', user.refreshToken);
    store.set('USER_ID', user.userId);
    store.set('SEGMENT', user.segment);

    const isExpert = user.appAccess.includes(1) && user.appAccess.includes(3)
    const expertMode = (user.appAccess.includes(3) && !user.appAccess.includes(1)) ||
      (user.appAccess.includes(3) && store.get('ROLE') === 'tutor')
    dispatch(setUser({ user, isExpert, expertMode }));

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
      setError({ title: 'Hm, something’s wrong.', body: 'There was an issue logging you in. Please check your email or password, or try logging in using a different role. Contact us at support@circleinapp.com if you continue to experience issues logging in.' })
    );
  }
};

export const samlLogin = (token: string) => async (dispatch: Dispatch) => {
  try {
    const result = await samlSignin(token);

    const user: User = {
      userId: (result.user_id: string) || '',
      email: (result.email: string) || '',
      redirectUri: (result.redirect_uri: string) || '',
      nonce: (result.nonce: string) || '',
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

    const redirected = redirectNonce(user)
    if (redirected) return  () => {}

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

export const clearSignInError = () => async (dispatch: Dispatch) =>
  dispatch(clearError());

export const checkUserSession = () => async (dispatch: Dispatch, getState: Function) => {
  try {
    dispatch(requestUserCheck());
    // $FlowFixMe
    const result = await checkUser();
    const {
      user: {
        expertMode
      }
    } = getState()
    const error =
      Object.entries(result).length === 0 && result.constructor === Object;
    if (!error) {
      const user: User = {
        userId: (result.user_id: string) || '',
        appAccess: (result.app_access) || [1],
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

      const isExpert = user.appAccess.includes(1) && user.appAccess.includes(3)
      if (expertMode === null) {
        const expertMode = (user.appAccess.includes(3) && !user.appAccess.includes(1)) ||
      (user.appAccess.includes(3) && store.get('ROLE') === 'tutor')
        dispatch(setUser({ user, isExpert, expertMode }));
      } else {
        dispatch(setUser({ user, isExpert, expertMode }));
      }
      return true
    }
    store.remove('TOKEN');
    store.remove('REFRESH_TOKEN');
    store.remove('USER_ID');
    store.remove('SEGMENT');
    await dispatch(clearError());
  } catch (err) {
    console.log(err)
  }

  // TODO: redirect urls before login should remove the code bellow
  if (
    ! [
      '/new-oauth',
      '/new',
      '/old',
      '/oauth',
      '/auth',
      '/forgot_password',
      '/reset_password',
      '/terms-of-use',
      '/redirect',
      '/saml'
    ].includes(window.location.pathname)
  ) {
    dispatch(push('/'));
  }
  return false
};

export const updateUser = ({ user }: { user: User }) => async (
  dispatch: Dispatch
) => {
  store.set('TOKEN', user.jwtToken);
  store.set('REFRESH_TOKEN', user.refreshToken);
  store.set('USER_ID', user.userId);
  store.set('SEGMENT', user.segment);

  await dispatch(setUser({ user }));
  await dispatch(campaignActions.requestCampaign({ campaignId: LANDING_PAGE_CAMPAIGN, reset: true }))
};

export const signOut = () => async (dispatch: Dispatch) => {
  try {
    dispatch(clearState())
    dispatch(requestSignOut());
    store.clearAll()
    dispatch(clearUser());
    // window.location.href = 'https://www.circleinapp.com/'
  } catch (err) {
    // NONE
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
