export type APICommunityData = {
  about: string;
  bg_color: string;
  class_id: number;
  community_banner_url: string;
  community_icon_url: string;
  created: string;
  id: number;
  name: string;
  private: boolean;
  school_id: number;
  section_id: number;
};

export type APICommunity = {
  community: APICommunityData;
  permissions: string[];
};
