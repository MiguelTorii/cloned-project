import axios from 'axios';
import store from 'store';
import decode from 'jwt-decode';
import moment from 'moment';
import { API_ROUTES } from '../constants/routes';
import type { Post, Comments, User, FeedItem, PostResponse } from '../types/models';
import { APIPost } from './models/APIPost';
import { APIPostResponse } from './models/APIPostResponse';
import { APIComments } from './models/APIComments';
import { APIComment } from './models/APIComment';
import { APIUser } from './models/APIUser';
import { APIFeedItem } from './models/APIFeedItem';
import { APIFlashcard } from './models/APIFlashcard';
import { APINote } from './models/APINote';

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
  userId: post.user_id || '',
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
    rank: response.user.rank || 0,
    scholarshipPoints: (response.user || {}).scholarship_points || 0,
    schoolId: (response.user || {}).school_id || 0,
    state: (response.user || {}).state || '',
    userId: (response.user || {}).user_id || ''
  }
});

export const commentsToCamelCase = (comments: APIComments): Comments => ({
  parentCommentsCount: comments.parent_comments_count || 0,
  comments: comments.comments.map((item: APIComment) => ({
    accepted: item.accepted,
    comment: item.comment || '',
    created: item.created || '',
    id: item.id || 0,
    parentCommentId: item.parent_comment_id || 0,
    reportsCount: item.reports_count || 0,
    rootCommentId: item.root_comment_id || 0,
    thanked: item.thanked,
    thanksCount: item.thanks_count || 0,
    user: {
      userId: item.user.user_id || '',
      firstName: item.user.first_name || '',
      lastName: item.user.last_name || '',
      profileImageUrl: item.user.profile_image_url || '',
      hours: item.user.hours || 0,
      joined: item.user.joined || '',
      rank: item.user.rank || 0,
      role: item.user.role || '',
      roleId: item.user.role_id || 0,
      scholarshipPoints: item.user.scholarship_points || 0,
      schoolId: item.user.school_id || 0,
      state: item.user.state || '',
      isOnline: item.user.is_online
    }
  }))
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

export const feedToCamelCase = (posts: APIFeedItem[]): FeedItem[] =>
  posts.map((item: APIFeedItem) => ({
    userId: item.user_id,
    numberOfNotes: item.pages_notes || 0,
    bestAnswer: item.best_answer,
    typeId: item.type_id || 0,
    feedId: item.feed_id || 0,
    postId: item.post_id || 0,
    roleId: item.role_id || 1,
    role: item.role || '',
    courseDisplayName: item.course_display_name || '',
    bookmarked: item.bookmarked,
    deck: item.deck.map((d: APIFlashcard) => ({
      answer: d.answer || '',
      answerImageUrl: d.answer_image_url || '',
      id: d.id,
      question: d.question || '',
      questionImageUrl: d.question_image_url || ''
    })),
    notes: item.notes.map((n: APINote) => ({
      fullNoteUrl: n.full_note_url || '',
      note: n.note || '',
      noteUrl: n.note_url || ''
    })),
    uri: item.uri || '',
    noteUrl: item.note_url || '',
    name: item.name || '',
    created: item.created || '',
    userProfileUrl: item.user_profile_url || '',
    rank: item.rank || 0,
    classId: item.class_id || 0,
    classroomName: item.classroom_name || '',
    subject: item.subject || '',
    title: item.title || '',
    body: item.body || '',
    readOnly: item.read_only,
    thanked: item.thanked,
    isOnline: item.is_online,
    tags: item.tags.map((tag) => ({
      description: tag.description || '',
      id: tag.id || 0,
      name: tag.name || ''
    })),
    postInfo: {
      date: item.post_info.date || '',
      feedId: item.post_info.feed_id || 0,
      postId: item.post_info.post_id || 0,
      questionsCount: item.post_info.questions_count || 0,
      thanksCount: item.post_info.thanks_count || 0,
      userId: item.post_info.user_id || '',
      viewCount: item.post_info.view_count || 0
    }
  }));

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
