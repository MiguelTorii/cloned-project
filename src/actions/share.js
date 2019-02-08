// @flow

import { shareActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';

const open = ({
  userId,
  feedId
}: {
  userId: number,
  feedId: number
}): Action => ({
  type: shareActions.OPEN_SHARE_LINK,
  payload: {
    userId,
    feedId
  }
});

const close = (): Action => ({
  type: shareActions.CLOSE_SHARE_LINK
});

export const openShareDialog = ({
  userId,
  feedId
}: {
  userId: number,
  feedId: number
}) => async (dispatch: Dispatch) => dispatch(open({ userId, feedId }));

export const closeShareDialog = () => async (dispatch: Dispatch) =>
  dispatch(close());
