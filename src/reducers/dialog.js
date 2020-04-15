// @flow
import update from 'immutability-helper';
import { dialogActions } from 'constants/action-types';
import type { Action } from 'types/action';

export type DialogState = {
  visible: boolean
};

const defaultState = {
  visible: null
};

export default (state: DialogState = defaultState, action: Action): DialogState => {
  switch (action.type) {
  case dialogActions.UPDATE_VISIBILITY:
    return update(state, {
      visible: { $set: action.payload.visible }
    });
  default:
    return state;
  }
};
