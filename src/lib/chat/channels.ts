import type { Client } from '@twilio/conversations';
import type { Channel } from 'types/models';

let channels: Channel[] | undefined;
let hasStartedPaginator = false;
let hasCompletedPaginator = false;

export const isPaginatorDone = () => hasStartedPaginator && hasCompletedPaginator;

export const loadSubscribedChannels = async (client: Client) => {
  hasStartedPaginator = true;
  let paginator = await client.getSubscribedConversations();
  let channels = paginator.items;

  while (paginator.hasNextPage) {
    // eslint-disable-next-line no-await-in-loop
    paginator = await paginator.nextPage();
    channels = channels.concat(paginator.items);
  }

  hasCompletedPaginator = true;
  return channels;
};

// Temporary, not using channels object and always pulling fresh ones
export const getChannelsFromClient = async (client?: Client) => {
  if (!client) {
    return Promise.reject(new Error('No chat client.'));
  }

  const channels = await loadSubscribedChannels(client);
  return channels;
};

export const getLastChannelsFromClient = () => channels;

export const getChannelBySid = async (id?: string, client?: Client) => {
  if (!id) {
    return Promise.reject(new Error('No ID provided.'));
  }

  const channels = getLastChannelsFromClient();
  const matchingChannel = channels?.find((channel) => channel.sid === id);

  if (!matchingChannel) {
    if (!client) {
      return Promise.reject(new Error('No chat client.'));
    }
    return await client.getConversationBySid(id);
  }

  return matchingChannel;
};

export const resetChannels = () => {
  channels = [];
  hasStartedPaginator = false;
  hasCompletedPaginator = false;
};
