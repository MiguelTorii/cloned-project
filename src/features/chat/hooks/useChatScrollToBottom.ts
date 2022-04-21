import { useRef, useCallback, useLayoutEffect } from 'react';

import { usePrevious } from 'hooks';
import { useAppSelector } from 'redux/store';

import type { Message } from '@twilio/conversations';

export const useChatScrollToBottom = (messages?: Message[] | undefined) => {
  const ref = useRef<HTMLDivElement>(null);

  const userId = useAppSelector((state) => state.user.data.userId);
  const lastMessage = messages?.[messages?.length - 1];
  const previousLastMessage = usePrevious(lastMessage);

  const handleScrollToBottom = useCallback(() => {
    try {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'auto'
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [ref]);

  // On new message from the logged in user, scroll to bottom
  useLayoutEffect(() => {
    if (
      lastMessage &&
      previousLastMessage &&
      previousLastMessage !== lastMessage &&
      lastMessage.author === userId
    ) {
      handleScrollToBottom();
    }
  }, [handleScrollToBottom, lastMessage, previousLastMessage, userId]);

  return { ref, handleScrollToBottom };
};
