import { push } from 'connected-react-router';
import store from 'store';
import { LANDING_PAGE_CAMPAIGN } from '../constants/campaigns';
import * as campaignActions from './campaign';
import { signUpActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import type { User, UpdateProfile } from '../types/models';
import { createAccount, setReferral } from '../api/sign-up';
import { APIUser } from '../api/models/APIUser';

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
  body,
  action = ''
}: {
  title: string;
  body: string;
  action?: string;
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

export const signUp =
  ({
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
  }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(requestSignUp());
      const result: APIUser = await createAccount({
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
        userId: result.user_id ? String(result.user_id) : '',
        nonce: result.nonce || '',
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
        updateProfile: result.update_profile || [],
        lmsTypeId: result.lms_type_id || -1,
        lmsUser: result.lms_user || false
      };
      store.set('TOKEN', user.jwtToken);
      store.set('REFRESH_TOKEN', user.refreshToken);
      store.set('USER_ID', user.userId);
      await dispatch(
        setUser({
          user
        })
      );
      await dispatch(
        campaignActions.requestCampaign({
          campaignId: LANDING_PAGE_CAMPAIGN,
          reset: true
        })
      );

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
      return dispatch(
        setError({
          title: 'Unknown error',
          body: 'Please contact us'
        })
      );
    }
  };
export const updateError =
  ({ title, body, action }: { title: string; body: string; action?: string }) =>
  async (dispatch: Dispatch) =>
    dispatch(
      setError({
        title,
        body,
        action
      })
    );
export const clearSignUpError = () => async (dispatch: Dispatch) => dispatch(clearError());
