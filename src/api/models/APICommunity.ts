export type ChatCommunity = {
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
  active_course_community: boolean;
};

export type ChatCommunityData = {
  community: ChatCommunity;
  permissions: string[];
};
