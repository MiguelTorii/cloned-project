import type { APIComment } from './APIComment';

export type APIComments = {
  parent_comments_count: number;
  comments: APIComment[];
};
