import { getAPIChats } from 'api/chat';
import { APIChat } from 'api/models/APIChat';
import { objectToCamel } from 'ts-case-convert';
import { CamelCasedPropertiesDeep } from 'type-fest';

export type TransformedChannel = CamelCasedPropertiesDeep<APIChat>;

export type TransformedChannels = {
  [key: string]: TransformedChannel;
};

export const getTransformedAPIChannels = async () => {
  const chats = await getAPIChats();

  const local: TransformedChannels = {};

  for (const chat of chats) {
    local[chat.id] = objectToCamel(chat);
  }

  return local;
};
