import { getCommunityChannels } from 'api/community';
import { APICommunityChannelGroups } from 'api/models/APICommunityChannelGroups';
import { ChatCommunityData } from 'api/models/APICommunity';
import { getCommunityMembers } from 'api/chat';
import { Classmate, ClassmateGroup } from 'types/models';

export const fetchCommunityChannels = (
  communities: ChatCommunityData[]
): Promise<APICommunityChannelGroups[]> => {
  const promises: Promise<APICommunityChannelGroups>[] = communities.map(
    (community: ChatCommunityData) =>
      getCommunityChannels({
        communityId: community.community.id
      })
  );

  return Promise.all(promises);
};

export const fetchCommunityMembers = (
  communities: ChatCommunityData[]
): Promise<ClassmateGroup[]> => {
  const promises: Promise<ClassmateGroup>[] = communities.map((community: ChatCommunityData) =>
    getCommunityMembers({
      classId: community.community.class_id,
      sectionId: community.community.section_id
    }).then((classmates: Classmate[]) => ({
      communityId: community.community.id,
      classmates
    }))
  );

  return Promise.all(promises);
};
