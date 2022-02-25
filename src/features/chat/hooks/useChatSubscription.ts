import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export const useChatSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const websocket = new WebSocket('wss://echo.websocket.org/');
    websocket.onopen = () => {
      console.log('connected');
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const queryKey = [...data.entity, data.id].filter(Boolean);
      queryClient.invalidateQueries(queryKey);
    };

    return () => {
      websocket.close();
    };
  }, [queryClient]);
};
