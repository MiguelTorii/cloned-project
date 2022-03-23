import type { Client } from 'twilio-chat';
import type { Classmate } from 'types/models';

export type ChannelData = {
  id: string;
  isLoading: boolean;
  unreadCount: number;
  displayName: string;
  error?: {
    title: string;
    body: string;
  };
};

export type CommunityData = {
  id: string;
  displayName: string;
  iconUrl?: string;
  color?: string;
  unreadCount: number;
  channelIdsInDisplayOrder: string[];
  memberIdsInDisplayOrder: string[];
  idToMember: Record<string, Classmate>;
};

export type HudChatState = {
  initialLoadTriggered: boolean;
  idToCommunity: Record<string, CommunityData>;
  communityIdsInDisplayOrder: string[];
  selectedCommunityId: string;
  idToChannel: Record<string, ChannelData>;
  selectedChannelId: string;
  socketClient: Client | null;
};

export const defaultState: HudChatState = {
  initialLoadTriggered: false,
  idToCommunity: {},
  communityIdsInDisplayOrder: [],
  selectedCommunityId: '',
  idToChannel: {},
  selectedChannelId: '',
  socketClient: null
};
