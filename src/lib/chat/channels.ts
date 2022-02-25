import { Channel, Client } from 'twilio-chat';
import { getChatClient, renewTokenAndGetClient } from './client';

let channels: Channel[] | undefined;

export const loadSubscribedChannels = async (client: Client) => {
  let paginator = await client.getSubscribedChannels();
  while (paginator.hasNextPage) {
    // eslint-disable-next-line no-await-in-loop
    paginator = await paginator.nextPage();
  }
};

export const loadClientAndChannels = async (userId: string) => {
  const client = await renewTokenAndGetClient(userId);
  await loadSubscribedChannels(client);
  const channels = await client.getLocalChannels({
    criteria: 'lastMessage',
    order: 'descending'
  });

  return { client, channels };
};

export const loadLocalChannels = async (userId: string) => {
  const client = await getChatClient(userId);
  const freshChannels = await client.getLocalChannels({
    criteria: 'lastMessage',
    order: 'descending'
  });

  channels = freshChannels;

  return freshChannels;
};

export const getLocalChannels = async (userId: string) =>
  channels ?? (await loadLocalChannels(userId));

export const getChannelBySid = async ({ userId, sid }: { userId: string; sid: string }) => {
  const channels = await getLocalChannels(userId);
  const channel = channels.find((channel) => channel.sid === sid);

  if (!channel) {
    const client = await getChatClient(userId);
    return await client.getChannelBySid(sid);
  }

  return channel;
};
