/* eslint-disable import/prefer-default-export */
import { webNotificationsActions } from 'constants/action-types';

import type { Action } from 'types/action';
import type { Dispatch } from 'types/store';

const requestUpdateTitle = (): Action => ({
  type: webNotificationsActions.UPDATE_TITLE_REQUEST
});

const setTitle = ({ title, body }: { title: string; body: string }): Action => ({
  type: webNotificationsActions.UPDATE_TITLE_SUCCESS,
  payload: {
    title,
    body
  }
});

export const updateTitle =
  ({ title, body }: { title: string; body: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(requestUpdateTitle());
    dispatch(
      setTitle({
        title,
        body
      })
    );
  };
