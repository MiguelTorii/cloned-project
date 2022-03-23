import type { APIRecommendedPost } from './APIRecommendedPost';
import type { APITag } from './APITag';

export type APIPostMetaData = {
  recommended_posts: APIRecommendedPost[];
  tags: APITag[];
};
