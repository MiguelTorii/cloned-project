import { useEffect, useState, useMemo } from 'react';

import { formatDistance } from 'date-fns';

const useTimeAgo = (time: Date | string | number, refreshTime: number): string => {
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  useEffect(() => {
    if (!refreshTime) return;
    const timeout = setTimeout(() => {
      setLastRefreshTime(Date.now());
    }, refreshTime);

    return () => clearTimeout(timeout);
  }, [refreshTime]);

  const timeAgo = useMemo(
    () => formatDistance(new Date(time), new Date(lastRefreshTime)),
    [lastRefreshTime, time]
  );

  return timeAgo;
};

export default useTimeAgo;
