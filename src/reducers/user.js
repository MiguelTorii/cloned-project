/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import { signInActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { User } from '../types/models';

export type UserState = {
  isLoading: boolean,
  data: User,
  error: boolean,
  errorMessage: {
    title: string,
    body: string
  }
};

const defaultState = {
  data: {
    userId: '',
    email: '',
    firstName: '',
    lastName: '',
    school: '',
    schoolId: 0,
    segment: '',
    twilioToken: '',
    canvasUser: false,
    grade: 0,
    jwtToken: '',
    refreshToken: '',
    profileImage: '',
    rank: 0,
    referralCode: '',
    updateProfile: []
  },
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: ''
  }
};

export default (state: UserState = defaultState, action: Action): UserState => {
  switch (action.type) {
    case signInActions.SIGN_IN_USER_REQUEST:
      return update(state, {
        data: { $set: defaultState.data },
        error: { $set: defaultState.error },
        errorMessage: { $set: defaultState.errorMessage },
        isLoading: { $set: true }
      });
    case signInActions.CHECK_USER_REQUEST:
      return update(state, {
        isLoading: { $set: true }
      });
    case signInActions.SIGN_IN_USER_SUCCESS:
      return update(state, {
        // $FlowFixMe
        data: { $set: action.payload.user },
        isLoading: { $set: false }
      });
    case signInActions.SIGN_IN_USER_ERROR:
      return update(state, {
        error: { $set: true },
        errorMessage: {
          // $FlowFixMe
          title: { $set: action.payload.title },
          // $FlowFixMe
          body: { $set: action.payload.body }
        },
        isLoading: { $set: false }
      });
    case signInActions.SIGN_IN_USER_CLEAR_ERROR:
      return update(state, {
        error: { $set: defaultState.error },
        errorMessage: { $set: defaultState.errorMessage }
      });
    case signInActions.SIGN_OUT_USER_REQUEST:
    case signInActions.SIGN_OUT_USER_SUCCESS:
    case rootActions.CLEAR_STATE:
      return defaultState;
    default:
      return state;
  }
};
