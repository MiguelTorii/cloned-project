import { APIChat } from 'api/models/APIChat';
import { ChatCommunityData } from 'api/models/APICommunity';
import { APICommunityChannel } from 'api/models/APICommunityChannel';
import { APICommunityChannelGroup } from 'api/models/APICommunityChannelGroup';
import { APICommunityChannelGroups } from 'api/models/APICommunityChannelGroups';
import DEFAULT_COMMUNITY_MENU_ITEMS from 'containers/CommunityChat/constants';
import { Classmate, ClassmateGroup } from 'types/models';
import { ChannelData, CommunityData } from './hudChatState';

export interface IBuiltCommunities {
  communityIdsInDisplayOrder: string[];
  idToCommunity: Record<string, CommunityData>;
}

export const buildCommunities = (communities: ChatCommunityData[]): IBuiltCommunities => {
  const communityIdsInDisplayOrder: string[] = [DEFAULT_COMMUNITY_MENU_ITEMS.id];

  const idToCommunity: Record<string, CommunityData> = {
    [DEFAULT_COMMUNITY_MENU_ITEMS.id]: {
      id: DEFAULT_COMMUNITY_MENU_ITEMS.id,
      displayName: DEFAULT_COMMUNITY_MENU_ITEMS.name,
      color: DEFAULT_COMMUNITY_MENU_ITEMS.color,
      iconUrl: DEFAULT_COMMUNITY_MENU_ITEMS.communityIconUrl,
      unreadCount: 0,
      channelIdsInDisplayOrder: [],
      memberIdsInDisplayOrder: [],
      idToMember: {}
    }
  };

  communities.forEach((community: ChatCommunityData) => {
    if (community) {
      const id = String(community.community.id);
      const communityData: CommunityData = {
        id: id,
        displayName: community.community.name,
        unreadCount: 0,
        channelIdsInDisplayOrder: [],
        memberIdsInDisplayOrder: [],
        idToMember: {}
      };
      idToCommunity[id] = communityData;
      communityIdsInDisplayOrder.push(id);
    }
  });

  return {
    communityIdsInDisplayOrder,
    idToCommunity
  };
};

export interface IBuiltChannels {
  idToChannel: Record<string, ChannelData>;
}

export const buildChannels = (
  directChats: APIChat[],
  communityChannelGroups: APICommunityChannelGroups[],
  communityMemberGroups: ClassmateGroup[],
  idToCommunity: Record<string, CommunityData>
): IBuiltChannels => {
  const idToChannel = {};

  communityChannelGroups.forEach((channelGroup: APICommunityChannelGroups) => {
    if (channelGroup) {
      channelGroup.community_channels.forEach((channels: APICommunityChannelGroup) => {
        if (channelGroup) {
          const communityId = String(channels.community_id);
          channels.channels.forEach((channel: APICommunityChannel) => {
            // Build the channel from the community channels data.
            const channelData: ChannelData = {
              id: channel.chat_id,
              isLoading: false,
              unreadCount: 0,
              displayName: channel.chat_name
            };
            idToChannel[channel.chat_id] = channelData;

            // Update the community so it can list its associated channels.
            const matchingCommunity: CommunityData = idToCommunity[communityId];
            if (matchingCommunity) {
              matchingCommunity.channelIdsInDisplayOrder.push(channelData.id);
            }
          });
        }
      });
    }
  });

  // Update the direct chat so it can list its associated channels.
  const directChatCommunity: CommunityData = idToCommunity[DEFAULT_COMMUNITY_MENU_ITEMS.id];
  directChats.forEach((directChat: APIChat) => {
    const channelData: ChannelData = {
      id: directChat.id,
      isLoading: false,
      unreadCount: 0,
      displayName: directChat.group_name
    };
    idToChannel[directChat.id] = channelData;

    directChatCommunity.channelIdsInDisplayOrder.push(directChat.id);
  });

  communityMemberGroups.forEach((memberGroup: ClassmateGroup) => {
    if (memberGroup) {
      const communityId = String(memberGroup.communityId);
      memberGroup.classmates.forEach((member: Classmate) => {
        if (member) {
          // Update the community so it can list its associated members.
          const matchingCommunity: CommunityData = idToCommunity[communityId];
          if (matchingCommunity) {
            matchingCommunity.idToMember[member.userId] = member;
            matchingCommunity.memberIdsInDisplayOrder.push(member.userId);
          }
        }
      });
    }
  });

  return {
    idToChannel
  };
};
