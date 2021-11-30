import { getCommunityChannels } from '../../api/community';
import { APICommunityChannelGroups } from '../../api/models/APICommunityChannelGroups';
import { APICommunity } from '../../api/models/APICommunity';
import { getCommunityMembers } from '../../api/chat';
import { Classmate, ClassmateGroup } from '../../types/models';

export const fetchCommunityChannels = (
  communities: APICommunity[]
): Promise<APICommunityChannelGroups[]> => {
  const promises: Promise<APICommunityChannelGroups>[] = communities.map(
    (community: APICommunity) =>
      getCommunityChannels({
        communityId: community.community.id
      })
  );

  return Promise.all(promises);
};

export const fetchCommunityMembers = (communities: APICommunity[]): Promise<ClassmateGroup[]> => {
  const promises: Promise<ClassmateGroup>[] = communities.map((community: APICommunity) =>
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
