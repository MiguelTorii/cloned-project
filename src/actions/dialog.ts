/* eslint-disable import/prefer-default-export */
import { dialogActions } from 'constants/action-types';
import type { Action } from 'types/action';
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
