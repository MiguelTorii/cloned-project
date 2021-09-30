import { Class } from 'utility-types';
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Class } from '../types/models';
import { getToken } from './utils';

const searchClasses = async (query: stirng): Promise<Class> => {
  try {
    if (query === '') {
      return [];
    }

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
  } catch (err) {
    return [];
  }
};

export default searchClasses;
