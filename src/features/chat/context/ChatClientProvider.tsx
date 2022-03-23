import { useMemo, createContext, useState, useEffect, useCallback, useContext } from 'react';
import retry from 'async-retry';
import { Client } from 'twilio-chat';

import { renewTwilioToken } from 'api/chat';
import { usePrevious } from 'hooks';
import { useAppSelector } from 'redux/store';

type ClientContext = Client | undefined;

const CONNECTION_STATE_CONNECTED = 'connected';

export const isChatClientConnected = (client?: Client): boolean =>
  !!(client?.connectionState === CONNECTION_STATE_CONNECTED);

const useValue = (userId: string): ClientContext => {
  const [client, setClient] = useState<Client>();
  const prevToken = usePrevious(userId);

  const ensureChatClient = useCallback(
    async (token: string) =>
      await retry(
        async (_bail) => {
          if (isChatClientConnected(client)) {
            return client;
          }
          const newClient = new Client(token, {
            logLevel: 'silent'
          });
          return new Promise<Client>((resolve, reject) => {
            if (isChatClientConnected(client)) {
              return client;
            }
            newClient.on('stateChanged', (state) => {
              if (state === 'initialized') {
                resolve(newClient);
              }
              if (state === 'failed') {
                reject('Failed to initialize chat client');
              }
            });
          });
        },
        {
          retries: 5,
          maxTimeout: 1500
        }
      ),
    [client]
  );

  useEffect(() => {
    if (isChatClientConnected(client) || !userId || userId === prevToken) {
      return;
    }
    renewTwilioToken(userId)
      .then(ensureChatClient)
      .then((newClient) => {
        setClient(newClient);
      });
  }, [client, ensureChatClient, prevToken, userId]);

  const value = useMemo(() => client, [client]);

  return value;
};

export const ChatClientContext = createContext({} as ReturnType<typeof useValue>);
export const useChatClient = () => useContext(ChatClientContext);

export const ChatClientProvider = ({ children }) => {
  const userId = useAppSelector((state) => state.user.data.userId);

  const value = useValue(userId);

  return <ChatClientContext.Provider value={value}>{children}</ChatClientContext.Provider>;
};

export default ChatClientProvider;
