/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { API_ROUTES } from "../constants/routes";
import type { Notifications, CustomNotification } from "../types/models";
import { getToken } from "./utils";
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

    const result = await axios.get(`${API_ROUTES.NOTIFICATIONS}/${userId}?${type}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const notifications = (data.notifications || []).map(item => ({
      actorFirstName: String((item.actor_first_name as string) || ''),
      actorId: String((item.actor_id as string) || ''),
      actorLastName: String((item.actor_last_name as string) || ''),
      createdOn: String((item.created_on as string) || ''),
      entityId: Number((item.entity_id as number) || 0),
      entityType: Number((item.entity_type as number) || 0),
      feedPostTitle: String((item.feed_post_title as string) || ''),
      fileName: String((item.file_name as string) || ''),
      fullNoteUrl: String((item.full_note_url as string) || ''),
      id: Number((item.id as number) || 0),
      noteUrl: String((item.note_url as string) || ''),
      notificationText: String((item.notification_text as string) || ''),
      postId: Number((item.post_id as number) || 0),
      postTypeId: Number((item.post_type_id as number) || 0),
      deckSize: Number((item.deck_size as number) || 0),
      profileImageUrl: String((item.profile_image_url as string) || ''),
      state: Number((item.state as number) || 0)
    }));
    const unreadCount = Number((data.unread_count as number) || 0);
    return {
      notifications,
      unreadCount
    };
  } catch (err) {
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
    const {
      data
    } = result;
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
    const {
      data
    } = result;
    return {
      title: String((data.title as string) || ''),
      body: String((data.body as string) || ''),
      details: String((data.details as string) || ''),
      created: String((data.created as string) || '')
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
    await axios.post(`${API_ROUTES.PING}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return {};
  } catch (err) {
    console.log(err);
    return {};
  }
};