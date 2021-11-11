import { APICommunityChannel } from './APICommunityChannel';

export type APICommunityChannelGroup = {
  channels: APICommunityChannel[];
  community_id: number;
  created: string;
  id: number;
  name: string;
  private: boolean;
};
