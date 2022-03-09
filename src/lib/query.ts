import { QueryCache, QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimize renders, has some caveats
      // https://tkdodo.eu/blog/react-query-render-optimizations#tracked-queries
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: false
    }
  }
});
export const queryCache = new QueryCache();
