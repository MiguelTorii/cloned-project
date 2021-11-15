import { Classmate } from '../../types/models';
import DEFAULT_COMMUNITY_MENU_ITEMS from '../../containers/CommunityChat/constants';

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
};

export const defaultState: HudChatState = {
  initialLoadTriggered: false,
  idToCommunity: {},
  communityIdsInDisplayOrder: [],
  selectedCommunityId: DEFAULT_COMMUNITY_MENU_ITEMS.id,
  idToChannel: {},
  selectedChannelId: ''
};
