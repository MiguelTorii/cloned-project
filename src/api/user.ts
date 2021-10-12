import axios from 'axios';
import store from 'store';
import moment from 'moment';
import { API_ROUTES } from '../constants/routes';
import type {
  Profile,
  UserClasses,
  AvailableClasses,
  BlockedUsers,
  StudyCircle,
  UserStats,
  HomeCard,
  QuestsCard,
  CurrentSeasonCard,
  InviteCard,
  SyncSuccessData
} from '../types/models';
import { getToken } from './utils';
import callApi from './api_base';
import { APIProfile } from './models/APIProfile';
import { APIAbout } from './models/APIAbout';
import { UserProfile } from '../types/models';

export const getUserProfile = async ({ userId }: { userId: string }): Promise<Profile> => {
  if (!userId) {
    throw new Error('No userId specified');
  }

  const token = await getToken();
  const result: { data: APIProfile } = await axios.get(`${API_ROUTES.USER}/${userId}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { user_profile, about, user_statistics } = result.data;
  const userProfile: UserProfile = {
    userId: user_profile.user_id ? String(user_profile.user_id) : '',
    firstName: user_profile.first_name || '',
    lastName: user_profile.last_name || '',
    grade: user_profile.grade || 0,
    hours: user_profile.hours || 0,
    inStudyCircle: user_profile.in_study_circle || false,
    joined: user_profile.joined || '',
    points: user_profile.points || 0,
    rank: user_profile.rank || 0,
    roleId: user_profile.role_id || 1,
    role: user_profile.role || '',
    school: user_profile.school || '',
    state: user_profile.state || '',
    userProfileUrl: user_profile.user_profile_url || '',
    isOnline: user_profile.is_online || false
  };
  const userStatistics = user_statistics.map((stats) => ({
    seasonId: stats.season_id || 0,
    bestAnswers: stats.best_answers || 0,
    communityServiceHours: stats.community_service_hours || 0,
    currentSeason: stats.current_season || false,
    name: stats.name || '',
    points: stats.points || 0,
    rankReached: stats.rank_reached || 0,
    reach: stats.reach || 0,
    thanks: stats.thanks || 0
  }));
  const newAbout = about.map((item: APIAbout) => ({
    ...item,
    section:
      item.section === 'Do you like helping others with homework study help, if so, which subjects?'
        ? 'Do you enjoy getting involved in helping classmates?'
        : item.section
  }));
  return {
    userProfile,
    about: newAbout,
    userStatistics
  };
};
export const searchUsers = async ({
  schoolId,
  userId,
  query
}: {
  schoolId?: number;
  userId: string;
  query: string;
}): Promise<Array<Record<string, any>>> => {
  const token = await getToken();
  const url = schoolId
    ? `${API_ROUTES.SEARCH_USERS}/${schoolId}/users`
    : `${API_ROUTES.SEARCH_USERS}/users`;
  const result = await axios.get(
    `${url}?user_id=${userId}&token=NA&index=0&limit=50&query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  const { users = [] } = data;
  return users.map((user) => ({
    firstName: user.first_name,
    grade: user.grade,
    lastName: user.last_name,
    profileImageUrl: user.profile_image_url,
    school: user.school,
    userId: user.user_id,
    relationship: user.relationship,
    isOnline: user.is_online
  }));
};

const getClassesCache = () => {
  try {
    const { result, expires } = JSON.parse(store.get('CLASSES_CACHE'));

    if (moment().valueOf() > expires) {
      return null;
    }

    return result;
  } catch {
    // TODO log an error to the server here so we know this happened
    // (because it shouldn't happen).
    return null;
  }
};

const setClassesCache = (result) => {
  store.set(
    'CLASSES_CACHE',
    JSON.stringify({
      result,
      expires: moment().add(5, 'minute').valueOf()
    })
  );
};

const getClasses = (classes) =>
  classes.map((userClass) => ({
    className: (userClass.course_display_name as string) || '',
    classId: (userClass.class_id as number) || 0,
    permissions: {
      canLeave: Boolean(((userClass.permissions || {}).can_leave as boolean) || false),
      canCreate: Boolean(((userClass.permissions || {}).can_create as boolean) || false)
    },
    section: (userClass.section || []).map((item) => ({
      firstName: (item.first_name as string) || '',
      lastName: (item.last_name as string) || '',
      section: (item.section as string) || '',
      sectionId: Number((item.section_id as number) || 0),
      subject: (item.subject as string) || '',
      sectionDisplayName: (item.section_display_name as string) || '',
      instructorDisplayName: (item.instructor_display_name as string) || ''
    })),
    subjectId: Number((userClass.subject_id as number) || 0),
    courseDisplayName: (userClass.course_display_name as string) || '',
    class: (userClass.class as string) || '',
    bgColor: userClass.bg_color || '',
    didInviteClassmates: Boolean(userClass.did_invite_classmates || false),
    didHideFeedEmptyState: Boolean(userClass.did_hide_feed_empty_state || false),
    isCurrent: Boolean(userClass.is_current || false)
  }));

export const getUserClasses = async ({
  userId,
  skipCache,
  expertMode
}: {
  userId: string;
  skipCache: boolean;
  expertMode: boolean;
}): Promise<UserClasses> => {
  const token = await getToken();
  let result = null;
  const cache = getClassesCache();

  if (!cache || skipCache) {
    const appId = expertMode ? 3 : 1;
    result = await axios.get(
      `${API_ROUTES.USER_CLASSES_V1_1}?user_id=${userId}&application_id=${appId}&include_past_classes=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setClassesCache(result);
  } else {
    result = cache;
  }

  const {
    data: {
      classes = [],
      past_classes: pastClasses = [],
      permissions = {},
      empty_state: empty = {}
    }
  } = result;
  const currentClasses = classes.filter((classEntry) => classEntry.is_current);
  const userCurrentClasses = getClasses(currentClasses);
  const userPastClasses = getClasses(pastClasses || []);
  const emptyState = {
    visibility: empty.visibility || false,
    logo: empty.logo_image || '',
    body: empty.body || ''
  };
  const userPermissions = {
    canAddClasses: permissions.can_add_classes || false
  };
  return {
    classes: userCurrentClasses,
    permissions: userPermissions,
    pastClasses: userPastClasses,
    emptyState
  };
};
export const getAvailableClasses = async ({
  userId,
  schoolId
}: {
  userId: string;
  schoolId: number;
}): Promise<AvailableClasses> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.CLASSES}?user_id=${userId}&school_id=${schoolId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { classes = {} }
  } = result;
  const keys = Object.keys(classes);
  const classesList = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    classesList[key] = classes[key].map((item) => ({
      class: item.class || '',
      classId: item.class_id || 0,
      section: item.section.map((o) => ({
        firstName: o.first_name || '',
        lastName: o.last_name || '',
        section: o.section || '',
        sectionId: o.section_id || 0,
        subject: o.subject || ''
      })),
      subjectId: item.subject_id || 0
    }));
  }

  return classesList;
};
export const getAvailableSubjects = async () => {
  const token = await getToken();
  const result: Record<string, any> = await axios.get(`${API_ROUTES.SUBJECTS}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { subjects = [] }
  } = result;
  return subjects;
};
export const getAvailableSubjectsClasses = async ({ subjectId }: { subjectId: number }) => {
  const token = await getToken();
  const result: Record<string, any> = await axios.get(
    `${API_ROUTES.SUBJECTS}/${subjectId}/classes`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const {
    data: { classes = [] }
  } = result;
  return classes;
};
export const getAvailableClassesSections = async ({ classId }: { classId: number }) => {
  const token = await getToken();
  const result: Record<string, any> = await axios.get(
    `${API_ROUTES.SECTIONS}?class_id=${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const {
    data: { sections = [] }
  } = result;
  return sections;
};
export const leaveUserClass = async ({
  classId,
  sectionId,
  userId
}: {
  classId: number;
  sectionId?: number;
  userId: string;
}) => {
  const token = await getToken();
  let url = '';

  if (sectionId) {
    url = `${API_ROUTES.USER_CLASS}/${classId}?user_id=${userId}&section_id=${sectionId}`;
  } else {
    url = `${API_ROUTES.USER_CLASS}/${classId}?user_id=${userId}`;
  }

  const result = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { success }
  } = result;
  return success;
};
export const joinClass = async ({
  classId,
  sectionId,
  userId
}: {
  classId: number;
  sectionId?: number;
  userId: string;
}) => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.USER_CLASS}/${classId}`,
    {
      user_id: Number(userId),
      section_id: sectionId,
      token: 'NA'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const getBlockedUsers = async ({ userId }: { userId: string }): Promise<BlockedUsers> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.GET_BLOCKED_USERS}?user_id=${userId}&token=NA`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  const { users = [] } = data;
  return users.map((item) => ({
    userId: item.user_id || '',
    profileImageUrl: item.profile_image_url || '',
    name: item.name || ''
  }));
};
export const blockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string;
  blockedUserId: string;
}): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.BLOCK_USER}/${userId}`,
    {
      blocked_user_id: Number(blockedUserId),
      token: 'NA'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const unblockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string;
  blockedUserId: string;
}) => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.UNBLOCK_USER}/${userId}`,
    {
      blocked_user_id: Number(blockedUserId),
      token: 'NA'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const getStudyCircle = async ({ userId }: { userId: string }): Promise<StudyCircle> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.STUDY_CIRCLE}/${userId}?study_circle_type_id=1`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  return (data.study_circle || []).map((item) => ({
    firstName: item.first_name || '',
    lastName: item.last_name || '',
    profileImageUrl: item.profile_image_url || '',
    userId: item.study_circle_id || '',
    typeId: item.study_circle_type_id || 0
  }));
};
export const getUserStats = async ({ userId }: { userId: string }): Promise<UserStats> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.HOME}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  return {
    communityServiceHours: data.user_community_service_hours || 0,
    reach: data.user_reach || 0,
    scholarshipPoints: data.user_scholarship_points || 0,
    weeklyNotesGoal: data.weekly_notes_goal || 0,
    weeklyNotesGoalProgress: data.weekly_notes_goal_progress || 0
  };
};
export const updateProfile = async ({
  userId,
  fields
}: {
  userId: string;
  fields: Array<{
    field: string;
    updated_value: string;
  }>;
}): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.USER}/${userId}/profile`,
    {
      fields
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const updateUserProfileUrl = async ({
  userId,
  mediaId
}: {
  userId: string;
  mediaId: string;
}): Promise<Record<string, any>> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.USER}/${userId}/profile_image`,
    {
      is_set: true,
      object_id: mediaId,
      token: 'NA'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const getHome = async (): Promise<HomeCard> => {
  const token = await getToken();
  const result = await axios.get(API_ROUTES.HOME_V1_1, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: { order = [], slots = [], subtitle = {}, title = '' }
  } = result;
  return {
    order: order.map((item) => ({
      cardId: item.card_id || 0,
      hidden: item.hidden || false
    })),
    slots: slots.map((item) => ({
      bgColor: item.bg_color || '',
      company: item.company || '',
      displayName: item.display_name || '',
      imageUrl: item.image_url || '',
      rewardId: item.reward_id || 0,
      rewardValue: item.reward_value || 0,
      slot: item.slot || 0,
      thumbnailUrl: item.thumbnail_url || ''
    })),
    subtitle: {
      text: subtitle.text || '',
      style: (subtitle.style || []).map((s) => ({
        substring: s.substring || '',
        textColor: s.text_color || '',
        weight: s.weight || ''
      }))
    },
    title: title || ''
  };
};
export const getQuests = async (): Promise<QuestsCard> => {
  const token = await getToken();
  const result = await axios.get(API_ROUTES.QUESTS, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data } = result;
  return {
    activeQuests: (data.active_quests || []).map((item) => ({
      id: item.id || 0,
      iconUrl: item.icon_url || '',
      pointsAvailable: item.points_available || 0,
      status: item.status || '',
      task: item.task || '',
      action: {
        name: (item.action || {}).name || '',
        value: (item.action || {}).value || '',
        attributes: {
          feedFilter: {
            classId: (((item.action || {}).attributes || {}).feedFilter || {}).classId || 0
          }
        }
      }
    })),
    availablePointsText: {
      text: (data.available_points_text || {}).text || '',
      style: ((data.available_points_text || {}).style || []).map((s) => ({
        substring: s.substring || '',
        textColor: s.text_color || '',
        weight: s.weight || ''
      }))
    },
    progressText: {
      text: (data.progress_text || {}).text || '',
      style: ((data.progress_text || {}).style || []).map((s) => ({
        substring: s.substring || '',
        textColor: s.text_color || '',
        weight: s.weight || ''
      }))
    }
  };
};
export const getCurrentSeason = async (): Promise<CurrentSeasonCard> => {
  const token = await getToken();
  const result = await axios.get(API_ROUTES.CURRENT_SEASON, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data } = result;
  return {
    seasonId: data.season_id || 0,
    bestAnswers: data.best_answers || '',
    grandPrizeText: data.grand_prize_text || '',
    logoUrl: data.logo_url || '',
    points: data.points || '',
    reach: data.reach || '',
    serviceHours: data.service_hours || '',
    thanks: data.thanks || ''
  };
};
export const getInvite = async (): Promise<InviteCard> => {
  const token = await getToken();
  const result = await axios.get(API_ROUTES.INVITE, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data } = result;
  return {
    imageUrl: data.image_url || '',
    referralCode: data.referral_code || '',
    subtitle: {
      text: (data.subtitle || {}).text || '',
      style: ((data.subtitle || {}).style || []).map((s) => ({
        substring: s.substring || '',
        textColor: s.text_color || '',
        weight: s.weight || ''
      }))
    },
    title: data.title || ''
  };
};
export const confirmTooltip = async (tooltipId: number) => {
  const token = await getToken();
  await axios.post(
    `${API_ROUTES.USER}/tool_tip`,
    {
      tool_tip_id: [tooltipId]
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
export const getSync = async ({ userId }: { userId: string }): Promise<SyncSuccessData> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.SYNC}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const {
    data: {
      institution_resources: {
        display_on_feed: display,
        small_logo: smallLogo,
        large_logo: largeLogo,
        feed_resources_title: resourcesTitle,
        feed_resources_body: resourcesBody
      },
      viewed_tool_tips: viewedTooltips,
      viewed_onboarding: viewedOnboarding,
      hc_link: helpLink
    }
  } = result;
  return {
    smallLogo,
    helpLink,
    largeLogo,
    display,
    resourcesTitle,
    resourcesBody,
    viewedTooltips,
    viewedOnboarding
  };
};
export const sendFeedback = async ({ origin, feedback }): Promise<object> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.FEEDBACK}`,
    {
      origin,
      feedback
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const apiGetExpertMode = async (userId: string): Promise<boolean> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.USER}/${userId}/expert_mode`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return result.data.expert_mode;
};
export const apiSetExpertMode = async (userId: string, expert_mode: boolean): Promise<boolean> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.USER}/${userId}/expert_mode`,
    {
      expert_mode
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return result.data.success;
};
export const apiGetPointsHistory = async (userId: string, params: object): Promise<object> =>
  callApi({
    url: `${API_ROUTES.USER}/${userId}/points_history`,
    params
  });
