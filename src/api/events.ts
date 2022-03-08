import axios from 'axios';
import { getToken } from './utils';
import { API_ROUTES } from '../constants/routes';
import reduxStore from 'redux/store';

const createEvent = async ({
  category,
  objectId,
  objectIds,
  type,
  recommendationType,
  ...rest
}: {
  category: string;
  objectId: string;
  objectIds: Array<string> | Array<number>;
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
