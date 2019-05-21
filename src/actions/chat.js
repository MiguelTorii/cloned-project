/* eslint-disable import/prefer-default-export */
// @flow

import uuidv4 from 'uuid/v4';
import { chatActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';

const requestOpenCreateChatGroupChannel = ({
  uuid
}: {
  uuid: string
}): Action => ({
  type: chatActions.OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST,
  payload: {
    uuid
  }
});

export const openCreateChatGroup = () => async (dispatch: Dispatch) => {
  dispatch(requestOpenCreateChatGroupChannel({ uuid: uuidv4() }));
};
