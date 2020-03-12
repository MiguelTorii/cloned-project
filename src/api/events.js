// @flow

import axios from 'axios';
import { getToken } from './utils';

import { API_ROUTES } from '../constants/routes';

const createEvent = async ({
  category,
  objectId,
  type,
}: {
  category: string,
  objectId: string,
  type: string,
}) : void => {
  try {
    const token = await getToken();

    axios.post(
      `${API_ROUTES.EVENTS}`,
      {
        category,
        object_id: objectId.toString(),
        type,
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