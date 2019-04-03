// @flow

import type { User } from './models';

export type SignInUserRequest = {
  type: 'SIGN_IN_USER_REQUEST'
};

export type SignInUserSuccess = {
  type: 'SIGN_IN_USER_SUCCESS',
  payload: {
    user: User
  }
};

export type SignInUserError = {
  type: 'SIGN_IN_USER_ERROR',
  payload: {
    title: string,
    body: string
  }
};

export type SignInUserClearError = {
  type: 'SIGN_IN_USER_CLEAR_ERROR'
};

export type CheckUserRequest = {
  type: 'CHECK_USER_REQUEST'
};

export type OpenShareLink = {
  type: 'OPEN_SHARE_LINK',
  payload: {
    userId: number,
    feedId: number
  }
};

export type CloseShareLink = {
  type: 'CLOSE_SHARE_LINK'
};

export type Action =
  | SignInUserRequest
  | SignInUserSuccess
  | SignInUserError
  | SignInUserClearError
  | CheckUserRequest
  | OpenShareLink
  | CloseShareLink;
