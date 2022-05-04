import { objectToCamel } from 'ts-case-convert';

import { getChannelMetadata } from 'api/chat';

import type { APIChat } from 'api/models/APIChat';
import type { CamelCasedPropertiesDeep } from 'type-fest';

export type ChannelMetadata = CamelCasedPropertiesDeep<APIChat> & { showFirst?: boolean };

export type ParsedChannelMetadata = ChannelMetadata & {
  isDirectChat: boolean;
  isGroupChat: boolean;
  isOnline: boolean;
  name: string;
  otherUsers?: ChannelMetadata['users'];
  thumbnail: string;
  userLength?: number;
  lastMessageData?: ChannelMetadata['lastReceivedMessage'];
};

export type ChannelsMetadata = {
  [key: string]: ChannelMetadata;
};

export const getTransformedChannelsMetada = async () => {
  const chats = await getChannelMetadata();

  const local: ChannelsMetadata = {};

  for (const chat of chats) {
    local[chat.id] = objectToCamel(chat);
  }

  return local;
};
