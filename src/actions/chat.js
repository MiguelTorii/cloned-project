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

const requestStartChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName,
  entityUuid
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string,
  entityUuid: string
}): Action => ({
  type: chatActions.START_CHANNEL_WITH_ENTITY_REQUEST,
  payload: {
    entityId,
    entityFirstName,
    entityLastName,
    entityUuid
  }
});

export const openCreateChatGroup = () => async (dispatch: Dispatch) => {
  dispatch(requestOpenCreateChatGroupChannel({ uuid: uuidv4() }));
};

export const openChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string
}) => async (dispatch: Dispatch) => {
  dispatch(
    requestStartChannelWithEntity({
      entityId,
      entityFirstName,
      entityLastName,
      entityUuid: uuidv4()
    })
  );
};
