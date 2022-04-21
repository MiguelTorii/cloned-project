import type { Client, ReplayEventEmitter } from '@twilio/conversations';

type NotInEventEmitter<T> = Omit<T, keyof Omit<T, keyof ReplayEventEmitter<{}>>>;

declare module '@twilio/conversations' {
  type KeyOfChannelEvents = Parameters<NotInEventEmitter<Conversation>['on']>[0];
  type KeyOfClientEvents = Parameters<NotInEventEmitter<Client>['on']>[0];

  type AttributeUser = {
    userId: number;
    firstName: string;
    lastName: string;
  };
  interface Conversation {
    attributes: {
      friendlyName: '';
      groupType: '';
      thumbnail: '';
      users: AttributeUser[];
      community_id: string | number;
    };
  }
}
