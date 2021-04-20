// @flow

import { push } from 'connected-react-router';
import store from 'store';
import { LANDING_PAGE_CAMPAIGN } from 'constants/campaigns'
import * as campaignActions from 'actions/campaign'
import * as chatActions from 'actions/chat'
import * as userActions from 'actions/user'
import { sync } from 'actions/user';
import { signInActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { User } from '../types/models';
import { signInUser, checkUser, samlLogin as samlSignin } from '../api/sign-in';
import { apiGetExpertMode } from '../api/user';

const requestSignIn = (): Action => ({
  type: signInActions.SIGN_IN_USER_REQUEST
});

const requestUserCheck = (): Action => ({
  type: signInActions.CHECK_USER_REQUEST
});

const setUser = ({ user, expertMode, isExpert }: {
  user: User,
  isExpert: boolean,
  expertMode: boolean
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
  action = '',
  showSignup = false
}: {
  title: string,
  body: string,
  action?: string,
  showSignup?: boolean
}): Action => ({
  type: signInActions.SIGN_IN_USER_ERROR,
  payload: {
    title,
    body,
    action,
    showSignup
  }
});

const clearError = (): Action => ({
  type: signInActions.SIGN_IN_USER_CLEAR_ERROR
});

export const updateUser = ({ user }: { user: User }) => async (
  dispatch: Dispatch
) => {
  store.set('TOKEN', user.jwtToken);
  store.set('REFRESH_TOKEN', user.refreshToken);
  store.set('USER_ID', user.userId);
  store.set('SEGMENT', user.segment);

  dispatch(sync({ userId: user.userId }))

  const isExpert = user.permission.includes('expert_mode_access') &&
    user.permission.includes('main_application_access');
  let expertMode = false;

  if (isExpert) expertMode = await apiGetExpertMode(user.userId);

  dispatch(setUser({ user, isExpert, expertMode }));

  dispatch(userActions.fetchClasses())
  dispatch(chatActions.handleInitChat())
  await dispatch(campaignActions.requestCampaign({ campaignId: LANDING_PAGE_CAMPAIGN, reset: true }))
};


export const signIn = ({
  email,
  password,
  schoolId,
}: {
  email: string,
  password: string,
  schoolId: number
}) => async (dispatch: Dispatch) => {
  try {
    dispatch(requestSignIn());
    const user = await signInUser(email, password, schoolId);

    dispatch(updateUser({ user }))
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
    const user = await samlSignin(token);

    if (user.jwtToken)
      dispatch(updateUser({ user }))
    return dispatch(push('/', { error: !user.jwtToken }));
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

export const checkUserSession = () => async (
  dispatch: Dispatch,
  getState: Function
) => {
  try {
    dispatch(requestUserCheck());
    // $FlowFixMe
    const user = await checkUser();

    if (user.email) {
      dispatch(updateUser({ user }))
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

  const {
    router: {
      location: {
        pathname
      }
    }
  } = getState()

  // TODO: redirect urls before login should remove the code bellow
  if (
    ! [
      '/new',
      '/reset_password',
      '/old',
      '/oauth',
      '/auth',
      '/forgot_password',
      '/reset_password',
      '/terms-of-use',
      '/redirect',
      '/saml'
    ].includes(pathname) &&
    !pathname.includes('/canvas')
  ) {
    dispatch(push('/'));
  }
  return false
};

export const signOut = () => async (dispatch: Dispatch) => {
  try {
    dispatch(chatActions.handleShutdownChat())
    dispatch(clearState())
    store.clearAll()
    dispatch(requestSignOut());
    dispatch(push('/'));
    dispatch(clearUser());
    // window.location.href = 'https://www.circleinapp.com/'
  } catch (err) {
    // NONE
  }
};

export const updateError = ({
  title,
  body,
  action
}: {
  title: string,
  body: string,
  action?: boolean
}) => async (dispatch: Dispatch) => {
  dispatch(setError({ title, body, action }));
};
