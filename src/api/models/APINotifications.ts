import type { APINotification } from './APINotification';

export type APINotifications = {
  notifications: APINotification[];
  unread_count: number;
};
