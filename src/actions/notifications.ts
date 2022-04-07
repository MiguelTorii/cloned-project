/* eslint-disable import/prefer-default-export */
import uuidV4 from 'uuid/v4';

import { notificationsActions } from 'constants/action-types';

import type { Action } from 'types/action';
import type { Dispatch } from 'types/store';

const enqueueSnackbarRequest = ({ notification }): Action => ({
  type: notificationsActions.ENQUEUE_SNACKBAR_REQUEST,
  payload: {
    notification
  }
});

const closeSnackbarRequest = (key): Action => ({
  type: notificationsActions.CLOSE_SNACKBAR_REQUEST,
  payload: {
    dismissAll: !key,
    key
  }
});

const removeSnackbarRequest = (key): Action => ({
  type: notificationsActions.REMOVE_SNACKBAR_REQUEST,
  payload: {
    key
  }
});

export const enqueueSnackbar =
  ({ notification }: { notification: Record<string, any> }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      enqueueSnackbarRequest({
        notification: { ...notification, key: uuidV4() }
      })
    );
  };
export const showNotification = ({
  message,
  nextPath,
  variant = 'info',
  vertical = 'bottom',
  horizontal = 'left',
  autoHideDuration = 7000
}: {
  message: string;
  nextPath?: string;
  variant: string;
  vertical?: string;
  horizontal?: string;
  autoHideDuration?: number;
}) =>
  enqueueSnackbar({
    notification: {
      message,
      nextPath,
      options: {
        variant,
        anchorOrigin: {
          vertical,
          horizontal
        },
        autoHideDuration
      }
    }
  });

export const closeSnackbar = (key) => async (dispatch: Dispatch) => {
  dispatch(closeSnackbarRequest(key));
};

export const removeSnackbar = (key) => async (dispatch: Dispatch) => {
  dispatch(removeSnackbarRequest(key));
};
