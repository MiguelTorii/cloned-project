import axios from 'axios';
import store from 'store';
import decode from 'jwt-decode';
import moment from 'moment';
import { API_ROUTES } from '../constants/routes';
import type { Post, TComment, Comments, User, TFeedItem, PostResponse } from '../types/models';
import { APIPost } from './models/APIPost';
import { APIPostResponse } from './models/APIPostResponse';
import { APIComments } from './models/APIComments';
import { APIComment } from './models/APIComment';
import { APIUser } from './models/APIUser';
import { APIFeedItem, APIFeedItemV2 } from './models/APIFeedItem';
import { APIFlashcard } from './models/APIFlashcard';
import { APINote } from './models/APINote';

export const getToken = async (): Promise<string> => {
  try {
    const token = store.get('TOKEN');
    const refreshToken = store.get('REFRESH_TOKEN');
    const userId = store.get('USER_ID');

    if (token) {
      const decoded = decode(token);
      const { exp } = decoded;
      const date = moment().add(2, 'minutes');

      if (exp > Number(date.format('X'))) {
        return token;
      }
    }

    if (userId === '' || refreshToken === '' || !userId) {
      return '';
    }

    const result = await axios.post(API_ROUTES.REFRESH, {
      user_id: Number(userId),
      token: refreshToken
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

export const onboardingToCamelCase = (onboarding: Record<string, any>) => ({
  checklist: onboarding.checklist || [],
  visible: onboarding.visible
});

export const postToCamelCase = (post: APIPost): Post => ({
  body: post.body || '',
  summary: post.summary || '',
  bookmarked: post.bookmarked,
  classId: post.class_id || 0,
  sectionId: post.section_id || 0,
  courseDisplayName: post.course_display_name || '',
  classroomName: post.classroom_name || '',
  created: post.created || '',
  feedId: post.feed_id || 0,
  grade: post.grade || 0,
  inStudyCircle: post.in_study_circle,
  name: post.name || '',
  postId: post.post_id || 0,
  postInfo: {
    date: post.post_info.date || '',
    feedId: post.post_info.feed_id || 0,
    postId: post.post_info.post_id || 0,
    questionsCount: post.post_info.questions_count || 0,
    thanksCount: post.post_info.thanks_count || 0,
    userId: String(post.post_info.user_id),
    viewCount: post.post_info.view_count || 0
  },
  rank: post.rank || 0,
  reports: post.reports || 0,
  roleId: post.role_id || 0,
  role: post.role || '',
  school: post.school || '',
  subject: post.subject || '',
  thanked: post.thanked,
  bestAnswer: post.best_answer,
  title: post.title || '',
  content: post.content || '',
  typeId: post.type_id || 0,
  userId: post.user_id ? String(post.user_id) : '',
  userProfileUrl: post.user_profile_url || '',
  readOnly: post.read_only
});

export const postResponseToCamelCase = (response: APIPostResponse): PostResponse => ({
  classes: response.classes || [],
  communityServiceHours: response.community_service_hours || 0,
  linkId: response.link_id || 0,
  linksLeft: response.links_left || 0,
  points: response.points || 0,
  postId: response.post_id || 0,
  postsLeft: response.posts_left || 0,
  questionId: response.question_id || 0,
  questionsLeft: response.questions_left || 0,
  isFirstNote: response.is_first_note,
  notesLeft: response.notes_left || 0,
  photoNoteId: response.photo_note_id || 0,
  decksLeft: response.decks_left || 0,
  fcId: response.fc_id || 0,
  user: {
    firstName: (response.user || {}).first_name || '',
    hours: (response.user || {}).hours || 0,
    joined: (response.user || {}).joined || '',
    lastName: (response.user || {}).last_name || '',
    profileImageUrl: (response.user || {}).profile_image_url || '',
    rank: (response.user || {}).rank || 0,
    scholarshipPoints: (response.user || {}).scholarship_points || 0,
    schoolId: (response.user || {}).school_id || 0,
    state: (response.user || {}).state || '',
    userId: (response.user || {}).user_id ? String((response.user || {}).user_id) : ''
  }
});

export const commentToCamelCase = (comment: APIComment): TComment => ({
  accepted: comment.accepted,
  comment: comment.comment || '',
  created: comment.created || '',
  id: comment.id || 0,
  parentCommentId: comment.parent_comment_id || 0,
  reportsCount: comment.reports_count || 0,
  rootCommentId: comment.root_comment_id || 0,
  thanked: comment.thanked,
  thanksCount: comment.thanks_count || 0,
  user: {
    userId: comment.user.user_id ? String(comment.user.user_id) : '',
    firstName: comment.user.first_name || '',
    lastName: comment.user.last_name || '',
    profileImageUrl: comment.user.profile_image_url || '',
    hours: comment.user.hours || 0,
    joined: comment.user.joined || '',
    rank: comment.user.rank || 0,
    role: comment.user.role || '',
    roleId: Number(comment.user.role_id || 0),
    scholarshipPoints: comment.user.scholarship_points || 0,
    schoolId: comment.user.school_id || 0,
    state: comment.user.state || '',
    isOnline: comment.user.is_online
  }
});

export const commentsToCamelCase = (comments: APIComments): Comments => ({
  parentCommentsCount: comments.parent_comments_count || 0,
  comments: comments.comments.map((item: APIComment) => commentToCamelCase(item))
});

export const userToCamelCase = (user: APIUser): User => ({
  permission: user.permission,
  nonce: user.nonce || '',
  userId: user.user_id ? String(user.user_id) : '',
  email: user.email || '',
  firstName: user.first_name || '',
  lastName: user.last_name || '',
  school: user.school || '',
  schoolId: user.school_id || 0,
  segment: user.segment || '',
  twilioToken: user.twilio_token || '',
  canvasUser: user.canvas_user,
  grade: user.grade_id || 0,
  jwtToken: user.jwt_token || '',
  refreshToken: user.refresh_token || '',
  profileImage: user.profile_image_url || '',
  rank: user.rank || 0,
  referralCode: user.referral_code || '',
  updateProfile: user.update_profile,
  lmsTypeId: user.lms_type_id || -1,
  lmsUser: user.lms_user
});

const feedDataToCamelCase = (feedData: APIFeedItem): TFeedItem => ({
  userId: feedData.user_id ? String(feedData.user_id) : '',
  numberOfNotes: feedData.pages_notes || 0,
  bestAnswer: feedData.best_answer,
  typeId: feedData.type_id || 0,
  feedId: feedData.feed_id || 0,
  postId: feedData.post_id || 0,
  roleId: feedData.role_id || 1,
  role: feedData.role || '',
  courseDisplayName: feedData.course_display_name || '',
  bookmarked: feedData.bookmarked,
  deck: feedData.deck?.map((d: APIFlashcard) => ({
    answer: d.answer || '',
    answerImageUrl: d.answer_image_url || '',
    id: d.id,
    question: d.question || '',
    questionImageUrl: d.question_image_url || ''
  })),
  notes: feedData.notes.map((n: APINote) => ({
    fullNoteUrl: n.full_note_url || '',
    note: n.note || '',
    noteUrl: n.note_url || ''
  })),
  uri: feedData.uri || '',
  noteUrl: feedData.note_url || '',
  name: feedData.name || '',
  created: feedData.created || '',
  userProfileUrl: feedData.user_profile_url || '',
  rank: feedData.rank || 0,
  classId: feedData.class_id || 0,
  classroomName: feedData.classroom_name || '',
  subject: feedData.subject || '',
  title: feedData.title || '',
  body: feedData.body || '',
  readOnly: feedData.read_only,
  thanked: feedData.thanked,
  isOnline: feedData.is_online,
  tags: feedData.tags.map((tag) => ({
    description: tag.description || '',
    id: tag.id || 0,
    name: tag.name || ''
  })),
  postInfo: {
    date: feedData.post_info.date || '',
    feedId: feedData.post_info.feed_id || 0,
    postId: feedData.post_info.post_id || 0,
    questionsCount: feedData.post_info.questions_count || 0,
    thanksCount: feedData.post_info.thanks_count || 0,
    userId: feedData.post_info.user_id ? String(feedData.post_info.user_id) : '',
    viewCount: feedData.post_info.view_count || 0
  }
});

export const feedToCamelCase = (posts: APIFeedItem[]): TFeedItem[] =>
  posts.map((feedItem: APIFeedItem) => feedDataToCamelCase(feedItem));

export const feedToCamelCaseV2 = (posts: APIFeedItemV2[]): TFeedItem[] =>
  posts.map((feedItem: APIFeedItemV2) => {
    const feedData = feedItem[0];
    const firstComment = feedItem[1];
    return {
      ...feedDataToCamelCase(feedData),
      firstComment: firstComment ? commentToCamelCase(firstComment) : null
    };
  });

export const generateFeedURL = ({
  userId,
  schoolId,
  userClasses,
  index,
  limit,
  postTypes,
  from,
  query,
  fromDate,
  toDate
}: {
  userId: string;
  schoolId: number;
  userClasses: Array<string>;
  index: number;
  limit: number;
  postTypes: Array<string>;
  from: string;
  query: string;
  fromDate: Record<string, any> | null | undefined;
  toDate: Record<string, any> | null | undefined;
}) => {
  let url = '';
  let queryString = `?index=${index}&limit=${limit}`;

  if (from === 'bookmarks') {
    queryString += `&bookmarked=true`;
  }

  if (from === 'me') {
    queryString += `&user_id=${userId}`;
  }

  if (query !== '' && from !== 'my_posts') {
    queryString = `${queryString}&query=${query}`;
  }

  if (from === 'classmates' || query !== '') {
    queryString = `${queryString}&school_id=${schoolId}`;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const postType of postTypes) {
    queryString = `${queryString}&tool_type_id=${postType}`;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const userClass of userClasses) {
    try {
      const { sectionId } = JSON.parse(userClass);
      queryString = `${queryString}&section_id=${sectionId}`;
    } catch (err) {
      console.log(err);
    }
  }

  if (fromDate) {
    queryString = `${queryString}&from_date=${fromDate.valueOf()}`;
  }

  if (toDate) {
    queryString = `${queryString}&to_date=${toDate.valueOf()}`;
  }

  url = `${url}${queryString}`;
  return url;
};
