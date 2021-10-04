import axios from "axios";
import store from "store";
import moment from "moment";
import { API_ROUTES } from "../constants/routes";
import type { Profile, UserClasses, AvailableClasses, BlockedUsers, StudyCircle, UserStats, HomeCard, QuestsCard, CurrentSeasonCard, InviteCard } from "../types/models";
import { getToken } from "./utils";
import callApi from "./api_base";
export const getUserProfile = async ({
  userId
}: {
  userId: string;
}): Promise<Profile> => {
  try {
    if (!userId) {
      throw new Error('No userId specified');
    }

    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.USER}/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    // eslint-disable-next-line camelcase
    const {
      user_profile = {},
      about = [],
      user_statistics = []
    } = data;
    const userProfile = {
      userId: user_profile.user_id === 0 ? '0' : String((user_profile.user_id as string) || ''),
      firstName: String((user_profile.first_name as string) || ''),
      lastName: String((user_profile.last_name as string) || ''),
      grade: Number((user_profile.grade as number) || 0),
      hours: Number((user_profile.hours as number) || 0),
      inStudyCircle: Boolean((user_profile.in_study_circle as boolean) || false),
      joined: String((user_profile.joined as string) || ''),
      points: Number((user_profile.points as number) || 0),
      rank: Number((user_profile.rank as number) || 0),
      roleId: Number((user_profile.role_id as number) || 1),
      role: String((user_profile.role as string) || ''),
      school: String((user_profile.school as string) || ''),
      state: String((user_profile.state as string) || ''),
      userProfileUrl: String((user_profile.user_profile_url as string) || ''),
      isOnline: Boolean((user_profile.is_online as boolean) || false)
    };
    const userStatistics = user_statistics.map(stats => ({
      seasonId: Number((stats.season_id as number) || 0),
      bestAnswers: Number((stats.best_answers as number) || 0),
      communityServiceHours: Number((stats.community_service_hours as number) || 0),
      currentSeason: Boolean((stats.current_season as boolean) || false),
      name: String((stats.name as string) || ''),
      points: Number((stats.points as number) || 0),
      rankReached: Number((stats.rank_reached as number) || 0),
      reach: Number((stats.reach as number) || 0),
      thanks: Number((stats.thanks as number) || 0)
    }));
    const newabout = about.map(item => ({ ...item,
      section: item.section === 'Do you like helping others with homework study help, if so, which subjects?' ? 'Do you enjoy getting involved in helping classmates?' : item.section
    }));
    return {
      userProfile,
      about: newabout,
      userStatistics
    };
  } catch (err) {
    console.log(err);
    return {
      userProfile: {
        userId: '',
        firstName: '',
        lastName: '',
        grade: 0,
        hours: 0,
        inStudyCircle: false,
        joined: '',
        points: 0,
        rank: 0,
        school: '',
        state: '',
        userProfileUrl: ''
      },
      about: [],
      userStatistics: []
    };
  }
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
  try {
    const token = await getToken();
    const url = schoolId ? `${API_ROUTES.SEARCH_USERS}/${schoolId}/users` : `${API_ROUTES.SEARCH_USERS}/users`;
    const result = await axios.get(`${url}?user_id=${userId}&token=NA&index=0&limit=50&query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const {
      users = []
    } = data;
    return users.map(user => ({
      firstName: user.first_name,
      grade: user.grade,
      lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      school: user.school,
      userId: user.user_id,
      relationship: user.relationship,
      isOnline: user.is_online
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getClassesCache = () => {
  try {
    const {
      result,
      expires
    } = JSON.parse(store.get('CLASSES_CACHE'));

    if (moment().valueOf() > expires) {
      return null;
    }

    return result;
  } catch (e) {
    return null;
  }
};

const setClassesCache = result => {
  store.set('CLASSES_CACHE', JSON.stringify({
    result,
    expires: moment().add(5, 'minute').valueOf()
  }));
};

const getClasses = classes => classes.map(userClass => ({
  className: String((userClass.course_display_name as string) || ''),
  classId: Number((userClass.class_id as number) || 0),
  permissions: {
    canLeave: Boolean(((userClass.permissions || {}).can_leave as boolean) || false),
    canCreate: Boolean(((userClass.permissions || {}).can_create as boolean) || false)
  },
  section: (userClass.section || []).map(item => ({
    firstName: String((item.first_name as string) || ''),
    lastName: String((item.last_name as string) || ''),
    section: String((item.section as string) || ''),
    sectionId: Number((item.section_id as number) || 0),
    subject: String((item.subject as string) || ''),
    sectionDisplayName: String((item.section_display_name as string) || ''),
    instructorDisplayName: String((item.instructor_display_name as string) || '')
  })),
  subjectId: Number((userClass.subject_id as number) || 0),
  courseDisplayName: String((userClass.course_display_name as string) || ''),
  class: String((userClass.class as string) || ''),
  bgColor: String(userClass.bg_color || ''),
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
  try {
    const token = await getToken();
    let result = null;
    const cache = getClassesCache();

    if (!cache || skipCache) {
      const appId = expertMode ? 3 : 1;
      result = await axios.get(`${API_ROUTES.USER_CLASSES_V1_1}?user_id=${userId}&application_id=${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
    const userClasses = getClasses(classes);
    const userPastClasses = getClasses(pastClasses || []);
    const emptyState = {
      visibility: Boolean((empty.visibility as boolean) || false),
      logo: String((empty.logo_image as string) || ''),
      body: String((empty.body as string) || '')
    };
    const userPermissions = {
      canAddClasses: Boolean((permissions.can_add_classes as boolean) || false)
    };
    return {
      classes: userClasses,
      permissions: userPermissions,
      emptyState,
      pastClasses: userPastClasses
    };
  } catch (err) {
    return {
      classes: [],
      pastClasses: [],
      permissions: {
        canAddClasses: false
      }
    };
  }
};
export const getAvailableClasses = async ({
  userId,
  schoolId
}: {
  userId: string;
  schoolId: number;
}): Promise<AvailableClasses> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.CLASSES}?user_id=${userId}&school_id=${schoolId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        classes = {}
      }
    } = result;
    const keys = Object.keys(classes);
    const classesList = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      classesList[key] = classes[key].map(item => ({
        class: String((item.class as string) || ''),
        classId: Number((item.class_id as number) || 0),
        section: (item.section || []).map(o => ({
          firstName: String((o.first_name as string) || ''),
          lastName: String((o.last_name as string) || ''),
          section: String((o.section as string) || ''),
          sectionId: Number((o.section_id as number) || 0),
          subject: String((o.subject as string) || '')
        })),
        subjectId: Number((item.subject_id as number) || 0)
      }));
    }

    return classesList;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getAvailableSubjects = async (): Array => {
  try {
    const token = await getToken();
    const result: Record<string, any> = await axios.get(`${API_ROUTES.SUBJECTS}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        subjects = []
      }
    } = result;
    return subjects;
  } catch (err) {
    return [];
  }
};
export const getAvailableSubjectsClasses = async ({
  subjectId
}: {
  subjectId: number;
}): Array => {
  try {
    const token = await getToken();
    const result: Record<string, any> = await axios.get(`${API_ROUTES.SUBJECTS}/${subjectId}/classes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        classes = []
      }
    } = result;
    return classes;
  } catch (err) {
    return [];
  }
};
export const getAvailableClassesSections = async ({
  classId
}: {
  classId: number;
}): Array => {
  try {
    const token = await getToken();
    const result: Record<string, any> = await axios.get(`${API_ROUTES.SECTIONS}?class_id=${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        sections = []
      }
    } = result;
    return sections;
  } catch (err) {
    return [];
  }
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
  try {
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
      data: {
        success
      }
    } = result;
    return success;
  } catch (err) {
    console.log(err);
    return {};
  }
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
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.USER_CLASS}/${classId}`, {
      user_id: Number(userId),
      section_id: sectionId,
      token: 'NA'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getBlockedUsers = async ({
  userId
}: {
  userId: string;
}): Promise<BlockedUsers> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.GET_BLOCKED_USERS}?user_id=${userId}&token=NA`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const {
      users = []
    } = data;
    return users.map(item => ({
      userId: String((item.user_id as string) || ''),
      profileImageUrl: String((item.profile_image_url as string) || ''),
      name: String((item.name as string) || '')
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const blockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string;
  blockedUserId: string;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.BLOCK_USER}/${userId}`, {
      blocked_user_id: Number(blockedUserId),
      token: 'NA'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const unblockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string;
  blockedUserId: string;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.UNBLOCK_USER}/${userId}`, {
      blocked_user_id: Number(blockedUserId),
      token: 'NA'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getStudyCircle = async ({
  userId
}: {
  userId: string;
}): Promise<StudyCircle> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.STUDY_CIRCLE}/${userId}?study_circle_type_id=1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return (data.study_circle || []).map(item => ({
      firstName: String((item.first_name as string) || ''),
      lastName: String((item.last_name as string) || ''),
      profileImageUrl: String((item.profile_image_url as string) || ''),
      userId: String((item.study_circle_id as string) || ''),
      typeId: Number((item.study_circle_type_id as number) || 0)
    }));
  } catch (err) {
    return [];
  }
};
export const getUserStats = async ({
  userId
}: {
  userId: string;
}): Promise<UserStats> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.HOME}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return {
      communityServiceHours: Number((data.user_community_service_hours as number) || 0),
      reach: Number((data.user_reach as number) || 0),
      scholarshipPoints: Number((data.user_scholarship_points as number) || 0),
      weeklyNotesGoal: Number((data.weekly_notes_goal as number) || 0),
      weeklyNotesGoalProgress: Number((data.weekly_notes_goal_progress as number) || 0)
    };
  } catch (err) {
    return {
      communityServiceHours: 0,
      reach: 0,
      scholarshipPoints: 0,
      weeklyNotesGoal: 0,
      weeklyNotesGoalProgress: 0
    };
  }
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
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.USER}/${userId}/profile`, {
      fields
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    return {};
  }
};
export const updateUserProfileUrl = async ({
  userId,
  mediaId
}: {
  userId: string;
  mediaId: string;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.USER}/${userId}/profile_image`, {
      is_set: true,
      object_id: mediaId,
      token: 'NA'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    return {};
  }
};
export const getHome = async (): Promise<HomeCard> => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.HOME_V1_1, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        order = [],
        slots = [],
        subtitle = {},
        title = ''
      }
    } = result;
    return {
      order: order.map(item => ({
        cardId: Number((item.card_id as number) || 0),
        hidden: Boolean((item.hidden as boolean) || false)
      })),
      slots: slots.map(item => ({
        bgColor: String((item.bg_color as string) || ''),
        company: String((item.company as string) || ''),
        displayName: String((item.display_name as string) || ''),
        imageUrl: String((item.image_url as string) || ''),
        rewardId: Number((item.reward_id as number) || 0),
        rewardValue: Number((item.reward_value as number) || 0),
        slot: Number((item.slot as number) || 0),
        thumbnailUrl: String((item.thumbnail_url as string) || '')
      })),
      subtitle: {
        text: String((subtitle.text as string) || ''),
        style: (subtitle.style || []).map(s => ({
          substring: String((s.substring as string) || ''),
          textColor: String((s.text_color as string) || ''),
          weight: String((s.weight as string) || '')
        }))
      },
      title: String((title as string) || '')
    };
  } catch (err) {
    return {
      order: [],
      slots: [],
      subtitle: {
        text: '',
        style: []
      },
      title: ''
    };
  }
};
export const getQuests = async (): Promise<QuestsCard> => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.QUESTS, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return {
      activeQuests: (data.active_quests || []).map(item => ({
        id: Number((item.id as number) || 0),
        iconUrl: String((item.icon_url as string) || ''),
        pointsAvailable: Number((item.points_available as number) || 0),
        status: String((item.status as string) || ''),
        task: String((item.task as string) || ''),
        action: {
          name: String(((item.action || {}).name as string) || ''),
          value: String(((item.action || {}).value as string) || ''),
          attributes: {
            feedFilter: {
              classId: Number(((((item.action || {}).attributes || {}).feedFilter || {}).classId as number) || 0)
            }
          }
        }
      })),
      availablePointsText: {
        text: String(((data.available_points_text || {}).text as string) || ''),
        style: ((data.available_points_text || {}).style || []).map(s => ({
          substring: String((s.substring as string) || ''),
          textColor: String((s.text_color as string) || ''),
          weight: String((s.weight as string) || '')
        }))
      },
      progressText: {
        text: String(((data.progress_text || {}).text as string) || ''),
        style: ((data.progress_text || {}).style || []).map(s => ({
          substring: String((s.substring as string) || ''),
          textColor: String((s.text_color as string) || ''),
          weight: String((s.weight as string) || '')
        }))
      }
    };
  } catch (err) {
    return {
      activeQuests: [],
      availablePointsText: {
        text: '',
        style: []
      },
      progressText: {
        text: '',
        style: []
      }
    };
  }
};
export const getCurrentSeason = async (): Promise<CurrentSeasonCard> => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.CURRENT_SEASON, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return {
      seasonId: Number((data.season_id as number) || 0),
      bestAnswers: String((data.best_answers as string) || ''),
      grandPrizeText: String((data.grand_prize_text as string) || ''),
      logoUrl: String((data.logo_url as string) || ''),
      points: String((data.points as string) || ''),
      reach: String((data.reach as string) || ''),
      serviceHours: String((data.service_hours as string) || ''),
      thanks: String((data.thanks as string) || '')
    };
  } catch (err) {
    return {
      seasonId: 0,
      bestAnswers: '',
      grandPrizeText: '',
      logoUrl: '',
      points: '',
      reach: '',
      serviceHours: '',
      thanks: ''
    };
  }
};
export const getInvite = async (): Promise<InviteCard> => {
  try {
    const token = await getToken();
    const result = await axios.get(API_ROUTES.INVITE, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return {
      imageUrl: String((data.image_url as string) || ''),
      referralCode: String((data.referral_code as string) || ''),
      subtitle: {
        text: String(((data.subtitle || {}).text as string) || ''),
        style: ((data.subtitle || {}).style || []).map(s => ({
          substring: String((s.substring as string) || ''),
          textColor: String((s.text_color as string) || ''),
          weight: String((s.weight as string) || '')
        }))
      },
      title: String((data.title as string) || '')
    };
  } catch (err) {
    return {
      imageUrl: '',
      referralCode: '',
      subtitle: {
        text: '',
        style: []
      },
      title: ''
    };
  }
};
export const confirmTooltip = async (tooltipId: number) => {
  try {
    const token = await getToken();
    await axios.post(`${API_ROUTES.USER}/tool_tip`, {
      tool_tip_id: [tooltipId]
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.log(err);
  }
};
export const getSync = async ({
  userId
}: {
  userId: string;
}): Promise<Record<string, any>> => {
  try {
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
  } catch (err) {
    return null;
  }
};
export const sendFeedback = async ({
  origin,
  feedback
}): Promise<object> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.FEEDBACK}`, {
      origin,
      feedback
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const apiGetExpertMode = async (userId: string): Promise<object> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.USER}/${userId}/expert_mode`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return result.data.expert_mode;
  } catch (err) {
    return null;
  }
};
export const apiSetExpertMode = async (userId: string, expert_mode: string): Promise<object> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.USER}/${userId}/expert_mode`, {
      expert_mode
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return result.data.success;
  } catch (err) {
    return false;
  }
};
export const apiGetPointsHistory = async (userId: string, params: object): Promise<object> => callApi({
  url: `${API_ROUTES.USER}/${userId}/points_history`,
  params
});