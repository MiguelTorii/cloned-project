// @flow

import { push } from 'connected-react-router';
import { signInActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { User } from '../types/models';
import { signInUser } from '../api/sign-in';

const requestSignIn = (): Action => ({
  type: signInActions.SIGN_IN_USER_REQUEST
});

const setUser = ({ user }: { user: User }): Action => ({
  type: signInActions.SIGN_IN_USER_SUCCESS,
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
  type: signInActions.SIGN_IN_USER_ERROR,
  payload: {
    title,
    body
  }
});

const clearError = (): Action => ({
  type: signInActions.SIGN_IN_USER_CLEAR_ERROR
});

export const signIn = ({
  email,
  password
}: {
  email: string,
  password: string
}) => async (dispatch: Dispatch) => {
  try {
    dispatch(requestSignIn());
    const result = await signInUser(email, password);

    const user = {
      userId: result.user_id || '',
      email: result.email || '',
      firstName: result.first_name || '',
      lastName: result.last_name || '',
      school: result.school || '',
      schoolId: result.school_id || 0,
      segment: result.segment || '',
      twilioToken: result.twilio_token || '',
      canvasUser: result.canvas_user || false,
      grade: result.grade_id || 0,
      jwtToken: result.jwt_token || '',
      refreshToken: result.refresh_token || '',
      profileImage: result.profile_image_url || '',
      rank: result.rank || 0,
      referralCode: result.referral_code || '',
      updateProfile: result.update_profile || []
    };

    await dispatch(setUser({ user }));
    return dispatch(push('/'));
  } catch (err) {
    const { response = {} } = err;
    if (response.status === 401)
      return dispatch(
        setError({
          title: 'Invalid Credentials',
          body: 'The credentials supplied are not valid, please try again.'
        })
      );
    return dispatch(
      setError({ title: 'Unknown error', body: 'Please contact us' })
    );
  }
};

export const clearSignInError = () => async (dispatch: Dispatch) =>
  dispatch(clearError());
