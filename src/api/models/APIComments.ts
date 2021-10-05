import { APIComment } from './APIComment';

export type APIComments = {
  parent_comments_count: number;
  comments: APIComment[];
};
