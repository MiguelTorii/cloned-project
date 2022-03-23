import type { APIChatUser } from './APIChatUser';

export type APIChat = {
  id: string;
  group_name: string;
  is_muted: boolean;
  last_received_message: LastReceivedMessage;
  section_id?: number;
  thumbnail: string;
  users: APIChatUser[];
};

export interface LastReceivedMessage {
  date_sent: string;
  message: string;
  user: APIChatUser;
}
