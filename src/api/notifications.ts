/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Notifications, CustomNotification } from '../types/models';
import { getToken } from './utils';
import { APINotifications } from './models/APINotifications';
import { APINotification } from './models/APINotification';

export const getNotifications = async ({
  userId,
  tab
}: {
  userId: string;
  tab?: number;
}): Promise<Notifications> => {
  try {
    const token = await getToken();
    let type = '';

    if (tab === 1) {
      type = 'recommended=true';
    }

    if (tab === 2) {
      type = 'announcement=true';
    }

    const result: { data: APINotifications } = await axios.get(
      `${API_ROUTES.NOTIFICATIONS}/${userId}?${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;
    const notifications = data.notifications.map((item: APINotification) => ({
      actorFirstName: item.actor_first_name || '',
      actorId: item.actor_id || '',
      actorLastName: item.actor_last_name || '',
      createdOn: item.created_on || '',
      entityId: item.entity_id || 0,
      entityType: item.entity_type || 0,
      feedPostTitle: item.feed_post_title || '',
      fileName: item.file_name || '',
      fullNoteUrl: item.full_note_url || '',
      id: item.id || 0,
      noteUrl: item.note_url || '',
      notificationText: item.notification_text || '',
      postId: item.post_id || 0,
      postTypeId: item.post_type_id || 0,
      deckSize: item.deck_size || 0,
      profileImageUrl: item.profile_image_url || '',
      state: item.state || 0
    }));
    const unreadCount = data.unread_count || 0;
    return {
      notifications,
      unreadCount
    };
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      window.location.href = '/auth';
    }

    return {
      notifications: [],
      unreadCount: 0
    };
  }
};
export const setNotificationsRead = async ({
  userId
}: {
  userId: string;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.NOTIFICATIONS}/${userId}/read/`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;
    return data;
  } catch (err) {
    return {};
  }
};
export const getNotification = async ({
  userId,
  id
}: {
  userId: string;
  id: number;
}): Promise<CustomNotification> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.NOTIFICATIONS}/${userId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;
    return {
      title: data.title || '',
      body: data.body || '',
      details: data.details || '',
      created: data.created || ''
    };
  } catch (err) {
    console.log(err);
    return {
      title: '',
      body: '',
      details: '',
      created: ''
    };
  }
};
export const postPing = async (): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    await axios.post(
      `${API_ROUTES.PING}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return {};
  } catch (err) {
    console.log(err);
    return {};
  }
};
