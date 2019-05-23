/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Notifications } from '../types/models';
import { getToken } from './utils';

export const getNotifications = async ({
  userId,
  isStudyCircle
}: {
  userId: string,
  isStudyCircle?: boolean
}): Promise<Notifications> => {
  const token = await getToken();
  let type = '';
  if (isStudyCircle) type = 'study_circle=true';
  else type = 'device_id=1';
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
};
