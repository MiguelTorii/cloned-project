import { getChannelMetadata } from 'api/chat';
import { APIChat } from 'api/models/APIChat';
import { objectToCamel } from 'ts-case-convert';
import { CamelCasedPropertiesDeep } from 'type-fest';

export type ChannelMetadata = CamelCasedPropertiesDeep<APIChat> & { showFirst?: boolean };

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
