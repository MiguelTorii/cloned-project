// @flow

import axios from 'axios';
import { getToken } from './utils';

import { API_ROUTES } from '../constants/routes';
import { isMasquerading } from '../utils/helpers';

const createEvent = async ({
  category,
  objectId,
  type,
  ...rest
}: {
  category: string,
  objectId: string,
  type: string
}): void => {

  // In case of masquerading, don't sent events
  if (isMasquerading()) return true;

  try {
    const token = await getToken();

    axios.post(
      `${API_ROUTES.EVENTS}`,
      {
        category,
        object_id: objectId.toString(),
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