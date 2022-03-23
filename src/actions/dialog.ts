/* eslint-disable import/prefer-default-export */
import { dialogActions } from 'constants/action-types';

import type { Action } from 'types/action';
import type { TErrorModalData } from 'types/models';
import type { Dispatch } from 'types/store';

const updateVisibilityAction = (visible: boolean): Action => ({
  type: dialogActions.UPDATE_VISIBILITY,
  payload: {
    visible
  }
});

export const updateVisibility = (visible: boolean) => async (dispatch: Dispatch) => {
  dispatch(updateVisibilityAction(visible));
};

export const showErrorModal = (data: TErrorModalData) => ({
  type: dialogActions.SHOW_ERROR_MODAL,
  payload: data
});

export const closeErrorModal = () => ({
  type: dialogActions.CLOSE_ERROR_MODAL
});
