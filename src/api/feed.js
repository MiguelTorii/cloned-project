// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Feed } from '../types/models';
import { getToken } from './utils';

export const fetchFeed = async ({
  userId
}: {
  userId: string
}): Promise<Feed> => {
  // https://dev-api.circleinapp.com/v1/feed/383630?index=0&limit=50&school_id=40554
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.FEED}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { posts }
  } = result;

  const feed = posts.map(item => ({
    userId: String((item.user_id: string) || ''),
    typeId: Number((item.type_id: number) || 0),
    feedId: Number((item.feed_id: number) || 0),
    postId: Number((item.post_id: number) || 0),
    bookmarked: Boolean((item.bookmarked: boolean) || false),
    deck: item.deck || [],
    noteUrl: String((item.note_url: string) || ''),
    name: String((item.name: string) || ''),
    created: String((item.created: string) || ''),
    userProfileUrl: String((item.user_profile_url: string) || ''),
    rank: Number((item.rank: number) || 0),
    classroomName: String((item.classroom_name: string) || ''),
    title: String((item.title: string) || ''),
    postInfo: {
      date: String((item.post_info.date: string) || ''),
      feedId: Number((item.post_info.feed_id: number) || 0),
      postId: Number((item.post_info.post_id: number) || 0),
      questionsCount: Number((item.post_info.questions_count: number) || 0),
      thanksCount: Number((item.post_info.thanks_count: number) || 0),
      userId: String((item.post_info.user_id: string) || ''),
      viewCount: Number((item.post_info.view_count: number) || 0)
    }
  }));

  return feed;
};

export const asd = 'asd';
