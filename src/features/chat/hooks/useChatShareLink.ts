import { getShareLink } from 'api/chat';
import { useQuery } from 'react-query';

export const SHARE_LINK_KEY = 'shareLink';
export const useChatShareLink = (chatId: string) =>
  useQuery([SHARE_LINK_KEY, chatId], () => getShareLink(chatId), { enabled: Boolean(chatId) });
