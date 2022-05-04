import { push } from 'connected-react-router';
import store from 'store';

import { signInActions } from 'constants/action-types';
import { INSIGHTS_DASHBOARD_URI, STORAGE_KEYS } from 'constants/app';
import { AUTH_PAGE_SOURCE, PERMISSIONS } from 'constants/common';
import { URL } from 'constants/navigation';
import { deepLinkCheck } from 'utils/helpers';

import { signInUser, checkUser, samlLogin as samlSignin } from 'api/sign-in';
import { apiSetExpertMode, apiGetExpertMode, apiJoinWithReferralCode } from 'api/user';
import { apiLogViralLoopEmailLogin } from 'api/viral_loop';

import { showErrorModal } from './dialog';
import { showNotification } from './notifications';
import * as userActions from './user';
import { sync } from './user';

import type { Action } from 'types/action';
import type { TLoginError, User } from 'types/models';
import type { Dispatch } from 'types/store';

const requestSignIn = (): Action => ({
  type: signInActions.SIGN_IN_USER_REQUEST
});

const requestUserCheck = (): Action => ({
  type: signInActions.CHECK_USER_REQUEST
});

const setUser = ({
  user,
  expertMode,
  isExpert
}: {
  user: User;
  isExpert: boolean;
  expertMode: boolean;
}): Action => ({
  type: signInActions.SIGN_IN_USER_SUCCESS,
  payload: {
    user,
    expertMode,
    isExpert
  }
});

const setError = ({
  title,
  body,
  action = '',
  showSignup = false
}: {
  title: string;
  body: string;
  action?: string;
  showSignup?: boolean;
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

export const updateUser =
  ({ user }: { user: User }) =>
  async (dispatch: Dispatch) => {
    store.set('TOKEN', user.jwtToken);
    store.set('REFRESH_TOKEN', user.refreshToken);
    store.set('USER_ID', user.userId);
    dispatch(
      sync({
        userId: user.userId
      })
    );
    // both expert and student
    const isExpert =
      user.permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS) &&
      user.permission.includes(PERMISSIONS.MAIN_APPLICATION_ACCESS);
    // only expert/tutor
    const isTutor =
      user.permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS) &&
      user.permission.indexOf(PERMISSIONS.MAIN_APPLICATION_ACCESS) === -1;
    let expertMode = false;

    if (isExpert) {
      expertMode = await apiGetExpertMode(user.userId);
    }

    if (isTutor) {
      expertMode = await apiSetExpertMode(user.userId, true);
    }

    dispatch(
      setUser({
        user,
        isExpert,
        expertMode
      })
    );
    dispatch(userActions.fetchClasses());
  };

const processInvite = async (dispatch: Dispatch) => {
  // Check if the user is invited by a referral code
  const referralCode = store.get(STORAGE_KEYS.REFERRAL_CODE);

  if (!referralCode) {
    return;
  }

  const { success, message } = await apiJoinWithReferralCode(referralCode);

  if (success) {
    dispatch(
      showNotification({
        message: 'Thanks for joining CircleIn!',
        variant: 'success'
      })
    );
  } else {
    dispatch(
      showNotification({
        message,
        variant: 'error'
      })
    );
  }

  store.remove(STORAGE_KEYS.REFERRAL_CODE);
};

export const signIn =
  ({ email, password, schoolId }: { email: string; password: string; schoolId: number }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(requestSignIn());
      const user = await signInUser(email, password, schoolId);
      await dispatch(
        updateUser({
          user
        })
      );

      await processInvite(dispatch);

      // Check if this is sign-in from viral loop email.
      // If so, call a logging api.
      const viralLoopType = store.get(STORAGE_KEYS.VIRAL_LOOP_TYPE);

      if (viralLoopType) {
        apiLogViralLoopEmailLogin(Number(user.userId), viralLoopType);
      }

      return dispatch(push('/'));
    } catch (err: any) {
      const { response = {} } = err;
      const { data = {} } = response;

      if (data.code === 401) {
        return dispatch(
          setError({
            title: "Something doesn't look right",
            body: data.message,
            showSignup: true
          })
        );
      }

      return dispatch(
        setError({
          title: 'Hm, something’s wrong.',
          body: 'There was an issue logging you in. Please check your email or password, or try logging in using a different role. Contact us at support@circleinapp.com if you continue to experience issues logging in.'
        })
      );
    }
  };
export const samlLogin =
  (token: string, isGondor = false) =>
  async (dispatch: Dispatch) => {
    try {
      const user = await samlSignin(token, isGondor);

      if (user.jwtToken) {
        await dispatch(
          updateUser({
            user
          })
        );

        await processInvite(dispatch);

        const authPageSource = store.get(STORAGE_KEYS.AUTH_PAGE_SOURCE);

        if (authPageSource === AUTH_PAGE_SOURCE.CANVAS) {
          dispatch(push(URL.LOGIN_POPUP_CLOSE));

          return;
        }
      }

      return dispatch(
        push('/', {
          error: !user.jwtToken
        })
      );
    } catch (err: any) {
      const { response = {} } = err;
      const errorData: TLoginError = response.data;

      if (errorData.should_redirect) {
        window.location.href = `${INSIGHTS_DASHBOARD_URI}/gondor?jwt=${token}`;
      } else {
        dispatch(
          showErrorModal({
            code: response.status,
            text: errorData.result
          })
        );

        dispatch(push('/'));
      }
    }
  };
export const clearSignInError = () => async (dispatch: Dispatch) => dispatch(clearError());
export const checkUserSession =
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    dispatch(requestUserCheck());

    const token = store.get('REFRESH_TOKEN');
    const userId = store.get('USER_ID');

    if (token && userId) {
      const user = await checkUser(token, userId);

      if (user.email) {
        dispatch(
          updateUser({
            user
          })
        );
        return true;
      }
    }

    store.remove('TOKEN');
    store.remove('REFRESH_TOKEN');
    store.remove('USER_ID');
    await dispatch(clearError());

    const {
      router: {
        location: { pathname }
      }
    } = getState();

    // TODO: redirect urls before login should remove the code bellow
    if (
      ![
        '/new',
        '/reset_password',
        '/old',
        '/oauth',
        '/auth',
        '/forgot_password',
        '/reset_password',
        '/terms-of-use',
        '/redirect',
        '/saml',
        '/gondor'
      ].includes(pathname) &&
      !pathname.includes('/canvas') &&
      !deepLinkCheck(pathname)
    ) {
      dispatch(push('/'));
    }

    return false;
  };
export const signOut = () => async (dispatch: Dispatch) => {
  try {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = window.location.origin;
    store.clearAll();
  } catch (err) {
    // NONE
  }
};
export const updateError =
  ({ title, body, action }: { title: string; body: string; action?: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      setError({
        title,
        body,
        action
      })
    );
  };
