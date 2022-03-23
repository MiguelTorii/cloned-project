import update from 'immutability-helper';

import { rootActions, authActions } from 'constants/action-types';

import type { Action } from 'types/action';
import type { School, ReferralData } from 'types/models';

export type AuthState = {
  data: {
    school: School | null;
    role: string;
  };
  error: boolean;
  errorMessage: {
    title: string;
    body: string;
  };
  isLoading: boolean;
  referralData: ReferralData | null;
};

const defaultState = {
  data: {
    school: null,
    role: 'student'
  },
  error: false,
  errorMessage: {
    title: '',
    body: ''
  },
  isLoading: false,
  referralData: null
};

export default (state: AuthState = defaultState, action: Action): AuthState => {
  switch (action.type) {
    case authActions.UPDATE_AUTH_ROLE:
      return update(state, {
        data: {
          role: {
            $set: action.payload.role
          }
        }
      });

    case authActions.UPDATE_AUTH_SCHOOL_REQUEST:
      return update(state, {
        data: {
          school: {
            $set: action.payload.school
          }
        }
      });

    case authActions.UPDATE_REFERRAL_DATA:
      return update(state, {
        referralData: {
          $set: action.payload.referralData
        }
      });

    case rootActions.CLEAR_STATE:
      return defaultState;

    default:
      return state;
  }
};
