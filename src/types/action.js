// @flow

import type { User } from './models';

export type SignInUserSuccess = {
  type: 'SIGN_IN_USER_SUCCESS',
  payload: {
    user: User
  }
};

export type OpenShareLink = {
  type: 'OPEN_SHARE_LINK',
  paylod: {
    userId: number,
    feedId: number
  }
};

export type CloseShareLink = {
  type: 'CLOSE_SHARE_LINK'
};

export type Action = SignInUserSuccess | OpenShareLink | CloseShareLink;
