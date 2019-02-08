// @flow

import { feedActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import { fetchFeed } from '../api/feed';

const requestFetch = (): Action => ({
  type: feedActions.FETCH_FEED_REQUEST
});

const storeFeed = ({ items }: { items: Array<Object> }): Action => ({
  type: feedActions.FETCH_FEED_SUCCESS,
  payload: {
    items
  }
});

export const fetchUserFeed = ({ userId }: { userId: number }) => async (
  dispatch: Dispatch
) => {
  dispatch(requestFetch());
  const items = await fetchFeed({ userId });
  dispatch(storeFeed({ items }));
};

export const hola = 'hola';
