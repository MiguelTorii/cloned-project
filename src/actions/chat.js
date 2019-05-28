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
  entityVideo,
  entityUuid
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string,
  entityVideo: boolean,
  entityUuid: string
}): Action => ({
  type: chatActions.START_CHANNEL_WITH_ENTITY_REQUEST,
  payload: {
    entityId,
    entityFirstName,
    entityLastName,
    entityVideo,
    entityUuid
  }
});

export const openCreateChatGroup = () => async (dispatch: Dispatch) => {
  dispatch(requestOpenCreateChatGroupChannel({ uuid: uuidv4() }));
};

export const openChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName,
  entityVideo
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string,
  entityVideo: boolean
}) => async (dispatch: Dispatch) => {
  dispatch(
    requestStartChannelWithEntity({
      entityId,
      entityFirstName,
      entityLastName,
      entityVideo,
      entityUuid: uuidv4()
    })
  );
};
