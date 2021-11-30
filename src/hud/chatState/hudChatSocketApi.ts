import Chat, { Client } from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel';
import { Paginator } from 'twilio-chat/lib/interfaces/paginator';
import { renewTwilioToken } from '../../api/chat';

const CONNECTION_STATE_CONNECTED = 'connected';

export const loadChatClient = async (userId: string): Promise<Client> => {
  const accessToken = await renewTwilioToken({
    userId
  });

  const client: Client = await Chat.create(accessToken, {
    logLevel: 'silent'
  });

  return client;
};

export const loadSubscribedChannels = async (client: Client) => {
  let paginator: Paginator<Channel> = await client.getSubscribedChannels();
  while (paginator.hasNextPage) {
    // eslint-disable-next-line no-await-in-loop
    paginator = await paginator.nextPage();
  }
};

export const loadLocalChannels = async (client: Client) => {
  const channels: Channel[] = await client.getLocalChannels({
    criteria: 'lastMessage',
    order: 'descending'
  });

  return channels;
};

export const isChatClientConnected = (client: Client): boolean =>
  !!(client && client.connectionState === CONNECTION_STATE_CONNECTED);
