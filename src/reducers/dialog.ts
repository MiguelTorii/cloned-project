import update from 'immutability-helper';

import { dialogActions } from 'constants/action-types';

import type { Action } from 'types/action';
import type { TErrorModalData } from 'types/models';

export type DialogState = {
  visible: boolean | null;
  errorModal: TErrorModalData;
};

const defaultState = {
  visible: null,
  errorModal: null
};

export default (state: DialogState = defaultState, action: Action): DialogState => {
  switch (action.type) {
    case dialogActions.UPDATE_VISIBILITY:
      return update(state, {
        visible: {
          $set: action.payload.visible
        }
      });

    case dialogActions.SHOW_ERROR_MODAL: {
      return update(state, {
        errorModal: { $set: action.payload }
      });
    }

    case dialogActions.CLOSE_ERROR_MODAL: {
      return update(state, {
        errorModal: { $set: null }
      });
    }

    default:
      return state;
  }
};
