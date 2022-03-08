import React, { FC, useCallback, useEffect, useState } from 'react';

import { POST_PREVIEW_INTERVAL } from 'constants/common';
import { logEventLocally } from 'api/analytics';
import { EVENT_TYPES, LOG_EVENT_CATEGORIES } from 'constants/app';

interface PostMonitorContextTypes {
  previewPost: (postId: number) => void;
}

const PostMonitorContext = React.createContext<PostMonitorContextTypes>({
  previewPost: () => {}
});

export const PostMonitorContextProvider: FC = ({ children }) => {
  const [, setPostIds] = useState<Array<number>>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPostIds((oldIds) => {
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

  const previewPost = useCallback((postId: number) => {
    setPostIds((oldIds) => [...oldIds, postId]);
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
