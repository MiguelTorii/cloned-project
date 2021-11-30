import { APIChatUser } from './APIChatUser';

export type APIChat = {
  group_name: string;
  id: string;
  is_muted: boolean;
  last_received_message: {
    date_sent: string;
    message: string;
    user: APIChatUser;
  };
  users: APIChatUser[];
};
