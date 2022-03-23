import retry from 'async-retry';
import { Client } from 'twilio-chat';

import { renewTwilioToken } from 'api/chat';

const CONNECTION_STATE_CONNECTED = 'connected';

let client: Client;

export const ensureChatClient = async (token: string): Promise<Client> =>
  await retry(
    async (_bail) => {
      if (isChatClientConnected()) {
        return client;
      }

      client = new Client(token, {
        logLevel: 'silent'
      });

      return new Promise<Client>((resolve, reject) => {
        client.on('stateChanged', (state) => {
          if (state === 'initialized') {
            resolve(client);
          }
          if (state === 'failed') {
            reject('Failed to initialize chat client');
          }
        });
      });
    },
    {
      retries: 5,
      maxTimeout: 2000
    }
  );

export const updateClientToken = async (token: string) => {
  const client = await ensureChatClient(token);
  await client.updateToken(token);
  return client;
};

export const renewTokenAndGetClient = async (userId: string): Promise<Client> => {
  const accessToken = await renewTwilioToken({ userId });
  const client = await updateClientToken(accessToken);

  return client;
};

export const getChatClient = (userId) =>
  isChatClientConnected() ? client : renewTokenAndGetClient(userId);

export const isChatClientConnected = (): boolean =>
  !!(client && client.connectionState === CONNECTION_STATE_CONNECTED);
