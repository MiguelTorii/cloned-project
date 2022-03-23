import { useQuery } from 'react-query';

import { getShareLink } from 'api/chat';

export const SHARE_LINK_KEY = 'shareLink';
export const useChatShareLink = (chatId: string) =>
  useQuery([SHARE_LINK_KEY, chatId], () => getShareLink(chatId), {
    enabled: Boolean(chatId),
    select: (data) => `${window.location.origin}/chat/s/${data}`
  });
