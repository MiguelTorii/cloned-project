import axios from "axios";
import store from "store";
import decode from "jwt-decode";
import moment from "moment";
import { API_ROUTES } from "../constants/routes";
import type { Post, Comments, User, UpdateProfile, Feed, PostResponse } from "../types/models";
export const getToken = async (): Promise<string> => {
  try {
    const token = store.get('TOKEN');
    const refreshToken = store.get('REFRESH_TOKEN');
    const userId = store.get('USER_ID');
    const segment = store.get('SEGMENT');

    if (token) {
      const decoded = decode(token);
      const {
        exp
      } = decoded;
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
    const {
      data = {}
    } = result;
    // eslint-disable-next-line camelcase
    const {
      jwt_token = '',
      refresh_token = ''
    } = data;
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
  visible: Boolean(onboarding.visible)
});
export const postToCamelCase = (post: Record<string, any>): Post => ({
  body: String((post.body as string) || ''),
  summary: String((post.summary as string) || ''),
  bookmarked: Boolean(post.bookmarked),
  classId: Number((post.class_id as number) || 0),
  sectionId: Number(post.section_id || 0),
  courseDisplayName: String((post.course_display_name as string) || ''),
  classroomName: String((post.classroom_name as string) || ''),
  created: String((post.created as string) || ''),
  feedId: Number((post.feed_id as number) || 0),
  grade: Number((post.grade as number) || 0),
  inStudyCircle: Boolean(post.in_study_circle),
  name: String((post.name as string) || ''),
  postId: Number((post.post_id as number) || 0),
  postInfo: {
    date: String((post.post_info.date as string) || ''),
    feedId: Number((post.post_info.feed_id as number) || 0),
    postId: Number((post.post_info.post_id as number) || 0),
    questionsCount: Number((post.post_info.questions_count as number) || 0),
    thanksCount: Number((post.post_info.thanks_count as number) || 0),
    userId: post.post_info.user_id === 0 ? '0' : String((post.post_info.user_id as string) || ''),
    viewCount: Number((post.post_info.view_count as number) || 0)
  },
  rank: Number((post.rank as number) || 0),
  reports: Number((post.reports as number) || 0),
  roleId: Number((post.role_id as number) || 0),
  role: String((post.role as string) || ''),
  school: String((post.school as string) || ''),
  subject: String((post.subject as string) || ''),
  thanked: Boolean(post.thanked),
  bestAnswer: Boolean(post.best_answer),
  title: String((post.title as string) || ''),
  content: String((post.content as string) || ''),
  typeId: Number((post.type_id as number) || 0),
  userId: String((post.user_id as string) || ''),
  userProfileUrl: String((post.user_profile_url as string) || ''),
  readOnly: Boolean(post.read_only)
});
export const postResponseToCamelCase = (response: Record<string, any>): PostResponse => ({
  classes: response.classes || [],
  communityServiceHours: Number((response.community_service_hours as number) || 0),
  linkId: Number((response.link_id as number) || 0),
  linksLeft: Number((response.links_left as number) || 0),
  points: Number((response.points as number) || 0),
  postId: Number((response.post_id as number) || 0),
  postsLeft: Number((response.posts_left as number) || 0),
  questionId: Number((response.question_id as number) || 0),
  questionsLeft: Number((response.questions_left as number) || 0),
  isFirstNote: Boolean(response.is_first_note),
  notesLeft: Number((response.notes_left as number) || 0),
  photoNoteId: Number((response.photo_note_id as number) || 0),
  decksLeft: Number((response.decks_left as number) || 0),
  fcId: Number((response.fc_id as number) || 0),
  user: {
    firstName: String(((response.user || {}).first_name as string) || ''),
    hours: Number(((response.user || {}).hours as number) || 0),
    joined: String(((response.user || {}).joined as string) || ''),
    lastName: String(((response.user || {}).last_name as string) || ''),
    profileImageUrl: String(((response.user || {}).profile_image_url as string) || ''),
    rank: Number(((response.user || {}).number as number) || 0),
    scholarshipPoints: Number(((response.user || {}).scholarship_points as number) || 0),
    schoolId: Number(((response.user || {}).school_id as number) || 0),
    state: String(((response.user || {}).state as string) || ''),
    userId: String(((response.user || {}).user_id as string) || '')
  }
});
export const commentsToCamelCase = (comments: Record<string, any>): Comments => ({
  parentCommentsCount: Number((comments.parent_comments_count as number) || 0),
  comments: (comments.comments || []).map(item => ({
    accepted: Boolean(item.accepted),
    comment: String((item.comment as string) || ''),
    created: String((item.created as string) || ''),
    id: Number((item.id as number) || 0),
    parentCommentId: Number((item.parent_comment_id as number) || 0),
    reportsCount: Number((item.reports_count as number) || 0),
    rootCommentId: Number((item.root_comment_id as number) || 0),
    thanked: Boolean(item.thanked),
    thanksCount: Number((item.thanks_count as number) || 0),
    user: {
      userId: String((item.user.user_id as string) || ''),
      firstName: String((item.user.first_name as string) || ''),
      lastName: String((item.user.last_name as string) || ''),
      profileImageUrl: String((item.user.profile_image_url as string) || ''),
      hours: Number((item.user.hours as number) || 0),
      joined: String((item.user.joined as string) || ''),
      rank: Number((item.user.rank as number) || 0),
      role: String((item.user.role as string) || ''),
      roleId: Number((item.user.role_id as number) || 0),
      scholarshipPoints: Number((item.user.scholarship_points as number) || 0),
      schoolId: Number((item.user.school_id as number) || 0),
      state: String((item.user.state as string) || ''),
      isOnline: Boolean(item.user.is_online)
    }
  }))
});
export const userToCamelCase = (user: Record<string, any>): User => ({
  permission: (user.permission as array) || [],
  nonce: (user.nonce as string) || '',
  userId: (user.user_id as string) || '',
  email: (user.email as string) || '',
  firstName: (user.first_name as string) || '',
  lastName: (user.last_name as string) || '',
  school: (user.school as string) || '',
  schoolId: (user.school_id as number) || 0,
  segment: (user.segment as string) || '',
  twilioToken: (user.twilio_token as string) || '',
  canvasUser: Boolean(user.canvas_user),
  grade: (user.grade_id as number) || 0,
  jwtToken: (user.jwt_token as string) || '',
  refreshToken: (user.refresh_token as string) || '',
  profileImage: (user.profile_image_url as string) || '',
  rank: (user.rank as number) || 0,
  referralCode: (user.referral_code as string) || '',
  updateProfile: (user.update_profile as Array<UpdateProfile>) || [],
  lmsTypeId: (user.lms_type_id as number) || -1,
  lmsUser: Boolean(user.lms_user)
});
export const feedToCamelCase = (posts: Array<Record<string, any>>): Feed => posts.map(item => ({
  userId: item.user_id === 0 ? '0' : String((item.user_id as string) || ''),
  numberOfNotes: Number((item.pages_notes as number) || 0),
  bestAnswer: Boolean(item.best_answer),
  typeId: Number((item.type_id as number) || 0),
  feedId: Number((item.feed_id as number) || 0),
  postId: Number((item.post_id as number) || 0),
  roleId: Number((item.role_id as number) || 1),
  role: String((item.role as string) || ''),
  courseDisplayName: String((item.course_display_name as string) || ''),
  bookmarked: Boolean(item.bookmarked),
  deck: (item.deck || []).map(d => ({
    answer: String((d.answer as string) || ''),
    answerImageUrl: String((d.answer_image_url as string) || ''),
    id: Number((d.id as number) || 0),
    question: String((d.question as string) || ''),
    questionImageUrl: String((d.question_image_url as string) || '')
  })),
  notes: (item.notes || []).map(n => ({
    fullNoteUrl: String((n.full_note_url as string) || ''),
    note: String((n.note as string) || ''),
    noteUrl: String((n.note_url as string) || '')
  })),
  uri: String((item.uri as string) || ''),
  noteUrl: String((item.note_url as string) || ''),
  name: String((item.name as string) || ''),
  created: String((item.created as string) || ''),
  userProfileUrl: String((item.user_profile_url as string) || ''),
  rank: Number((item.rank as number) || 0),
  classId: Number((item.class_id as number) || 0),
  classroomName: String((item.classroom_name as string) || ''),
  subject: String((item.subject as string) || ''),
  title: String((item.title as string) || ''),
  body: String((item.body as string) || ''),
  readOnly: Boolean(item.read_only),
  thanked: Boolean(item.thanked),
  isOnline: Boolean(item.is_online),
  tags: (item.tags || []).map(tag => ({
    description: String((tag.description as string) || ''),
    id: Number((tag.id as number) || 0),
    name: String((tag.name as string) || '')
  })),
  postInfo: {
    date: String((item.post_info.date as string) || ''),
    feedId: Number((item.post_info.feed_id as number) || 0),
    postId: Number((item.post_info.post_id as number) || 0),
    questionsCount: Number((item.post_info.questions_count as number) || 0),
    thanksCount: Number((item.post_info.thanks_count as number) || 0),
    userId: String((item.post_info.user_id as string) || ''),
    viewCount: Number((item.post_info.view_count as number) || 0)
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
      const {
        sectionId
      } = JSON.parse(userClass);
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