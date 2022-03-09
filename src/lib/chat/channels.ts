import { Channel, Client } from 'twilio-chat';
import { waitUntil } from 'utils/helpers';

let channels: Channel[] | undefined;
let hasStartedPaginator = false;
let hasCompletedPaginator = false;

export const isPaginatorDone = () => hasStartedPaginator && hasCompletedPaginator;

export const loadSubscribedChannels = async (client: Client) => {
  hasStartedPaginator = true;
  let paginator = await client.getSubscribedChannels();
  while (paginator.hasNextPage) {
    // eslint-disable-next-line no-await-in-loop
    paginator = await paginator.nextPage();
  }
  hasCompletedPaginator = true;
};

// Temporary, not using channels object and always pulling fresh ones
export const getChannelsFromClient = async (client?: Client) => {
  if (!client) {
    return Promise.reject(new Error('No chat client.'));
  }
  if (!hasStartedPaginator || !channels) {
    await loadSubscribedChannels(client);
  }
  // If a query tries to fetch channels concurrently, when paginator has started but not completed
  if (hasStartedPaginator && !hasCompletedPaginator) {
    await waitUntil(isPaginatorDone);
  }
  const freshChannels = await client.getLocalChannels({
    criteria: 'lastMessage',
    order: 'descending'
  });

  channels = freshChannels;

  return freshChannels;
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
    return await client.getChannelBySid(id);
  }

  return matchingChannel;
};

export const resetChannels = () => {
  channels = [];
  hasStartedPaginator = false;
  hasCompletedPaginator = false;
};
