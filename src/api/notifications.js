/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Notifications, CustomNotification } from '../types/models';
import { getToken } from './utils';

export const getNotifications = async ({
  userId,
  tab
}: {
  userId: string,
  tab?: number
}): Promise<Notifications> => {
  try {
    const token = await getToken();
    let type = '';
    if (tab === 1) type = 'recommended=true';
    if (tab === 2) type = 'announcement=true';
    const result = await axios.get(
      `${API_ROUTES.NOTIFICATIONS}/${userId}?${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;

    const notifications = (data.notifications || []).map(item => ({
      actorFirstName: String((item.actor_first_name: string) || ''),
      actorId: String((item.actor_id: string) || ''),
      actorLastName: String((item.actor_last_name: string) || ''),
      createdOn: String((item.created_on: string) || ''),
      entityId: Number((item.entity_id: number) || 0),
      entityType: Number((item.entity_type: number) || 0),
      feedPostTitle: String((item.feed_post_title: string) || ''),
      fileName: String((item.file_name: string) || ''),
      fullNoteUrl: String((item.full_note_url: string) || ''),
      id: Number((item.id: number) || 0),
      noteUrl: String((item.note_url: string) || ''),
      notificationText: String((item.notification_text: string) || ''),
      postId: Number((item.post_id: number) || 0),
      postTypeId: Number((item.post_type_id: number) || 0),
      deckSize: Number((item.deck_size: number) || 0),
      profileImageUrl: String((item.profile_image_url: string) || ''),
      state: Number((item.state: number) || 0)
    }));

    const unreadCount = Number((data.unread_count: number) || 0);

    return { notifications, unreadCount };
  } catch (err) {
    console.log(err);
    return { notifications: [], unreadCount: 0 };
  }
};

export const setNotificationsRead = async ({
  userId
}: {
  userId: string
}): Promise<Object> => {
  try {
    const token = await getToken();

    const result = await axios.post(
      `${API_ROUTES.NOTIFICATIONS}/${userId}/read/`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

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
  userId: string,
  id: number
}): Promise<CustomNotification> => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.NOTIFICATIONS}/${userId}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data } = result;
    return {
      title: String((data.title: string) || ''),
      body: String((data.body: string) || ''),
      details: String((data.details: string) || ''),
      created: String((data.created: string) || '')
    };
  } catch (err) {
    console.log(err);
    return { title: '', body: '', details: '', created: '' };
  }
};
