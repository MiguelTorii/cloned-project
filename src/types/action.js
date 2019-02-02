// @flow

import type { User } from './models';

export type SignInUserSuccess = {
  type: 'SIGN_IN_USER_SUCCESS',
  payload: {
    user: User
  }
};

export type Action = SignInUserSuccess;
