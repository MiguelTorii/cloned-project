// @flow

import { signInActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { User } from '../types/models';
import { signInUser } from '../api/sign-in';

const setUser = ({ user }: { user: User }): Action => ({
  type: signInActions.SIGN_IN_USER_SUCCESS,
  payload: {
    user
  }
});

const signInError = ({ error }: { error: String }): Action => ({
  type: signInActions.SIGN_IN_USER_ERROR,
  payload: {
    error
  }
});

export const requestSignIn = ({
  email,
  password
}: {
  email: string,
  password: string
}) => async (dispatch: Dispatch) => {
  try {
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

    return dispatch(setUser({ user }));
  } catch (err) {
    return dispatch(signInError({ error: err.message }));
  }
};

export const hola = 'hola';
