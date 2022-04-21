import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import { EVENT_TYPES, LOG_EVENT_CATEGORIES } from 'constants/app';
import { POST_PREVIEW_INTERVAL } from 'constants/common';

import { logEventLocally } from 'api/analytics';

interface PostMonitorContextTypes {
  previewPost: (feedId: number) => void;
}

const PostMonitorContext = React.createContext<PostMonitorContextTypes>({
  previewPost: () => {}
});

export const PostMonitorContextProvider: FC = ({ children }) => {
  const [, setFeedIds] = useState<Array<number>>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFeedIds((oldIds) => {
        if (oldIds.length > 0) {
          logEventLocally({
            type: EVENT_TYPES.PREVIEWED,
            category: LOG_EVENT_CATEGORIES.POST,
            objectIds: oldIds
          });
        }

        return [];
      });
    }, POST_PREVIEW_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const previewPost = useCallback((feedId: number) => {
    setFeedIds((oldIds) => [...oldIds, feedId]);
  }, []);

  return (
    <PostMonitorContext.Provider
      value={{
        previewPost
      }}
    >
      {children}
    </PostMonitorContext.Provider>
  );
};

export const usePostMonitor = () => React.useContext(PostMonitorContext);
