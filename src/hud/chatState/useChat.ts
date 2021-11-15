import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch, combineReducers } from 'redux';
import { getCommunities, getCommunityChannels } from '../../api/community';
import { APICommunities } from '../../api/models/APICommunities';
import { APICommunityChannelGroups } from '../../api/models/APICommunityChannelGroups';
import { APICommunity } from '../../api/models/APICommunity';
import {
  buildChannels,
  buildCommunities,
  IBuiltChannels,
  IBuiltCommunities
} from './chatDataBuilder';
import { getCommunityMembers } from '../../api/chat';
import { Classmate, ClassmateGroup } from '../../types/models';
import { setCommunitiesAndChannels, startChatLoad } from './hudChatActions';
import { HudChatState } from './hudChatState';

export interface IChatLoadOptions {
  channelId: string;
}

const triggerLoadChat = async (dispatch: Dispatch<Action>) => {
  dispatch(startChatLoad());
  const { communities }: APICommunities = await getCommunities();
  const builtCommunities: IBuiltCommunities = buildCommunities(communities);

  const [channelGroups, memberGroups]: [APICommunityChannelGroups[], ClassmateGroup[]] =
    await Promise.all([fetchCommunityChannels(communities), fetchCommunityMembers(communities)]);

  const builtChannels: IBuiltChannels = buildChannels(
    channelGroups,
    memberGroups,
    builtCommunities.idToCommunity
  );

  dispatch(setCommunitiesAndChannels(builtCommunities, builtChannels));
};

const fetchCommunityChannels = (
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

const fetchCommunityMembers = (communities: APICommunity[]): Promise<ClassmateGroup[]> => {
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

const useChat = () => {
  const dispatch: Dispatch<Action> = useDispatch();

  const initialLoadTriggered: boolean = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.initialLoadTriggered
  );

  const loadChat = () => {
    if (!initialLoadTriggered) {
      triggerLoadChat(dispatch);
    }
  };

  return {
    loadChat
  };
};

export default useChat;
