import { Client, ReplayEventEmitter } from 'twilio-chat';

type NotInEventEmitter<T> = Omit<T, keyof Omit<T, keyof ReplayEventEmitter<{}>>>;

declare module 'twilio-chat' {
  type KeyOfChannelEvents = Parameters<NotInEventEmitter<Channel>['on']>[0];
  type KeyOfClientEvents = Parameters<NotInEventEmitter<Client>['on']>[0];

  type AttributeUser = {
    userId: number;
    firstName: string;
    lastName: string;
  };
  interface Channel {
    attributes: {
      friendlyName: '';
      groupType: '';
      thumbnail: '';
      users: AttributeUser[];
    };
  }
}
