// @flow
import axios from 'axios';
import store from 'store';
import decode from 'jwt-decode';
import moment from 'moment';
import { API_ROUTES } from '../constants/routes';
import type { Post, Comments } from '../types/models';

export const getToken = async (): Promise<string> => {
  const token = store.get('TOKEN');
  const refreshToken = store.get('REFRESH_TOKEN');
  const userId = store.get('USER_ID');
  const segment = store.get('SEGMENT');

  if (token) {
    const decoded = decode(token);
    const { exp } = decoded;
    const date = moment().subtract(2, 'minutes');
    if (exp > date.format('X')) {
      return token;
    }
  }
  if (segment === '' || userId === '' || refreshToken === '' || !userId) {
    return '';
  }
  const result = await axios.post(API_ROUTES.REFRESH, {
    user_id: Number(userId),
    token: refreshToken,
    segment
  });
  const { data = {} } = result;
  // eslint-disable-next-line camelcase
  const { jwt_token = '' } = data;
  // eslint-disable-next-line camelcase
  return jwt_token;
};

export const postToCamelCase = (post): Post => {
  return {
    body: String((post.body: string) || ''),
    bookmarked: Boolean((post.bookmarked: boolean) || false),
    classId: Number((post.class_id: number) || 0),
    classroomName: String((post.classroom_name: string) || ''),
    created: String((post.created: string) || ''),
    feedId: Number((post.feed_id: number) || 0),
    grade: Number((post.grade: number) || 0),
    inStudyCircle: Boolean((post.in_study_circle: boolean) || false),
    name: String((post.name: string) || ''),
    postId: Number((post.post_id: number) || 0),
    postInfo: {
      date: String((post.post_info.date: string) || ''),
      feedId: Number((post.post_info.feed_id: number) || 0),
      postId: Number((post.post_info.post_id: number) || 0),
      questionsCount: Number((post.post_info.questions_count: number) || 0),
      thanksCount: Number((post.post_info.thanks_count: number) || 0),
      userId: Number((post.post_info.user_id: number) || 0),
      viewCount: Number((post.post_info.view_count: number) || 0)
    },
    rank: Number((post.rank: number) || 0),
    reports: Number((post.reports: number) || 0),
    school: String((post.school: string) || ''),
    subject: String((post.subject: string) || ''),
    thanked: Boolean((post.thanked: boolean) || false),
    title: String((post.title: string) || ''),
    typeId: Number((post.type_id: number) || 0),
    userId: String((post.user_id: string) || ''),
    userProfileUrl: String((post.user_profile_url: string) || '')
  };
};

export const commentsToCamelCase = (comments): Comments => {
  return {
    parentCommentsCount: Number((comments.parent_comments_count: number) || 0),
    comments: (comments.comments || []).map(item => ({
      accepted: Boolean((item.accepted: boolean) || false),
      comment: String((item.comment: string) || ''),
      created: String((item.created: string) || ''),
      id: Number((item.id: number) || 0),
      parentCommentId: Number((item.parent_comment_id: number) || 0),
      reportsCount: Number((item.reports_count: number) || 0),
      rootCommentId: Number((item.root_comment_id: number) || 0),
      thanked: Boolean((item.thanked: boolean) || false),
      thanksCount: Number((item.thanks_count: number) || 0),
      user: {
        userId: String((item.user.user_id: string) || ''),
        firstName: String((item.user.first_name: string) || ''),
        lastName: String((item.user.last_name: string) || ''),
        profileImageUrl: String((item.user.profile_image_url: string) || ''),
        hours: Number((item.user.hours: number) || 0),
        joined: String((item.user.joined: string) || ''),
        rank: Number((item.user.rank: number) || 0),
        scholarshipPoints: Number((item.user.scholarship_points: number) || 0),
        schoolId: Number((item.user.school_id: number) || 0),
        state: String((item.user.state: string) || '')
      }
    }))
  };
};
