import type { APICommentUser } from './APICommentUser';

export type APIComment = {
  accepted: boolean;
  comment: string;
  created: string;
  id: number;
  parent_comment_id: number;
  reports_count: number;
  root_comment_id: number;
  thanked: boolean;
  thanks_count: number;
  user: APICommentUser;
};
