import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import reduxStore from 'redux/store';

import { getToken } from './utils';

const createEvent = async ({
  category,
  objectId,
  objectIds,
  messageIds,
  type,
  recommendationType,
  ...rest
}: {
  category: string;
  objectId: string;
  objectIds: Array<string> | Array<number>;
  messageIds: Array<string>;
  type: string;
  recommendationType: any;
}): Promise<void> => {
  if (reduxStore.getState().user.isMasquerading) {
    return;
  }

  const token = await getToken();
  axios.post(
    `${API_ROUTES.EVENTS}`,
    {
      category,
      object_id: objectId ? objectId.toString() : '',
      object_ids: objectIds,
      recommendation_type: recommendationType,
      message_ids: messageIds,
      type,
      ...rest
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export default createEvent;
