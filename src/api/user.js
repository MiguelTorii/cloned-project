// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type {
  Profile,
  UserClasses,
  AvailableClasses,
  BlockedUsers,
  StudyCircle,
  UserStats,
  DailyRewards,
  HomeCard,
  DailyStreaksCard,
  QuestsCard,
  CurrentSeasonCard,
  InviteCard
} from '../types/models';
import { getToken } from './utils';

export const getUserProfile = async ({
  userId
}: {
  userId: string
}): Promise<Profile> => {
  try {
    if (!userId) throw new Error('No userId specified');
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.USER}/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;
    // eslint-disable-next-line camelcase
    const { user_profile = {}, about = [], user_statistics = [] } = data;

    const userProfile = {
      userId: user_profile.user_id === 0 ? '0' : String((user_profile.user_id: string) || ''),
      firstName: String((user_profile.first_name: string) || ''),
      lastName: String((user_profile.last_name: string) || ''),
      grade: Number((user_profile.grade: number) || 0),
      hours: Number((user_profile.hours: number) || 0),
      inStudyCircle: Boolean((user_profile.in_study_circle: boolean) || false),
      joined: String((user_profile.joined: string) || ''),
      points: Number((user_profile.points: number) || 0),
      rank: Number((user_profile.rank: number) || 0),
      roleId: Number((user_profile.role_id: number) || 1),
      role: String((user_profile.role: string) || ''),
      school: String((user_profile.school: string) || ''),
      state: String((user_profile.state: string) || ''),
      userProfileUrl: String((user_profile.user_profile_url: string) || '')
    };

    const userStatistics = user_statistics.map(stats => ({
      seasonId: Number((stats.season_id: number) || 0),
      bestAnswers: Number((stats.best_answers: number) || 0),
      communityServiceHours: Number(
        (stats.community_service_hours: number) || 0
      ),
      currentSeason: Boolean((stats.current_season: boolean) || false),
      name: String((stats.name: string) || ''),
      points: Number((stats.points: number) || 0),
      rankReached: Number((stats.rank_reached: number) || 0),
      reach: Number((stats.reach: number) || 0),
      thanks: Number((stats.thanks: number) || 0)
    }));

    const newabout = about.map(item => ({
      ...item,
      section:
        item.section ===
        'Do you like helping others with homework study help, if so, which subjects?'
          ? 'Do you enjoy getting involved in helping classmates?'
          : item.section
    }));

    return { userProfile, about: newabout, userStatistics };
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
  schoolId?: number,
  userId: string,
  query: string
}): Promise<Array<Object>> => {
  try {
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
    return users.map(user => ({
      firstName: user.first_name,
      grade: user.grade,
      lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      school: user.school,
      userId: user.user_id,
      relationship: user.relationship,
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getUserClasses = async ({
  userId
}: {
  userId: string
}): Promise<UserClasses> => {
  try {
    const token = await getToken();
    const result = await axios.get(
      `${API_ROUTES.USER_CLASSES_V1_1}?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const {
      data: { classes = [], permissions = {}, empty_state: empty = {}  }
    } = result;

    const userClasses = classes.map(userClass => ({
      className: String((userClass.course_display_name: string) || ''),
      classId: Number((userClass.class_id: number) || 0),
      permissions: {
        canLeave: Boolean(
          ((userClass.permissions || {}).can_leave: boolean) || false
        ),
        canCreate: Boolean(
          ((userClass.permissions || {}).can_create: boolean) || false
        )
      },
      section: (userClass.section || []).map(item => ({
        firstName: String((item.first_name: string) || ''),
        lastName: String((item.last_name: string) || ''),
        section: String((item.section: string) || ''),
        sectionId: Number((item.section_id: number) || 0),
        subject: String((item.subject: string) || ''),
        sectionDisplayName: String((item.section_display_name: string) || ''),
        instructorDisplayName: String((item.instructor_display_name: string) || ''),
      })),
      subjectId: Number((userClass.subject_id: number) || 0),
      courseDisplayName: String((userClass.course_display_name: string) || ''),
      class: String((userClass.class: string) || ''),
      bgColor: String((userClass.bg_color) || ''),
      didInviteClassmates: Boolean((userClass.did_invite_classmates) || false),
      didHideFeedEmptyState: Boolean((userClass.did_hide_feed_empty_state) || false)
    }));

    const emptyState = {
      visibility: Boolean((empty.visibility: boolean) || false),
      logo: String((empty.logo_image: string) || ''),
      body: String((empty.body: string) || '')
    }

    const userPermissions = {
      canAddClasses: Boolean((permissions.can_add_classes: boolean) || false)
    };

    return { classes: userClasses, permissions: userPermissions, emptyState };
  } catch (err) {
    console.log(err);
    return { classes: [], permissions: { canAddClasses: false } };
  }
};

export const getAvailableClasses = async ({
  userId,
  schoolId
}: {
  userId: string,
  schoolId: number
}): Promise<AvailableClasses> => {
  try {
    const token = await getToken();
    const result = await axios.get(
      `${API_ROUTES.CLASSES}?user_id=${userId}&school_id=${schoolId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const {
      data: { classes = {} }
    } = result;

    const keys = Object.keys(classes);

    const classesList = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      classesList[key] = classes[key].map(item => ({
        class: String((item.class: string) || ''),
        classId: Number((item.class_id: number) || 0),
        section: (item.section || []).map(o => ({
          firstName: String((o.first_name: string) || ''),
          lastName: String((o.last_name: string) || ''),
          section: String((o.section: string) || ''),
          sectionId: Number((o.section_id: number) || 0),
          subject: String((o.subject: string) || '')
        })),
        subjectId: Number((item.subject_id: number) || 0)
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
    const result: Object = await axios.get(
      `${API_ROUTES.SUBJECTS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const {
      data: {subjects = []}
    } = result;

    return subjects;
  } catch (err) {
    return [];
  }
};

export const getAvailableSubjectsClasses = async ({
  subjectId
}: {
  subjectId: number
}): Array => {
  try {
    const token = await getToken();
    const result: Object = await axios.get(
      `${API_ROUTES.SUBJECTS}/${subjectId}/classes`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const {
      data: {classes = []}
    } = result;

    return classes;
  } catch (err) {
    return [];
  }
};


export const getAvailableClassesSections = async ({
  classId
}: {
  classId: number
}): Array => {
  try {
    const token = await getToken();
    const result: Object = await axios.get(
      `${API_ROUTES.SECTIONS}?class_id=${classId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const {
      data: {sections = []}
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
  classId: number,
  sectionId?: number,
  userId: string
}) => {
  try {
    const token = await getToken();

    let url = '';
    if (sectionId) {
      url = `${
        API_ROUTES.USER_CLASS
      }/${classId}?user_id=${userId}&section_id=${sectionId}`;
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
  classId: number,
  sectionId?: number,
  userId: string
}) => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const getBlockedUsers = async ({
  userId
}: {
  userId: string
}): Promise<BlockedUsers> => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.GET_BLOCKED_USERS}?user_id=${userId}&token=NA`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    const { users = [] } = data;
    return users.map(item => ({
      userId: String((item.user_id: string) || ''),
      profileImageUrl: String((item.profile_image_url: string) || ''),
      name: String((item.name: string) || '')
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
  userId: string,
  blockedUserId: string
}): Promise<Object> => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const unblockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string,
  blockedUserId: string
}) => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const getStudyCircle = async ({
  userId
}: {
  userId: string
}): Promise<StudyCircle> => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.STUDY_CIRCLE}/${userId}?study_circle_type_id=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    return (data.study_circle || []).map(item => ({
      firstName: String((item.first_name: string) || ''),
      lastName: String((item.last_name: string) || ''),
      profileImageUrl: String((item.profile_image_url: string) || ''),
      userId: String((item.study_circle_id: string) || ''),
      typeId: Number((item.study_circle_type_id: number) || 0)
    }));
  } catch (err) {
    return [];
  }
};

export const getUserStats = async ({
  userId
}: {
  userId: string
}): Promise<UserStats> => {
  try {
    const token = await getToken();

    const result = await axios.get(`${API_ROUTES.HOME}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;
    return {
      communityServiceHours: Number(
        (data.user_community_service_hours: number) || 0
      ),
      reach: Number((data.user_reach: number) || 0),
      scholarshipPoints: Number((data.user_scholarship_points: number) || 0),
      weeklyNotesGoal: Number((data.weekly_notes_goal: number) || 0),
      weeklyNotesGoalProgress: Number(
        (data.weekly_notes_goal_progress: number) || 0
      )
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

export const getDailyRewards = async ({
  userId
}: {
  userId: string
}): Promise<DailyRewards> => {
  try {
    const token = await getToken();

    const result = await axios.post(
      `${API_ROUTES.USER}/${userId}/check_in`,
      {
        user_id: Number(userId)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    const { reward = {} } = data;
    return {
      givenPoints: Number((reward.given_points: number) || 0),
      pointsLeft: Number((reward.points_left: number) || 0),
      stage: Number((reward.stage: number) || 0)
    };
  } catch (err) {
    return {
      givenPoints: 0,
      pointsLeft: 0,
      stage: 0
    };
  }
};

export const updateProfile = async ({
  userId,
  fields
}: {
  userId: string,
  fields: Array<{ field: string, updated_value: string }>
}): Promise<Object> => {
  try {
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
  } catch (err) {
    return {};
  }
};

export const updateUserProfileUrl = async ({
  userId,
  mediaId
}: {
  userId: string,
  mediaId: string
}): Promise<Object> => {
  try {
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
      data: { order = [], slots = [], subtitle = {}, title = '' }
    } = result;

    return {
      order: order.map(item => ({
        cardId: Number((item.card_id: number) || 0),
        hidden: Boolean((item.hidden: boolean) || false)
      })),
      slots: slots.map(item => ({
        bgColor: String((item.bg_color: string) || ''),
        company: String((item.company: string) || ''),
        displayName: String((item.display_name: string) || ''),
        imageUrl: String((item.image_url: string) || ''),
        rewardId: Number((item.reward_id: number) || 0),
        rewardValue: Number((item.reward_value: number) || 0),
        slot: Number((item.slot: number) || 0),
        thumbnailUrl: String((item.thumbnail_url: string) || '')
      })),
      subtitle: {
        text: String((subtitle.text: string) || ''),
        style: (subtitle.style || []).map(s => ({
          substring: String((s.substring: string) || ''),
          textColor: String((s.text_color: string) || ''),
          weight: String((s.weight: string) || '')
        }))
      },
      title: String((title: string) || '')
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

export const getDailyStreaks = async (): Promise<DailyStreaksCard> => {
  try {
    const token = await getToken();

    const result = await axios.get(API_ROUTES.STREAKS, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = result;

    return {
      title: String((data.title: string) || ''),
      currentDay: Number((data.current_day: number) || 0),
      hasSeen: Boolean((data.has_seen: boolean) || false),
      subtitle: {
        text: String(((data.subtitle || {}).text: string) || ''),
        style: ((data.subtitle || {}).style || []).map(s => ({
          substring: String((s.substring: string) || ''),
          textColor: String((s.text_color: string) || ''),
          weight: String((s.weight: string) || '')
        }))
      },
      tiers: data.tiers.map(tier => ({
        day: Number((tier.day: number) || 0),
        points: Number((tier.points: number) || 0)
      }))
    };
  } catch (err) {
    return {
      title: '',
      currentDay: 0,
      hasSeen: false,
      subtitle: {
        text: '',
        style: []
      },
      tiers: []
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
    const { data } = result;

    return {
      activeQuests: (data.active_quests || []).map(item => ({
        id: Number((item.id: number) || 0),
        iconUrl: String((item.icon_url: string) || ''),
        pointsAvailable: Number((item.points_available: number) || 0),
        status: String((item.status: string) || ''),
        task: String((item.task: string) || ''),
        action: {
          name: String(((item.action || {}).name: string) || ''),
          value: String(((item.action || {}).value: string) || ''),
          attributes: {
            feedFilter: {
              classId: Number(
                ((((item.action || {}).attributes || {}).feedFilter || {})
                  .classId: number) || 0
              )
            }
          }
        }
      })),
      availablePointsText: {
        text: String(((data.available_points_text || {}).text: string) || ''),
        style: ((data.available_points_text || {}).style || []).map(s => ({
          substring: String((s.substring: string) || ''),
          textColor: String((s.text_color: string) || ''),
          weight: String((s.weight: string) || '')
        }))
      },
      progressText: {
        text: String(((data.progress_text || {}).text: string) || ''),
        style: ((data.progress_text || {}).style || []).map(s => ({
          substring: String((s.substring: string) || ''),
          textColor: String((s.text_color: string) || ''),
          weight: String((s.weight: string) || '')
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
    const { data } = result;

    return {
      seasonId: Number((data.season_id: number) || 0),
      bestAnswers: String((data.best_answers: string) || ''),
      grandPrizeText: String((data.grand_prize_text: string) || ''),
      logoUrl: String((data.logo_url: string) || ''),
      points: String((data.points: string) || ''),
      reach: String((data.reach: string) || ''),
      serviceHours: String((data.service_hours: string) || ''),
      thanks: String((data.thanks: string) || '')
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
    const { data } = result;

    return {
      imageUrl: String((data.image_url: string) || ''),
      referralCode: String((data.referral_code: string) || ''),
      subtitle: {
        text: String(((data.subtitle || {}).text: string) || ''),
        style: ((data.subtitle || {}).style || []).map(s => ({
          substring: String((s.substring: string) || ''),
          textColor: String((s.text_color: string) || ''),
          weight: String((s.weight: string) || '')
        }))
      },
      title: String((data.title: string) || '')
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
  } catch (err) {
    console.log(err);
  }
};

export const getSync = async ({
  userId
}: {
  userId: string
}): Promise<Object> => {
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
    } = result
    return {
      smallLogo,
      helpLink,
      largeLogo,
      display,
      resourcesTitle,
      resourcesBody,
      viewedTooltips,
      viewedOnboarding
    }
  } catch (err) {
    return null;
  }
};

