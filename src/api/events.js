// @flow

import axios from 'axios';
import { getToken } from './utils';

import { API_ROUTES } from '../constants/routes';
import reduxStore from '../configureStore';

const createEvent = async ({
  category,
  objectId,
  type,
  recommendationType,
  ...rest
}: {
  category: string,
  objectId: string,
  type: string
}): void => {
  if (reduxStore.getState().user.isMasquerading) return;

  try {
    const token = await getToken();

    axios.post(
      `${API_ROUTES.EVENTS}`,
      {
        category,
        object_id: objectId.toString(),
        recommendation_type: recommendationType,
        type,
        ...rest
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export default createEvent;
