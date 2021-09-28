/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getTodos = async (params?: any) => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.TODO}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  return data.map((d) => ({
    categoryId: d.category_id,
    description: d.description,
    sectionId: d.section_id || '',
    id: d.id,
    order: d.order,
    status: d.status,
    firstNotificationSeconds: d.first_notification_seconds,
    notificationLastUpdated: d.notification_last_updated,
    title: d.title,
    date: d.due_date || '',
    notifications: []
  }));
};
export const createTodo = async ({
  title,
  categoryId,
  sectionId,
  date,
  description
}: {
  title: string;
  categoryId: number;
  sectionId: number;
  date: number;
  description: string;
}) => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.TODO}`,
    {
      title,
      category: categoryId,
      due_date: date,
      section_id: sectionId,
      description
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data } = result;
  return data;
};
export const updateTodo = async ({
  id,
  title,
  sectionId,
  categoryId,
  reminder,
  description,
  date,
  status
}: {
  id: number;
  title: string;
  sectionId: number;
  categoryId: number;
  reminder: any;
  description: string;
  date: number;
  status: number;
}) => {
  const token = await getToken();
  const result = await axios.put(
    `${API_ROUTES.TODO}/${id}/edit`,
    {
      title,
      section_id: sectionId,
      category: categoryId,
      description,
      due_date: date,
      notification_seconds_until: reminder || 0,
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
};
export const updateTodosOrdering = async ({ ordering }: { ordering: any[] }) => {
  const token = await getToken();
  const result = await axios.put(
    `${API_ROUTES.TODO}/bulk_edit`,
    {
      ordering
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data } = result;
  return data;
};
export const archiveTodo = async ({ id }: { id: string }) => {
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
};
