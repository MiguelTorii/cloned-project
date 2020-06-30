/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getTodos = async () => {
  try {
    const token = await getToken();

    const result = await axios.get(
      `${API_ROUTES.TODO}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;

    return data.map(d => ({
      categoryId: d.category_id,
      description: d.description,
      sectionId: d.section_id || '',
      id: d.id,
      order: d.order,
      status: d.status,
      title: d.title,
      date: d.due_date || ''
    }))
  } catch (err) {
    return null;
  }
};

export const createTodo = async ({
  title,
  categoryId,
  sectionId,
  date,
  description
}: {
  title: string,
  categoryId: number,
  sectionId: number,
  date: number,
  description: string
}) => {
  try {
    const token = await getToken();

    const result = await axios.post(
      `${API_ROUTES.TODO}`,
      {
        title,
        category: categoryId,
        due_date: date,
        section_id: sectionId,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const updateTodo = async ({
  id,
  title,
  sectionId,
  categoryId,
  description,
  date,
  status,
}: {
  id: number,
  title: string,
  sectionId: number,
  categoryId: number,
  description: string,
  date: number,
  status: number
}) => {
  try {
    const token = await getToken();

    const result = await axios.put(
      `${API_ROUTES.TODO}/${id}/edit`,
      {
        title,
        section_id: sectionId,
        category: categoryId,
        description,
        due_date: date,
        status
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const updateTodoCategory = async ({
  id,
  categoryId,
}: {
  id: number,
  categoryId: number
}) => {
  try {
    const token = await getToken();

    const result = await axios.put(
      `${API_ROUTES.TODO}/${id}/edit`,
      {
        category: categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const updateTodosOrdering = async ({
  ordering,
}: {
  ordering: array
}) => {
  try {
    const token = await getToken();

    const result = await axios.put(
      `${API_ROUTES.TODO}/bulk_edit`,
      {
        ordering,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const archiveTodo = async ({
  id,
}: {
  id: string
}) => {
  try {
    const token = await getToken();

    const result = await axios.post(
      `${API_ROUTES.TODO}/${id}/archive`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data } = result;
    return data;
  } catch (err) {
    return null;
  }
};
