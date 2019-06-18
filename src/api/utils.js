// @flow
import axios from 'axios';
import store from 'store';
import decode from 'jwt-decode';
import moment from 'moment';
import { API_ROUTES } from '../constants/routes';
import type {
  Post,
  Comments,
  User,
  UpdateProfile,
  Feed
} from '../types/models';

export const getToken = async (): Promise<string> => {
  try {
    const token = store.get('TOKEN');
    const refreshToken = store.get('REFRESH_TOKEN');
    const userId = store.get('USER_ID');
    const segment = store.get('SEGMENT');

    if (token) {
      const decoded = decode(token);
      const { exp } = decoded;
      const date = moment().add(2, 'minutes');
      if (exp > Number(date.format('X'))) {
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
    const { jwt_token = '', refresh_token = '' } = data;
    store.set('TOKEN', jwt_token);
    store.set('REFRESH_TOKEN', refresh_token);
    // eslint-disable-next-line camelcase
    return jwt_token;
  } catch (err) {
    console.log(err);
    return '';
  }
};

export const postToCamelCase = (post: Object): Post => {
  return {
    body: String((post.body: string) || ''),
    bookmarked: Boolean((post.bookmarked: boolean) || false),
    classId: Number((post.class_id: number) || 0),
    courseDisplayName: String((post.course_display_name: string) || ''),
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
      userId: String((post.post_info.user_id: string) || ''),
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
    userProfileUrl: String((post.user_profile_url: string) || ''),
    readOnly: Boolean((post.read_only: boolean) || false)
  };
};

export const commentsToCamelCase = (comments: Object): Comments => {
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

export const userToCamelCase = (user: Object): User => {
  return {
    userId: (user.user_id: string) || '',
    email: (user.email: string) || '',
    firstName: (user.first_name: string) || '',
    lastName: (user.last_name: string) || '',
    school: (user.school: string) || '',
    schoolId: (user.school_id: number) || 0,
    segment: (user.segment: string) || '',
    twilioToken: (user.twilio_token: string) || '',
    canvasUser: (user.canvas_user: boolean) || false,
    grade: (user.grade_id: number) || 0,
    jwtToken: (user.jwt_token: string) || '',
    refreshToken: (user.refresh_token: string) || '',
    profileImage: (user.profile_image_url: string) || '',
    rank: (user.rank: number) || 0,
    referralCode: (user.referral_code: string) || '',
    updateProfile: (user.update_profile: Array<UpdateProfile>) || []
  };
};

export const feedToCamelCase = (posts: Array<Object>): Feed => {
  return posts.map(item => ({
    userId: String((item.user_id: string) || ''),
    typeId: Number((item.type_id: number) || 0),
    feedId: Number((item.feed_id: number) || 0),
    postId: Number((item.post_id: number) || 0),
    courseDisplayName: String((item.course_display_name: string) || ''),
    bookmarked: Boolean((item.bookmarked: boolean) || false),
    deck: item.deck || [],
    noteUrl: String((item.note_url: string) || ''),
    name: String((item.name: string) || ''),
    created: String((item.created: string) || ''),
    userProfileUrl: String((item.user_profile_url: string) || ''),
    rank: Number((item.rank: number) || 0),
    classroomName: String((item.classroom_name: string) || ''),
    subject: String((item.subject: string) || ''),
    title: String((item.title: string) || ''),
    readOnly: Boolean((item.read_only: boolean) || false),
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
};

export const generateFeedURL = ({
  userId,
  schoolId,
  classId,
  sectionId,
  index,
  limit,
  postType,
  from,
  query
}: {
  userId: string,
  schoolId: number,
  classId: number,
  sectionId: number,
  index: number,
  limit: number,
  postType: number,
  from: string,
  query: string
}) => {
  let url = '';
  let queryString = `?index=${index}&limit=${limit}`;

  if (from === 'bookmarks') {
    return `${url}/${userId}/bookmark`;
  }

  if (query !== '' && from !== 'my_posts') {
    queryString = `${queryString}&query=${query}`;
  }

  if (from === 'classmates' || query !== '') {
    queryString = `${queryString}&school_id=${schoolId}`;
  }

  if (postType !== 0) {
    queryString = `${queryString}&tool_type_id=${postType}`;
  }

  if (classId !== 0) {
    queryString = `${queryString}&class_id=${classId}`;
  }

  if (sectionId && sectionId !== 0) {
    queryString = `${queryString}&section_id=${sectionId}`;
  }

  if (from === 'my_posts') {
    url = `${url}/user/${userId}${queryString}`;
  } else {
    url = `${url}/${userId}${queryString}`;
  }

  return url;
};
