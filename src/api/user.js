// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type {
  Profile,
  UserClasses,
  AvailableClasses,
  BlockedUsers,
  Leaderboard,
  StudyCircle,
  UserStats,
  DailyRewards
} from '../types/models';
import { getToken } from './utils';

export const getUserProfile = async ({
  userId
}: {
  userId: string
}): Promise<Profile> => {
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
    userId: String((user_profile.user_id: string) || ''),
    firstName: String((user_profile.first_name: string) || ''),
    lastName: String((user_profile.last_name: string) || ''),
    grade: Number((user_profile.grade: number) || 0),
    hours: Number((user_profile.hours: number) || 0),
    inStudyCircle: Boolean((user_profile.in_study_circle: boolean) || false),
    joined: String((user_profile.joined: string) || ''),
    points: Number((user_profile.points: number) || 0),
    rank: Number((user_profile.rank: number) || 0),
    school: String((user_profile.school: string) || ''),
    state: String((user_profile.state: string) || ''),
    userProfileUrl: String((user_profile.user_profile_url: string) || '')
  };

  const userStatistics = user_statistics.map(stats => ({
    seasonId: Number((stats.season_id: number) || 0),
    bestAnswers: Number((stats.best_answers: number) || 0),
    communityServiceHours: Number((stats.community_service_hours: number) || 0),
    currentSeason: Boolean((stats.current_season: boolean) || false),
    name: String((stats.name: string) || ''),
    points: Number((stats.points: number) || 0),
    rankReached: Number((stats.rank_reached: number) || 0),
    reach: Number((stats.reach: number) || 0),
    thanks: Number((stats.thanks: number) || 0)
  }));

  return { userProfile, about, userStatistics };
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
    userId: user.user_id
  }));
};

export const getUserClasses = async ({
  userId
}: {
  userId: string
}): Promise<UserClasses> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.USER_CLASSES}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const {
    data: { classes = [] }
  } = result;

  const userClasses = classes.map(userClass => ({
    className: String((userClass.class: string) || ''),
    classId: Number((userClass.class_id: number) || 0),
    section: (userClass.section || []).map(item => ({
      firstName: String((item.first_name: string) || ''),
      lastName: String((item.last_name: string) || ''),
      section: String((item.section: string) || ''),
      sectionId: Number((item.section_id: number) || 0),
      subject: String((item.subject: string) || '')
    })),
    subjectId: Number((userClass.subject_id: number) || 0)
  }));

  return userClasses;
};

export const getAvailableClasses = async ({
  userId,
  schoolId
}: {
  userId: string,
  schoolId: number
}): Promise<AvailableClasses> => {
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

export const getBlockedUsers = async ({
  userId
}: {
  userId: string
}): Promise<BlockedUsers> => {
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
};

export const blockUser = async ({
  userId,
  blockedUserId
}: {
  userId: string,
  blockedUserId: string
}): Promise<Object> => {
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
  userId: string,
  blockedUserId: string
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

export const getLeaderboard = async ({
  userId,
  rankId,
  schoolId,
  index,
  limit
}: {
  userId: string,
  rankId: number,
  schoolId: number,
  index: number,
  limit: number
}): Promise<Leaderboard> => {
  const token = await getToken();

  const result = await axios.get(
    `${
      API_ROUTES.LEADERBOARD
    }?user_id=${userId}&rank_id=${rankId}&school_id=${schoolId}&index=${index}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  const { leaderboard = [] } = data;

  return leaderboard.map(item => ({
    userId: String((item.user_id: string) || ''),
    points: Number((item.points: number) || 0),
    username: String((item.username: string) || '')
  }));
};

export const getStudyCircle = async ({
  userId
}: {
  userId: string
}): Promise<StudyCircle> => {
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
};

export const getUserStats = async ({
  userId
}: {
  userId: string
}): Promise<UserStats> => {
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
};

export const getDailyRewards = async ({
  userId
}: {
  userId: string
}): Promise<DailyRewards> => {
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
};

export const updateProfile = async ({
  userId,
  fields
}: {
  userId: string,
  fields: Array<{ field: string, updated_value: string }>
}): Promise<Object> => {
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
  userId: string,
  mediaId: string
}): Promise<Object> => {
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
