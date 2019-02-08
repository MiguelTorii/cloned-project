// @flow

import type { Node } from 'react';
import { notificationsActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';

const open = ({ anchorEl }: { anchorEl: Node }): Action => ({
  type: notificationsActions.OPEN_NOTIFICATIONS,
  payload: {
    anchorEl
  }
});

const close = (): Action => ({
  type: notificationsActions.CLOSE_NOTIFICATIONS
});

export const openNotifications = ({ anchorEl }: { anchorEl: Node }) => async (
  dispatch: Dispatch
) => dispatch(open({ anchorEl }));

export const closeNotifications = () => async (dispatch: Dispatch) =>
  dispatch(close());
