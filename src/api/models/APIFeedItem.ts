import type { APIComment } from './APIComment';
import type { APINote } from './APINote';
import type { APIPostInfo } from './APIPostInfo';
import type { APITag } from './APITag';

export type APIFeedItem = {
  user_id: number;
  type_id: number;
  pages_notes: number;
  feed_id: number;
  post_id: number;
  role_id: number;
  role: string;
  course_display_name: string;
  bookmarked: boolean;
  deck_count: number;
  note_url: string;
  name: string;
  created: string;
  user_profile_url: string;
  rank: number;
  subject: string;
  classroom_name: string;
  class_id: number;
  title: string;
  body: string;
  read_only: boolean;
  post_info: APIPostInfo;
  tags: Array<APITag>;
  uri: string;
  notes: APINote[];
  best_answer: boolean;
  thanked: boolean;
  is_online: boolean;
};

export type APIFeedItemV2 = {
  0: APIFeedItem;
  1: APIComment;
};
