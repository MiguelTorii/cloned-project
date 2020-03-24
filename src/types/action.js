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

export type UpdateClasses = {
  type: 'UPDATE_CLASSES',
  payload: {
    userClasses: {
      classNames: Array<string>,
      canAddClasses: boolean
    }
  }
};

export type UPDATE_CLASSES = {
  type: 'UPDATE_CLASSES',
  payload: {
    runningTour: boolean
  }
}

export type SignOutUserRequest = {
  type: 'SIGN_OUT_USER_REQUEST'
};

export type SignOutUserSuccess = {
  type: 'SIGN_OUT_USER_SUCCESS'
};

export type OpenCreateChatGroupChannelRequest = {
  type: 'OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST',
  payload: {
    stamp: string
  }
};

export type Action =
  | SignInUserRequest
  | SignInUserSuccess
  | SignInUserError
  | UpdateClasses
  | SignInUserClearError
  | CheckUserRequest
  | SignOutUserRequest
  | OpenCreateChatGroupChannelRequest
