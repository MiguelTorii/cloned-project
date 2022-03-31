import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import { EVENT_TYPES, LOG_EVENT_CATEGORIES } from 'constants/app';
import { MESSAGE_PREVIEW_INTERVAL } from 'constants/common';

import { logEventLocally } from 'api/analytics';

interface MessageMonitorContextInterface {
  previewMessage: (postId: string) => void;
}

const MessageMonitorContext = React.createContext<MessageMonitorContextInterface>({
  previewMessage: () => {}
});

export const MessageMonitorContextProvider: FC = ({ children }) => {
  const [, setMessageIds] = useState<Array<string>>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIds((oldIds) => {
        if (oldIds.length > 0) {
          logEventLocally({
            type: EVENT_TYPES.PREVIEWED,
            category: LOG_EVENT_CATEGORIES.CHAT,
            messageIds: oldIds
          });
        }

        return [];
      });
    }, MESSAGE_PREVIEW_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const previewMessage = useCallback((messageId: string) => {
    setMessageIds((oldIds) => [...oldIds, messageId]);
  }, []);

  return (
    <MessageMonitorContext.Provider
      value={{
        previewMessage
      }}
    >
      {children}
    </MessageMonitorContext.Provider>
  );
};

export const useMessageMonitor = () => React.useContext(MessageMonitorContext);
