import { APIFlashcard } from './APIFlashcard';
import { APINote } from './APINote';
import { APITag } from './APITag';
import { APIPostInfo } from './APIPostInfo';
import { APIComment } from './APIComment';

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
  deck: APIFlashcard[];
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
