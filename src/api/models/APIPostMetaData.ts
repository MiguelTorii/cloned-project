import { APIRecommendedPost } from './APIRecommendedPost';
import { APITag } from './APITag';

export type APIPostMetaData = {
  recommended_posts: APIRecommendedPost[];
  tags: APITag[];
};
