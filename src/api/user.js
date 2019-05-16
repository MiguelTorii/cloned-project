// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Profile, UserClasses, AvailableClasses } from '../types/models';
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
