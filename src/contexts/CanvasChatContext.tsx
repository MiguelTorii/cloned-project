import React, { createContext, useCallback, useMemo, useState } from 'react';

import { useChannelById } from 'features/chat';
import { useCommunities, useCommunityById } from 'features/chat/hooks/useCommunities';
import useParsedChannelMetadataById from 'features/chat/hooks/useParsedChannelMetadataById';

import type { ChatCommunityData } from 'api/models/APICommunity';
import type { ParsedChannelMetadata } from 'features/chat';
import type { Channel } from 'types/models';

const CanvasChatContext = createContext<{
  channel: Channel | null;
  channelMetadata: ParsedChannelMetadata | null;
  closeChannel: () => void;
  selectCommunity: (community: number) => void;
  selectChannel: (channel: string) => void;
  community: ChatCommunityData | null;
  isCommunityChat: boolean;
}>({
  isCommunityChat: false,
  community: null,
  channel: null,
  channelMetadata: null,
  closeChannel: () => {},
  selectChannel: () => {},
  selectCommunity: () => {}
});

type ProviderProps = {
  children: React.ReactNode;
};

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const { isCommunityChat: getIsCommunityChat } = useCommunities();
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);

  // Channel
  const { data: channel = null } = useChannelById(channelId || '');
  const { data: channelMetadata = null } = useParsedChannelMetadataById(channel?.sid);
  const closeChannel = useCallback(() => setChannelId(null), []);

  // Chat
  const community = useCommunityById(communityId) || null;
  const isCommunityChat = useMemo(
    () => getIsCommunityChat(communityId),
    [communityId, getIsCommunityChat]
  );
  return (
    <CanvasChatContext.Provider
      value={{
        channelMetadata,
        channel,
        closeChannel,
        selectChannel: setChannelId,
        selectCommunity: setCommunityId,
        community,
        isCommunityChat
      }}
    >
      {children}
    </CanvasChatContext.Provider>
  );
};

export default CanvasChatContext;
