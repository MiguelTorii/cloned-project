import { Client, Channel } from 'twilio-chat';
import { updateToken } from 'utils/chat';
import { renewTwilioToken } from '../../api/chat';

const CONNECTION_STATE_CONNECTED = 'connected';

export const loadChatClient = async (userId: string): Promise<Client> => {
  const accessToken = await renewTwilioToken({
    userId
  });

  const client = await updateToken(accessToken);

  return client;
};

export const loadSubscribedChannels = async (client: Client) => {
  let paginator = await client.getSubscribedChannels();
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
