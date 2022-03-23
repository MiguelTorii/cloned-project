import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import { getToken } from './utils';

import type { Class } from 'types/models';

const searchClasses = async (query: string): Promise<Class[]> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.SEARCH_CLASS}?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const classes = result.data.classes.map((c) => ({
    classId: c.class_id,
    hasJoined: c.has_joined,
    name: c.course_display_name,
    sectionId: c.section_id
  }));
  return classes;
};

export default searchClasses;
